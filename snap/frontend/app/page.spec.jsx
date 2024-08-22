import Main from './page';
import testHelper from '../components/testHelper';
import symbolSnapFactory from '../utils/snap';
import webSocketClient from '../utils/webSocketClient';
import detectEthereumProvider from '@metamask/detect-provider';
import { act, render } from '@testing-library/react';
import React from 'react';

describe('Main', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		jest.spyOn(webSocketClient, 'create').mockImplementation(() => {
			return {
				open: jest.fn(),
				listenConfirmedTransaction: jest.fn(),
				listenUnconfirmedTransaction: jest.fn(),
				removeSubscriber: jest.fn()
			};
		});
	});

	it('renders the HomeComponent when a provider is detected and symbolSnapFactory is created', async () => {
		// Arrange:
		const mockProvider = { isMetaMask: true };
		detectEthereumProvider.mockResolvedValue(mockProvider);
		jest.spyOn(symbolSnapFactory, 'create').mockReturnValue({
			getSnap: () => ({
				'enabled': true
			}),
			initialSnap: () => ({
				network: {
					identifier: 152,
					networkName: 'testnet',
					url: 'http://localhost:3000'
				},
				accounts: {
					'0x1': {
						id: '0x1',
						addressIndex: 0,
						type: 'metamask'
					}
				},
				currency: {
					symbol: 'usd',
					price: 1.00
				}
			}),
			fetchAccountMosaics: () => ({
				'account1': {
					id: 'account1',
					addressIndex: 1,
					type: 'metamask',
					networkName: 'network',
					label: 'label',
					address: 'address',
					publicKey: 'publicKey'
				}
			}),
			getMosaicInfo: () => ({
				'mosaicId1': {
					divisibility: 6,
					networkName: 'testnet'
				}
			}),
			getAccounts: () => testHelper.generateAccountsState(1),
			fetchAccountTransactions: () => []
		});

		// Act:
		let component;
		await act(async () => {
			component = render(<Main />);
		});

		// Assert:
		const connectionStatus = component.queryByRole('connection-status');
		expect(connectionStatus).toBeInTheDocument();
	});

	it('renders the DetectMetamask component when provider is detected but symbolSnap is not created', async () => {
		// Arrange:
		const mockProvider = { isMetaMask: false };
		detectEthereumProvider.mockResolvedValue(mockProvider);

		// Act:
		let component;
		await act(async () => {
			component = render(<Main />);
		});

		// Assert:
		const text = component.queryByText('Download MetaMask');
		expect(text).toBeInTheDocument();
	});
});
