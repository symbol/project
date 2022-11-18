import sqlite3
import unittest
from datetime import datetime

from dateutil import parser
from symbolchain.CryptoTypes import PublicKey
from symbolchain.facade.SymbolFacade import SymbolFacade

from puller.db.NodeDatabase import NodeDatabase
from puller.model.Endpoint import Endpoint
from puller.model.NodeInfo import NodeInfo

from ..test.DatabaseTestUtils import get_all_table_names

PUBLIC_KEYS = [
	PublicKey(public_key_string) for public_key_string in [
		'5C80309DD937ACB0869F1BEEDE14B552E02AEC4B3569E2E2E76477F84B7E3121',
		'5AA84DF43CD5173A79D91310CE2042434F8B4A7DA157CE3C9DE5C993AEC18293',
		'E3CCB9628EA0CE412BAF7E91B215E0645DC6B83D8CCEB3E849E51A3CF15B0A2F',
		'02028714E352FE1348AC40977F23B1954EAC5836B0BEDD2A5F26E34A83DB773D',
		'AF39DF4A01DA4DDB3545CB1694F71C5D0EB062048DA13ABA871D34BDB04BA715',
		'E6833171B35BCBF1EBF8236F0BEE5E639C3721BC11096CEF13BACF5070EB48F4'
	]
]


class TestNodeDatabase(NodeDatabase):
	def __init__(self, connection, network_name):
		super().__init__(connection, network_name)
		self._placeholder = '?'


class NodeDatabaseTest(unittest.TestCase):
	# region create

	def test_can_create_tables(self):
		# Act:
		table_names = get_all_table_names(TestNodeDatabase, 'symbol')

		# Assert:
		self.assertEqual(set(['symbol_nodes']), table_names)

	# endregion

	# region add_node

	def _assert_db_contents(self, connection, expected_nodes, skip_last_check_time=False):
		cursor = connection.cursor()
		cursor.execute('''SELECT * FROM symbol_nodes''')
		nodes = cursor.fetchall()

		# Assert: check all non datetime fields
		self.assertEqual(expected_nodes, [node[:-2] for node in nodes])

		# check datetime fields are within 1 second of now
		now = datetime.now()

		check_times = []
		for node in nodes:
			db_last_check_time = parser.parse(node[-2])
			if skip_last_check_time:
				check_times.append(db_last_check_time)
			else:
				self.assertLessEqual((now - db_last_check_time).seconds, 1)

			self.assertLessEqual((now - parser.parse(node[-1])).seconds, 1)

		return check_times

	@staticmethod
	def _add_nodes(connection, nodes):
		database = TestNodeDatabase(connection, 'symbol')
		database.create_tables()

		network = SymbolFacade('testnet').network
		for node in nodes:
			database.add_node(NodeInfo(network.identifier, network.generation_hash_seed, *node))

	def test_can_insert_nodes(self):
		# Arrange:
		with sqlite3.connect(':memory:') as connection:
			# Act:
			self._add_nodes(connection, [
				(PUBLIC_KEYS[0], PUBLIC_KEYS[1], Endpoint('https', 'symbol.com', 3001), 'mainnet node', '1.2.3.4', 7),
				(PUBLIC_KEYS[2], PUBLIC_KEYS[3], Endpoint('tcp', 'symbol-rules.net', 7900), None, '1.2.3.8', 3)
			])

			# Assert: matches input
			self._assert_db_contents(connection, [
				(PUBLIC_KEYS[0].bytes, PUBLIC_KEYS[1].bytes, 'https', 'symbol.com', 3001, 'mainnet node', '1.2.3.4', 7),
				(PUBLIC_KEYS[2].bytes, PUBLIC_KEYS[3].bytes, 'tcp', 'symbol-rules.net', 7900, None, '1.2.3.8', 3)
			])

	def test_can_update_nodes(self):
		# Arrange:
		with sqlite3.connect(':memory:') as connection:
			self._add_nodes(connection, [
				(PUBLIC_KEYS[0], PUBLIC_KEYS[1], Endpoint('https', 'symbol.com', 3001), 'mainnet node', '1.2.3.4', 7),
				(PUBLIC_KEYS[2], PUBLIC_KEYS[3], Endpoint('tcp', 'symbol-rules.net', 7900), None, '1.2.3.8', 3),
				(PUBLIC_KEYS[4], PUBLIC_KEYS[5], Endpoint('http', 'google.com', 7900), 'google node', '2.3.5.7', 3)
			])

			# Act:
			self._add_nodes(connection, [
				(PUBLIC_KEYS[0], PUBLIC_KEYS[0], Endpoint('tcp', 'alpha.org', 7900), None, '1.2.3.5', 3),
				(PUBLIC_KEYS[2], PUBLIC_KEYS[2], Endpoint('https', 'beta.net', 3001), 'beta node', '1.2.4.9', 7)
			])

			# Assert: matches updated
			self._assert_db_contents(connection, [
				(PUBLIC_KEYS[0].bytes, PUBLIC_KEYS[0].bytes, 'tcp', 'alpha.org', 7900, None, '1.2.3.5', 3),
				(PUBLIC_KEYS[2].bytes, PUBLIC_KEYS[2].bytes, 'https', 'beta.net', 3001, 'beta node', '1.2.4.9', 7),
				(PUBLIC_KEYS[4].bytes, PUBLIC_KEYS[5].bytes, 'http', 'google.com', 7900, 'google node', '2.3.5.7', 3)
			])

	# endregion

	# region set_failure

	@staticmethod
	def _fake_node_info(main_public_key):
		return NodeInfo(0, None, main_public_key, None, None, None, None, 0)

	def test_can_set_failure(self):
		# Arrange:
		with sqlite3.connect(':memory:') as connection:
			self._add_nodes(connection, [
				(PUBLIC_KEYS[0], PUBLIC_KEYS[1], Endpoint('https', 'symbol.com', 3001), 'mainnet node', '1.2.3.4', 7),
				(PUBLIC_KEYS[2], PUBLIC_KEYS[3], Endpoint('tcp', 'symbol-rules.net', 7900), None, '1.2.3.8', 3),
			])

			# Act:
			now = datetime.now()
			database = TestNodeDatabase(connection, 'symbol')
			database.set_failure(self._fake_node_info(PUBLIC_KEYS[0]), now)

			# Assert:
			check_times = self._assert_db_contents(connection, [
				(PUBLIC_KEYS[0].bytes, PUBLIC_KEYS[1].bytes, 'https', 'symbol.com', 3001, 'mainnet node', '1.2.3.4', 7),
				(PUBLIC_KEYS[2].bytes, PUBLIC_KEYS[3].bytes, 'tcp', 'symbol-rules.net', 7900, None, '1.2.3.8', 3)
			], True)

			# - entry 0 has been updated via set_failure
			# - entry 1 has check time set during arrange
			self.assertEqual(check_times[0], now)
			self.assertGreater(now, check_times[1])
			self.assertLessEqual((now - check_times[1]).seconds, 1)

	# endregion
