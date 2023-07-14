from collections import namedtuple

Message = namedtuple('Message', ['payload', 'is_plain'])
Mosaic = namedtuple('Mosaic', ['namespace_name', 'quantity'])
Modification = namedtuple('Modification', ['modification_type', 'cosignatory_account'])


class Transaction:
	def __init__(
		self,
		transaction_hash,
		height,
		sender,
		fee,
		timestamp,
		deadline,
		signature,
		transaction_type
	):
		"""Create Transaction model."""

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
			self.transaction_type == other.transaction_type,
			self.height == other.height,
			self.sender == other.sender,
			self.fee == other.fee,
			self.timestamp == other.timestamp,
			self.deadline == other.deadline,
			self.signature == other.signature,
			self.transaction_type == other.transaction_type
		])


class TransferTransaction(Transaction):
	def __init__(
		self,
		transaction_hash,
		height,
		sender,
		fee,
		timestamp,
		deadline,
		signature,
		transaction_type,
		amount,
		recipient,
		message,
		mosaics
	):
		"""Create TransferTransaction model."""

		# pylint: disable=too-many-arguments

		super().__init__(
			transaction_hash,
			height,
			sender,
			fee,
			timestamp,
			deadline,
			signature,
			transaction_type
		)

		self.amount = amount
		self.recipient = recipient
		self.message = message
		self.mosaics = mosaics

	def __eq__(self, other):
		return isinstance(other, TransferTransaction) and all([
			super().__eq__(other),
			self.amount == other.amount,
			self.recipient == other.recipient,
			self.message == other.message,
			self.mosaics == other.mosaics
		])


class ImportanceTransferTransaction(Transaction):
	def __init__(
		self,
		transaction_hash,
		height,
		sender,
		fee,
		timestamp,
		deadline,
		signature,
		transaction_type,
		mode,
		remote_account
	):
		"""Create ImportanceTransferTransaction model."""

		# pylint: disable=too-many-arguments

		super().__init__(
			transaction_hash,
			height,
			sender,
			fee,
			timestamp,
			deadline,
			signature,
			transaction_type
		)

		self.mode = mode
		self.remote_account = remote_account

	def __eq__(self, other):
		return isinstance(other, ImportanceTransferTransaction) and all([
			super().__eq__(other),
			self.mode == other.mode,
			self.remote_account == other.remote_account
		])


class ConvertAccountToMultisigTransaction(Transaction):
	def __init__(
		self,
		transaction_hash,
		height,
		sender,
		fee,
		timestamp,
		deadline,
		signature,
		transaction_type,
		min_cosignatories,
		modifications
	):
		"""Create ConvertAccountToMultisigTransaction model."""

		# pylint: disable=too-many-arguments

		super().__init__(
			transaction_hash,
			height,
			sender,
			fee,
			timestamp,
			deadline,
			signature,
			transaction_type
		)

		self.min_cosignatories = min_cosignatories
		self.modifications = modifications

	def __eq__(self, other):
		return isinstance(other, ConvertAccountToMultisigTransaction) and all([
			super().__eq__(other),
			self.min_cosignatories == other.min_cosignatories,
			self.modifications == other.modifications,
		])
