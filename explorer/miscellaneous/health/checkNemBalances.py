import argparse
from collections import namedtuple
from datetime import datetime

from nem.CoinGeckoClient import CoinGeckoClient
from nem.nis1.NisClient import NisClient
from nem.ResourceLoader import ResourceLoader
from nem.sym.SymClient import SymClient

NetworkDescriptor = namedtuple('NetworkDescriptor', [
    'friendly_name', 'resources_name', 'blocks_per_day', 'client_class', 'row_view_factory'
])
AccountRowView = namedtuple('AccountRowView', ['address', 'public_key', 'account_type', 'balance',  'importance', 'percent_vested'])
NetworkPrinterOptions = namedtuple('NetworkPrinterOptions', ['use_friendly_names', 'show_zero_balances'])


# region descriptors

def create_nis_network_descriptor():
    return NetworkDescriptor(**{
        'friendly_name': 'NIS',
        'resources_name': 'nis1.mainnet',
        'blocks_per_day': 1440,

        'client_class': NisClient,

        'row_view_factory': lambda account_info: AccountRowView(**{
            'address': account_info.address,
            'public_key': account_info.public_key,
            'account_type': account_info.remote_status,

            'balance': account_info.balance,
            'importance': account_info.importance,
            'percent_vested': 0 if not account_info.balance else account_info.vested_balance / account_info.balance
        })
    })


def create_sym_network_descriptor():
    return NetworkDescriptor(**{
        'friendly_name': 'SYMBOL',
        'resources_name': 'sym.mainnet',
        'blocks_per_day': 2880,

        'client_class': SymClient,

        'row_view_factory': lambda account_info: AccountRowView(**{
            'address': account_info.address,
            'public_key': account_info.public_key,
            'account_type': account_info.remote_status,

            'balance': account_info.balance,
            'importance': account_info.importance,
            'percent_vested': None
        })
    })

# endregion

# region NetworkPrinter


class NetworkPrinter:
    def __init__(self, network_descriptor, resources_path, network_printer_options):
        self.show_zero_balances = network_printer_options.show_zero_balances
        self.use_friendly_names = network_printer_options.use_friendly_names

        self.friendly_name = network_descriptor.friendly_name
        self.row_view_factory = network_descriptor.row_view_factory

        self.resources = ResourceLoader(network_descriptor.resources_name, resources_path)
        self.api_client = network_descriptor.client_class(self.resources.get_random_node_host())

        self.blocks_per_day = network_descriptor.blocks_per_day
        self.chain_height = self.api_client.get_chain_height()

    def print_all(self, group_names, token_price):
        for group_name in group_names:
            group_description = '[{} @ {}] \033[36m{}\033[39m ACCOUNTS'.format(self.friendly_name, self.chain_height, group_name.upper())

            total_balance, num_matching_accounts = self._print_accounts(
                [account_descriptor['address'] for account_descriptor in self.resources.get_account_descriptors(group_name)],
                group_description)

            if not total_balance and not self.show_zero_balances:
                continue

            if not num_matching_accounts:
                self._print_header(group_description)

            self.print_hline()
            print('{0:,.6f} (~${1:,.2f} USD)'.format(total_balance, int(total_balance) * float(token_price)))
            self.print_hline()
            print()

    def _print_accounts(self, addresses, description):
        account_row_views = [self.row_view_factory(self.api_client.get_account_info(address)) for address in addresses]

        has_printed_header = False
        total_balance = 0
        for account_view in account_row_views:
            if not account_view.balance and not self.show_zero_balances:
                continue

            if not has_printed_header:
                self._print_header(description)
                has_printed_header = True

            formatted_last_harvest_height = self._get_formatted_last_harvest_height(account_view.address)

            print('| {:<40} |  {}  | {} | {:.5f} | {} | {:>20,.6f} | {:>3} |'.format(
                self._get_account_display_name(account_view.address),
                ' ' if not account_view.public_key else 'X',
                account_view.account_type[0:4].upper(),
                round(account_view.importance, 5),
                formatted_last_harvest_height,
                account_view.balance,
                'N/A' if account_view.percent_vested is None else round(account_view.percent_vested * 100)
            ))

            total_balance += account_view.balance

        return (total_balance, len(account_row_views))

    def _print_header(self, description):
        # 50 to account for ansi escape color codes
        print('| {:<50} | PK  | TYPE | IMPORTA |  HARVEST HEIGHT  | {:<20} | V % | '.format(description, 'Balance'))
        self.print_hline()

    def _get_account_display_name(self, address):
        if not self.use_friendly_names:
            return address

        account_descriptor = self.resources.get_descriptor_by_address(address)
        return account_descriptor['name'] if account_descriptor else address

    def _get_formatted_last_harvest_height(self, address):
        harvest_snapshots = self.api_client.get_harvests(address)
        last_harvest_height = 0 if not harvest_snapshots else harvest_snapshots[0].height

        last_harvest_height_description, color_name = self._last_harvest_height_to_string(last_harvest_height)

        formatted_string = '{:>7} {:>8}'.format(last_harvest_height, last_harvest_height_description)
        if not color_name:
            return formatted_string

        color_codes = {'blue': 34, 'red': 31, 'yellow': 33}
        return '\033[{}m{}\033[39m'.format(color_codes[color_name], formatted_string)

    def _last_harvest_height_to_string(self, last_harvest_height):
        if 0 == last_harvest_height:
            return ('NEVER', 'blue')

        blocks_since_harvest = self.chain_height - last_harvest_height
        blocks_per_hour = self.blocks_per_day // 24
        blocks_per_minute = blocks_per_hour // 60

        if blocks_since_harvest < 100 * blocks_per_minute:
            return ('~ {:5.2f}M'.format(blocks_since_harvest / blocks_per_minute), None)

        if blocks_since_harvest < 100 * blocks_per_hour:
            hours = blocks_since_harvest / blocks_per_hour
            color_name = 'red' if hours >= 24 else 'yellow'
            return ('~ {:5.2f}H'.format(hours), color_name)

        return ('~ {:5.2f}D'.format(blocks_since_harvest / self.blocks_per_day), 'red')

    @staticmethod
    def print_hline():
        print('-----' * 23)


# endregion


def main():
    parser = argparse.ArgumentParser(description='check NEM (NIS1 + SYM) balances')
    parser.add_argument('--resources', help='directory containing resources', required=True)
    parser.add_argument('--nis-groups', help='nis account groups to include', type=str, nargs='+')
    parser.add_argument('--sym-groups', help='symbol account groups to include', type=str, nargs='+')
    parser.add_argument('--use-names', help='display friendly account names', action='store_true')
    parser.add_argument('--show-zero-balances', help='show zero balance accounts', action='store_true')
    args = parser.parse_args()

    coin_gecko_client = CoinGeckoClient()
    xem_price = coin_gecko_client.get_price_spot('nem', 'usd')
    xym_price = coin_gecko_client.get_price_spot('symbol', 'usd')

    print(' UTC Time: {0}'.format(datetime.utcnow()))
    print('XEM Price: {0:.6f}'.format(xem_price))
    print('XYM Price: {0:.6f}'.format(xym_price))
    print()

    network_printer_options = NetworkPrinterOptions(**{
        'use_friendly_names': args.use_names,
        'show_zero_balances': args.show_zero_balances
    })

    if args.nis_groups:
        printer = NetworkPrinter(create_nis_network_descriptor(), args.resources, network_printer_options)
        printer.print_all(args.nis_groups, xem_price)

    if args.sym_groups:
        printer = NetworkPrinter(create_sym_network_descriptor(), args.resources, network_printer_options)
        printer.print_all(args.sym_groups, xym_price)


if '__main__' == __name__:
    main()
