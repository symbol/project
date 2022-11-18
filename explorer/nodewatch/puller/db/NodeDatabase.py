from datetime import datetime


class NodeDatabase:
	"""Database containing nodes."""

	def __init__(self, connection, network_name):
		"""Creates a database around a database connection."""

		self.connection = connection
		self.network_name = network_name
		self.table_name = f'{self.network_name}_nodes'

		self._placeholder = None

	def _fix_placeholders(self, statement):
		if not self._placeholder:
			return statement

		return statement.replace('%s', self._placeholder)

	def create_tables(self):
		"""Creates balances database tables."""

		cursor = self.connection.cursor()
		cursor.execute(f'''CREATE TABLE IF NOT EXISTS {self.table_name} (
			main_public_key blob UNIQUE PRIMARY KEY NOT NULL,
			node_public_key blob NOT NULL,
			protocol text NOT NULL,
			ip_or_hostname text NOT NULL,
			port int NOT NULL,
			name text,
			version text NOT NULL,
			roles int NOT NULL,
			last_check_time datetime NOT NULL,
			last_success_time datetime NOT NULL
		)''')

	def _add_node(self, node_info):
		now = datetime.now()

		cursor = self.connection.cursor()
		cursor.execute(
			self._fix_placeholders(f'''INSERT INTO {self.table_name} VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''),
			(
				node_info.main_public_key.bytes,
				node_info.node_public_key.bytes,
				node_info.endpoint.protocol,
				node_info.endpoint.host,
				node_info.endpoint.port,
				node_info.name,
				node_info.version,
				node_info.roles,
				now,
				now
			))
		self.connection.commit()

	def _update_node(self, node_info):  # TODO: could be public if wanted/needed
		now = datetime.now()

		cursor = self.connection.cursor()
		cursor.execute(
			self._fix_placeholders(
				f'''UPDATE {self.table_name} SET
				node_public_key = %s,
				protocol = %s,
				ip_or_hostname = %s,
				port = %s,
				name = %s,
				version = %s,
				roles = %s,
				last_check_time = %s,
				last_success_time = %s
				WHERE main_public_key = %s'''
			),
			(
				node_info.node_public_key.bytes,
				node_info.endpoint.protocol,
				node_info.endpoint.host,
				node_info.endpoint.port,
				node_info.name,
				node_info.version,
				node_info.roles,
				now,  # note, update both fields...
				now,

				node_info.main_public_key.bytes
			))
		self.connection.commit()

	def add_node(self, node_info):
		"""
		Adds a node to the nodes table.
		This function should only be called on success.
		"""

		cursor = self.connection.cursor()
		find_by_main_public_key = self._fix_placeholders(f'SELECT true FROM {self.table_name} WHERE main_public_key = %s')
		cursor.execute(find_by_main_public_key, (node_info.main_public_key.bytes,))
		has_node_info = cursor.fetchone()

		if has_node_info and has_node_info[0]:
			self._update_node(node_info)
		else:
			self._add_node(node_info)

	def set_failure(self, node_info, check_time):
		cursor = self.connection.cursor()
		cursor.execute(
			self._fix_placeholders(f'''UPDATE {self.table_name} SET last_check_time = %s WHERE main_public_key = %s'''),
			(check_time, node_info.main_public_key.bytes))
		self.connection.commit()
