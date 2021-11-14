import socket
import ssl
from binascii import unhexlify
from pathlib import Path

from symbolchain.core.BufferReader import BufferReader
from symbolchain.core.BufferWriter import BufferWriter
from symbolchain.core.CryptoTypes import Hash256, PublicKey
from symbolchain.core.symbol.Network import Address, Network
from symbolchain.core.symbol.NetworkTimestamp import NetworkTimestamp
from zenlog import log

from .pod import TransactionSnapshot
from .TimeoutHTTPAdapter import create_http_session

XYM_NETWORK_MOSAIC_IDS_MAP = {
    0x68: '6BED913FA20223F8',
    0x98: 'E74B99BA41F4AFEE'
}

MICROXYM_PER_XYM = 1000000.0
RECEIPT_TYPES = {
    'harvest': 0x2143,
    'inflation': 0x5143,
    'hashlock_expired': 0x2348,
    'secretlock_expired': 0x2352,
    'mosaic_expiry': 0x414D,
    'namespace_expiry': 0x414E
}
TRANSACTION_TYPES = {
    'transfer': 0x4154,
    'aggregate_complete': 0x4141,
    'aggregate_bonded': 0x4241
}


class AccountInfo:
    def __init__(self):
        self.address = None
        self.balance = 0
        self.public_key = ''
        self.importance = 0.0

        self.remote_status = None
        self.linked_public_key = None
        self.voting_epoch_ranges = []


class SymbolPeerClient:
    def __init__(self, host, port=7890, **kwargs):
        (self.node_host, self.node_port) = (host, port)
        self.certificate_directory = Path(kwargs.get('certificate_directory'))
        self.timeout = kwargs.get('timeout', 10)

        self.ssl_context = ssl.create_default_context()
        self.ssl_context.check_hostname = False
        self.ssl_context.verify_mode = ssl.CERT_NONE
        self.ssl_context.load_cert_chain(
            self.certificate_directory / 'node.full.crt.pem',
            keyfile=self.certificate_directory / 'node.key.pem')

    def get_node_info(self):
        try:
            with socket.create_connection((self.node_host, self.node_port), self.timeout) as sock:
                with self.ssl_context.wrap_socket(sock) as ssock:
                    self.send_node_info_request(ssock)
                    return self.read_node_info_response(ssock)
        except socket.timeout as ex:
            raise ConnectionRefusedError from ex

    @staticmethod
    def send_node_info_request(ssock):
        writer = BufferWriter()
        writer.write_int(8, 4)
        writer.write_int(0x111, 4)
        ssock.send(writer.buffer)

    def read_node_info_response(self, ssock):
        read_buffer = ssock.read()

        if 0 == len(read_buffer):
            raise ConnectionRefusedError('socket returned empty data for {}'.format(self.node_host))

        size = BufferReader(read_buffer).read_int(4)

        while len(read_buffer) < size:
            read_buffer = b''.join([read_buffer, ssock.read()])

        node_info = {}

        reader = BufferReader(read_buffer)
        reader.read_int(8)  # packet header
        reader.read_int(4)  # size

        node_info['version'] = reader.read_int(4)
        node_info['publicKey'] = str(PublicKey(reader.read_bytes(32)))
        node_info['networkGenerationHashSeed'] = str(Hash256(reader.read_bytes(32)))
        node_info['roles'] = reader.read_int(4)
        node_info['port'] = reader.read_int(2)
        node_info['networkIdentifier'] = reader.read_int(1)

        host_size = reader.read_int(1)
        name_size = reader.read_int(1)
        node_info['host'] = reader.read_bytes(host_size).decode('utf-8')
        node_info['friendlyName'] = reader.read_bytes(name_size).decode('utf-8')

        return node_info

    @staticmethod
    def get_peers():
        # not implemented
        return []


class SymbolClient:
    def __init__(self, host, port=3000, **kwargs):
        self.session = create_http_session(**kwargs)
        (self.node_host, self.node_port) = (host, port)

    @staticmethod
    def from_node_info_dict(dict_node_info, **kwargs):
        if not dict_node_info['roles'] & 2:
            return SymbolPeerClient(dict_node_info['host'], dict_node_info['port'], **kwargs)

        return SymbolClient(dict_node_info['host'], **kwargs)

    def get_chain_height(self):
        json_response = self._get_json('chain/info')
        return int(json_response['height'])

    def get_finalization_epoch(self):
        json_response = self._get_json('chain/info')
        return int(json_response['latestFinalizedBlock']['finalizationEpoch'])

    def get_harvester_signer_public_key(self, height):
        json_response = self._get_json('blocks/{}'.format(height))
        return json_response['block']['signerPublicKey']

    def get_node_info(self):
        json_response = self._get_json('node/info')
        return json_response

    def get_peers(self):
        json_response = self._get_json('node/peers')
        return json_response

    def get_account_info(self, address):
        json_response = self._get_json('accounts/{}'.format(address))
        return self._parse_account_info(json_response['account'])

    def get_richlist_account_infos(self, page_number, page_size, mosaic_id):
        url_pattern = 'accounts?pageNumber={}&pageSize={}&order=desc&orderBy=balance&mosaicId={}'
        json_response = self._get_json(url_pattern.format(page_number, page_size, mosaic_id))

        account_infos = []
        for json_account_container in json_response['data']:
            account_infos.append(self._parse_account_info(json_account_container['account'], mosaic_id))

        return account_infos

    @staticmethod
    def _parse_account_info(json_account, mosaic_id=None):
        account_info = AccountInfo()
        account_info.address = Address(unhexlify(json_account['address']))

        if not mosaic_id:
            mosaic_id = XYM_NETWORK_MOSAIC_IDS_MAP[account_info.address.bytes[0]]

        xym_mosaic = next((mosaic for mosaic in json_account['mosaics'] if mosaic['id'] == mosaic_id), None)
        if xym_mosaic:
            account_info.balance = int(xym_mosaic['amount']) / MICROXYM_PER_XYM

        account_info.public_key = json_account['publicKey']
        account_info.importance = float(json_account['importance']) / (9 * 10 ** 15 - 1)

        account_info.remote_status = ['Unlinked', 'Main', 'Remote', 'Remote_Unlinked'][json_account['accountType']]

        json_supplemental_public_keys = json_account['supplementalPublicKeys']
        if 'linked' in json_supplemental_public_keys:
            account_info.linked_public_key = json_supplemental_public_keys['linked']['publicKey']

        if 'voting' in json_supplemental_public_keys:
            for json_voting_public_key in json_supplemental_public_keys['voting']['publicKeys']:
                account_info.voting_epoch_ranges.append((json_voting_public_key['startEpoch'], json_voting_public_key['endEpoch']))

        return account_info

    def get_harvests(self, address, start_id=None):
        json_response = self._get_page('statements/transaction?targetAddress={}&order=desc'.format(address), start_id)

        snapshots = []
        for json_statement_envelope in json_response['data']:
            json_statement = json_statement_envelope['statement']

            snapshot = TransactionSnapshot(address, 'harvest')
            snapshot.height = int(json_statement['height'])
            snapshot.timestamp = self._get_block_time_and_multiplier(snapshot.height)[0]

            for json_receipt in json_statement['receipts']:
                receipt_type = json_receipt['type']
                if any(RECEIPT_TYPES[name] == receipt_type for name in ['harvest', 'hashlock_expired', 'secretlock_expired']):
                    if Address(address) == Address(unhexlify(json_receipt['targetAddress'])):
                        snapshot.amount += int(json_receipt['amount'])
                elif receipt_type not in RECEIPT_TYPES.values():
                    log.warn('detected receipt of unknown type 0x{:X}'.format(receipt_type))
                    continue

            snapshot.amount /= MICROXYM_PER_XYM
            snapshot.collation_id = json_statement_envelope['id']
            snapshots.append(snapshot)

        return snapshots

    def get_transfers(self, address, start_id=None):
        json_response = self._get_page('transactions/confirmed?address={}&order=desc&embedded=true'.format(address), start_id)

        snapshots = []
        for json_transaction_and_meta in json_response['data']:
            json_transaction = json_transaction_and_meta['transaction']
            json_meta = json_transaction_and_meta['meta']

            snapshot = TransactionSnapshot(address, 'transfer')
            snapshot.height = int(json_meta['height'])
            (snapshot.timestamp, fee_multiplier) = self._get_block_time_and_multiplier(snapshot.height)

            snapshot.hash = json_meta['hash']
            (amount_microxym, fee_microxym) = self._process_xym_changes(snapshot, json_transaction, snapshot.hash, fee_multiplier)

            snapshot.amount = amount_microxym / MICROXYM_PER_XYM
            snapshot.fee_paid = fee_microxym / MICROXYM_PER_XYM
            snapshot.collation_id = json_transaction_and_meta['id']
            snapshots.append(snapshot)

        return snapshots

    def _process_xym_changes(self, snapshot, json_transaction, transaction_hash, fee_multiplier):
        effective_fee = int(json_transaction['size'] * fee_multiplier)

        amount_microxym = 0
        fee_microxym = 0
        transaction_type = json_transaction['type']
        if self._is_aggregate(transaction_type):
            json_aggregate_transaction = self._get_json('transactions/confirmed/{}'.format(transaction_hash))
            json_embedded_transactions = [
                json_embedded_transaction_and_meta['transaction']
                for json_embedded_transaction_and_meta in json_aggregate_transaction['transaction']['transactions']
            ]
            amount_microxym = self._calculate_transfer_amount(snapshot.address, json_embedded_transactions)
        elif TRANSACTION_TYPES['transfer'] == transaction_type:
            amount_microxym = self._calculate_transfer_amount(snapshot.address, [json_transaction])
        else:
            snapshot.comments = 'unsupported transaction of type 0x{:X}'.format(transaction_type)

        if self._is_signer(snapshot.address, json_transaction):
            fee_microxym = -effective_fee

        return (amount_microxym, fee_microxym)

    @staticmethod
    def _calculate_transfer_amount(address, json_transactions):
        amount_microxym = 0
        for json_transaction in json_transactions:
            if TRANSACTION_TYPES['transfer'] != json_transaction['type']:
                continue

            direction = 0
            if SymbolClient._is_signer(address, json_transaction):
                direction = -1
            elif SymbolClient._is_recipient(address, json_transaction):
                direction = 1

            for json_mosaic in json_transaction['mosaics']:
                if json_mosaic['id'] == XYM_NETWORK_MOSAIC_IDS_MAP[Address(address).bytes[0]]:
                    amount_microxym += int(json_mosaic['amount']) * direction

        return amount_microxym

    @staticmethod
    def _is_signer(address, json_transaction):
        return Address(address) == Network.MAINNET.public_key_to_address(PublicKey(json_transaction['signerPublicKey']))

    @staticmethod
    def _is_recipient(address, json_transaction):
        return Address(address) == Address(unhexlify(json_transaction['recipientAddress']))

    @staticmethod
    def _is_aggregate(transaction_type):
        return any(TRANSACTION_TYPES[name] == transaction_type for name in ['aggregate_complete', 'aggregate_bonded'])

    def _get_block_time_and_multiplier(self, height):
        json_block_and_meta = self._get_json('blocks/{}'.format(height))
        json_block = json_block_and_meta['block']
        return (NetworkTimestamp(int(json_block['timestamp'])).to_datetime(), json_block['feeMultiplier'])

    def _get_page(self, rest_path, start_id):
        return self._get_json(rest_path if not start_id else '{}&offset={}'.format(rest_path, start_id))

    def _get_json(self, rest_path):
        json_http_headers = {'Content-type': 'application/json'}
        return self.session.get('http://{}:{}/{}'.format(self.node_host, self.node_port, rest_path), headers=json_http_headers).json()
