from collections import namedtuple

from symbolchain.CryptoTypes import Hash256, PublicKey
from symbolchain.facade.SymbolFacade import SymbolFacade
from symbolchain.sc import NetworkType, TransactionType
from symbolchain.symbol.Network import NetworkTimestamp

AggregateDescriptor = namedtuple('AggregateDescriptor', ['size', 'fee_multiplier', 'timestamp', 'signer_public_key'])
LinkDescriptor = namedtuple('LinkDescriptor', ['transaction_type', 'linked_public_key', 'link_action', 'epoch_range'])


def assert_aggregate_complete_transaction(asserter, transaction, expected_descriptor):  # pylint: disable=invalid-name
	"""Asserts that an aggregate complete transaction has expected properties."""

	asserter.assertEqual(expected_descriptor.size, transaction.size)
	asserter.assertEqual(TransactionType.AGGREGATE_COMPLETE, transaction.type_)
	asserter.assertEqual(2, transaction.version)
	asserter.assertEqual(NetworkType.TESTNET, transaction.network)

	asserter.assertEqual(expected_descriptor.signer_public_key, PublicKey(transaction.signer_public_key.bytes))
	asserter.assertEqual(expected_descriptor.size * expected_descriptor.fee_multiplier, transaction.fee.value)
	asserter.assertEqual(NetworkTimestamp(expected_descriptor.timestamp), NetworkTimestamp(transaction.deadline.value))

	asserter.assertEqual(SymbolFacade.hash_embedded_transactions(transaction.transactions), Hash256(transaction.transactions_hash.bytes))


def assert_link_transaction(asserter, transaction, expected_link_descriptor):
	"""Asserts that a link / unlink transaction has expected properties."""

	asserter.assertEqual(expected_link_descriptor.transaction_type, transaction.type_)
	asserter.assertEqual(1, transaction.version)
	asserter.assertEqual(NetworkType.TESTNET, transaction.network)

	asserter.assertEqual(expected_link_descriptor.linked_public_key, PublicKey(transaction.linked_public_key.bytes))
	asserter.assertEqual(expected_link_descriptor.link_action, transaction.link_action)

	if expected_link_descriptor.epoch_range:
		asserter.assertEqual(expected_link_descriptor.epoch_range[0], transaction.start_epoch.value)
		asserter.assertEqual(expected_link_descriptor.epoch_range[1], transaction.end_epoch.value)
