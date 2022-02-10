import json
from binascii import Error as binasciiError
from binascii import unhexlify

from symbolchain.CryptoTypes import Hash256, PublicKey
from symbolchain.nem.Network import Network


class ProcessError:
	"""Represents a processing error."""

	def __init__(self, address, transaction_hash, message):
		self.address = address
		self.transaction_hash = transaction_hash
		self.message = message
		self.is_error = True


class OptinRequest:
	"""Represents a valid optin request."""

	def __init__(self, address, transaction_hash, message_dict):
		self.address = address
		self.transaction_hash = transaction_hash
		self.destination_public_key = PublicKey(message_dict['destination'])
		self.multisig_public_key = PublicKey(message_dict['origin']) if 101 == message_dict['type'] else None
		self.is_error = False


class Processor:
	def __init__(self, transaction_and_meta_dict):
		self.transaction_hash = Hash256(transaction_and_meta_dict['meta']['hash']['data'])
		self.transaction_dict = transaction_and_meta_dict['transaction']
		self.transaction_signer_address = Network.MAINNET.public_key_to_address(PublicKey(self.transaction_dict['signer']))

	def process(self):
		if 'message' not in self.transaction_dict:
			return self._make_error('transaction does not have a message')

		message_dict = self.transaction_dict['message']
		return self._process_message(message_dict)

	def _process_message(self, message_dict):
		prefix = 'transaction message'

		if not message_dict:
			return self._make_error(f'{prefix} is not present')

		if 1 != message_dict['type']:
			return self._make_error(f'{prefix} has wrong type')

		try:
			message_payload = unhexlify(message_dict['payload'])
		except binasciiError:
			return self._make_error(f'{prefix} is not hex encoded')

		try:
			optin_message_dict = json.loads(message_payload)
		except ValueError:
			return self._make_error(f'{prefix} is not valid json')

		return self._process_optin_message(optin_message_dict)

	def _process_optin_message(self, message_dict):
		prefix = 'transaction optin message'

		if not isinstance(message_dict, dict):
			return self._make_error(f'{prefix} JSON is not an object')

		if message_dict.get('type') not in (100, 101):
			return self._make_error(f'{prefix} has unexpected type')

		try:
			return OptinRequest(self.transaction_signer_address, self.transaction_hash, message_dict)
		except (KeyError, ValueError):
			return self._make_error(f'{prefix} is malformed')

	def _make_error(self, message):
		return ProcessError(self.transaction_signer_address, self.transaction_hash, message)


def process_nem_optin_request(transaction_and_meta_dict):
	"""Processes a NEM transaction and meta dictionary and parses out the optin request or an error."""
	return Processor(transaction_and_meta_dict).process()
