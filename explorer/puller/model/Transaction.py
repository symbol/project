class Transaction:
	def __init__(self, transaction_hash, height, sender, fee, timestamp, deadline, signature, transaction_type):
		"""Create Block model."""

		# pylint: disable=too-many-arguments

		self.transaction_hash = transaction_hash
		self.height = height
		self.sender = sender
		self.fee = fee
		self.timestamp = timestamp
		self.deadline = deadline
		self.signature = signature
		self.transaction_type = transaction_type

	def __eq__(self, other):
		return isinstance(other, Transaction) and all([
			self.transaction_hash == other.transaction_hash,
			self.height == other.height,
			self.sender == other.sender,
			self.fee == other.fee,
			self.timestamp == other.timestamp,
			self.deadline == other.deadline,
			self.signature == other.signature,
			self.transaction_type == other.transaction_type
		])


class TransferTransaction:
	def __init__(self, amount, recipient, mosaics, message, is_apostille):
		"""Create TransferTransaction model."""

		# pylint: disable=too-many-arguments

		self.amount = amount
		self.recipient = recipient
		self.mosaics = mosaics
		self.message = message
		self.is_apostille = is_apostille

	def __eq__(self, other):
		return isinstance(other, TransferTransaction) and all([
			self.amount == other.amount,
			self.recipient == other.recipient,
			self.mosaics == other.mosaics,
			self.message == other.message,
			self.is_apostille == other.is_apostille
		])


class AccountKeyLinkTransaction:
	def __init__(self, mode, remote_account):
		""""Create AccountKeyLinkTransaction model."""

		# pylint: disable=too-many-arguments

		self.mode = mode
		self.remote_account = remote_account

	def __eq__(self, other):
		return isinstance(other, AccountKeyLinkTransaction) and all([
			self.mode == other.mode,
			self.remote_account == other.remote_account
		])

