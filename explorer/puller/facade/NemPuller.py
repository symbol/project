import configparser
import json

from symbolchain.facade.NemFacade import NemFacade
from symbolchain.nc import TransactionType
from symbolchain.nem.Network import Network
from symbollightapi.connector.NemConnector import NemConnector
from zenlog import log

from db.NemDatabase import NemDatabase
from model.Block import Block
from model.Mosaic import Mosaic
from model.Transaction import (
	AccountKeyLinkTransaction,
	MosaicDefinitionTransaction,
	MosaicSupplyChangeTransaction,
	MultisigAccountModificationTransaction,
	MultisigTransaction,
	NamespaceRegistrationTransaction,
	Transaction,
	TransferTransaction
)


class NemPuller:
	"""Facade for pulling data from NEM network."""

	def __init__(self, node_url, config_file, network_type='mainnet'):
		"""Creates a facade object."""

		config = configparser.ConfigParser()
		config.read(config_file)

		db_config = config['nem_db']

		network = Network.MAINNET if network_type == 'mainnet' else Network.TESTNET

		self.nem_db = NemDatabase(db_config)
		self.nem_connector = NemConnector(node_url, network)
		self.nem_facade = NemFacade(str(network))

	def _process_block(self, block_data):
		"""Process block data."""

		timestamp = Block.convert_timestamp_to_datetime(self.nem_facade, block_data.timestamp)
		total_fees = sum(transaction.fee for transaction in block_data.transactions)

		return Block(
			block_data.height,
			timestamp,
			total_fees,
			len(block_data.transactions),
			block_data.difficulty,
			block_data.block_hash,
			block_data.signer,
			block_data.signature,
		)

	def _process_mosaic_definition(self, cursor, transaction, block_height):
		"""Process mosaic definition data."""

		mosaic_properties = transaction.properties
		mosaic_levy = transaction.levy if transaction.levy else None

		mosaic_definition = Mosaic(
			transaction.namespace_name,
			transaction.description,
			transaction.creator,
			block_height,
			mosaic_properties.initial_supply,
			mosaic_properties.divisibility,
			mosaic_properties.supply_mutable,
			mosaic_properties.transferable,
			mosaic_levy.type if mosaic_levy else None,
			mosaic_levy.namespace_name if mosaic_levy else None,
			mosaic_levy.fee if mosaic_levy else None,
			mosaic_levy.recipient if mosaic_levy else None,
		)

		self.nem_db.insert_mosaic(cursor, mosaic_definition)

	def _process_mosaic_supply_change(self, cursor, transaction):
		"""Process mosaic supply change data."""

		mosaic = self.nem_db.get_mosaic_by_namespace_name(cursor, transaction.namespace_name)

		if mosaic:
			adjustment = transaction.delta if transaction.supply_type == 1 else -transaction.delta
			mosaic.initial_supply += adjustment
			self.nem_db.update_mosaic_supply(cursor, transaction.namespace_name, mosaic.initial_supply)

	def _store_block(self, cursor, block):
		"""Store block data."""

		save_block = self._process_block(block)
		self.nem_db.insert_block(cursor, save_block)

	def _store_transactions(self, cursor, transactions):
		"""Store transactions data."""

		for transaction in transactions:
			timestamp = Block.convert_timestamp_to_datetime(self.nem_facade, transaction.timestamp)
			deadline = Block.convert_timestamp_to_datetime(self.nem_facade, transaction.deadline)

			transaction_common = Transaction(
				transaction.transaction_hash,
				transaction.height,
				transaction.sender,
				transaction.fee,
				timestamp,
				deadline,
				transaction.signature,
				transaction.transaction_type,
			)

			if TransactionType.TRANSFER.value == transaction.transaction_type:
				# checking message first byte "fe" (HEX:) for apostille
				is_apostille = (
					transaction.recipient == 'NCZSJHLTIMESERVBVKOW6US64YDZG2PFGQCSV23J' and
					transaction.message[0][:2] == 'fe' and
					transaction.message[1] == 1
				)

				mosaics = json.dumps([mosaic._asdict() for mosaic in transaction.mosaics]) if transaction.mosaics else None

				transfer_transaction = TransferTransaction(
					transaction.amount,
					transaction.recipient,
					mosaics,
					json.dumps(transaction.message._asdict()),
					is_apostille
				)

				transaction_id = self.nem_db.insert_transaction(cursor, transaction_common)

				self.nem_db.insert_transactions_transfer(cursor, transaction_id, transfer_transaction)

			elif TransactionType.ACCOUNT_KEY_LINK.value == transaction.transaction_type:
				account_key_link_transaction = AccountKeyLinkTransaction(
					transaction.mode,
					transaction.remote_account
				)

				transaction_id = self.nem_db.insert_transaction(cursor, transaction_common)

				self.nem_db.insert_transactions_account_key_link(cursor, transaction_id, account_key_link_transaction)

			elif TransactionType.MULTISIG_ACCOUNT_MODIFICATION.value == transaction.transaction_type:
				multisig_account_modification_transaction = MultisigAccountModificationTransaction(
					transaction.min_cosignatories,
					json.dumps([modification._asdict() for modification in transaction.modifications])
				)

				transaction_id = self.nem_db.insert_transaction(cursor, transaction_common)

				self.nem_db.insert_transactions_multisig_account_modification(cursor, transaction_id, multisig_account_modification_transaction)

			elif TransactionType.MULTISIG.value == transaction.transaction_type:
				multisig_transaction = MultisigTransaction(
					json.dumps([signature.__dict__ for signature in transaction.signatures]),
					json.dumps(transaction.other_transaction.__dict__),
					transaction.inner_hash,
				)

				transaction_id = self.nem_db.insert_transaction(cursor, transaction_common)

				self.nem_db.insert_transactions_multisig(cursor, transaction_id, multisig_transaction)

			elif TransactionType.NAMESPACE_REGISTRATION.value == transaction.transaction_type:
				namespace_registration_transaction = NamespaceRegistrationTransaction(
					transaction.rental_fee_sink,
					transaction.rental_fee,
					transaction.parent,
					transaction.namespace,
				)

				transaction_id = self.nem_db.insert_transaction(cursor, transaction_common)

				self.nem_db.insert_transactions_namespace_registration(cursor, transaction_id, namespace_registration_transaction)

			elif TransactionType.MOSAIC_DEFINITION.value == transaction.transaction_type:
				mosaic_properties = transaction.properties
				mosaic_levy = transaction.levy if transaction.levy else None

				mosaic_definition_transaction = MosaicDefinitionTransaction(
					transaction.creation_fee_sink,
					transaction.creation_fee,
					transaction.creator,
					transaction.description,
					transaction.namespace_name,
					json.dumps(mosaic_properties._asdict()),
					json.dumps(mosaic_levy._asdict()) if mosaic_levy else None,
				)

				transaction_id = self.nem_db.insert_transaction(cursor, transaction_common)

				self.nem_db.insert_transactions_mosaic_definition_creation(cursor, transaction_id, mosaic_definition_transaction)

			elif TransactionType.MOSAIC_SUPPLY_CHANGE.value == transaction.transaction_type:
				mosaic_supply_change_transaction = MosaicSupplyChangeTransaction(
					transaction.supply_type,
					transaction.delta,
					transaction.namespace_name,
				)

				transaction_id = self.nem_db.insert_transaction(cursor, transaction_common)

				self.nem_db.insert_transactions_mosaic_supply_change(cursor, transaction_id, mosaic_supply_change_transaction)

	def _store_mosaics(self, cursor, transactions, block_height):
		"""Store mosaics."""

		for transaction in transactions:
			if TransactionType.MOSAIC_DEFINITION.value == transaction.transaction_type:
				self._process_mosaic_definition(cursor, transaction, block_height)
			elif TransactionType.MOSAIC_SUPPLY_CHANGE.value == transaction.transaction_type:
				self._process_mosaic_supply_change(cursor, transaction)

	async def sync_nemesis_block(self):
		"""Sync the Nemesis block."""

		nemesis_block = await self.nem_connector.get_block(1)

		# initialize cursor
		cursor = self.nem_db.connection.cursor()

		self._store_block(cursor, nemesis_block)
		self._store_transactions(cursor, nemesis_block.transactions)

		# commit changes
		self.nem_db.connection.commit()

		log.info('added block from height 1')

	async def sync_blocks(self, db_height, chain_height):
		"""Sync network blocks."""

		# sync network blocks in database
		while chain_height > db_height:

			blocks = await self.nem_connector.get_blocks_after(db_height)

			# initialize cursor
			cursor = self.nem_db.connection.cursor()

			for block in blocks:
				self._store_block(cursor, block)
				self._store_transactions(cursor, block.transactions)
				self._store_mosaics(cursor, block.transactions, block.height)

			# commit changes
			self.nem_db.connection.commit()

			db_height = blocks[-1].height
			first_block_height = blocks[0].height

			log.info(f'added block from height {first_block_height} - {db_height}')
