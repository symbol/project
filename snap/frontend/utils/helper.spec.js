import helper from './helper';

describe('helper', () => {
	describe('setupSnap', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		const dispatch = {
			setLoadingStatus: jest.fn(),
			setNetwork: jest.fn(),
			setSelectedAccount: jest.fn(),
			setAccounts: jest.fn()
		};

		const symbolSnap = {
			initialSnap: jest.fn(),
			createAccount: jest.fn()
		};

		const mockSnapState = {
			network: {
				identifier: 152,
				networkName: 'testnet',
				url: 'http://localhost:3000'
			},
			accounts: {}
		};

		const assertSetupSnap = (mockSnapState, networkName) => {
			// Assert:
			expect(dispatch.setLoadingStatus).toHaveBeenNthCalledWith(1, {
				isLoading: true,
				message: 'Initializing Snap...'
			});
			expect(dispatch.setLoadingStatus).toHaveBeenNthCalledWith(2, {
				isLoading: false,
				message: ''
			});
			expect(symbolSnap.initialSnap).toHaveBeenCalledWith(networkName);
			expect(dispatch.setNetwork).toHaveBeenCalledWith(mockSnapState.network);
		};

		it('initializes snap and sets network and selected account if accounts exist', async () => {
			// Arrange:
			const networkName = 'testnet';

			mockSnapState.accounts = {
				'0x1': {
					id: '0x1',
					address: 'address',
					label: 'Primary Account',
					networkName: 'testnet'
				},
				'0x2': {
					id: '0x2',
					address: 'address',
					label: 'Primary Account',
					networkName: 'testnet'
				}
			};

			symbolSnap.initialSnap.mockResolvedValue(mockSnapState);

			// Act:
			await helper.setupSnap(dispatch, symbolSnap, networkName);

			// Assert:
			assertSetupSnap(mockSnapState, networkName);
			expect(symbolSnap.createAccount).not.toHaveBeenCalled();
			expect(dispatch.setSelectedAccount).toHaveBeenCalledWith(Object.values(mockSnapState.accounts)[0]);
			expect(dispatch.setAccounts).toHaveBeenCalledWith(mockSnapState.accounts);
		});

		it('initializes snap and creates account when no accounts are found', async () => {
			// Arrange:
			const networkName = 'testnet';
			mockSnapState.accounts = {};
			const mockAccount = {
				id: '0x1',
				name: 'Wallet 1'
			};

			symbolSnap.initialSnap.mockResolvedValue(mockSnapState);
			symbolSnap.createAccount.mockResolvedValue(mockAccount);

			// Act:
			await helper.setupSnap(dispatch, symbolSnap, networkName);

			// Assert:
			assertSetupSnap(mockSnapState, networkName);
			expect(symbolSnap.createAccount).toHaveBeenCalledWith('Wallet 1');
			expect(dispatch.setSelectedAccount).toHaveBeenCalledWith(mockAccount);
			expect(dispatch.setAccounts).toHaveBeenCalledWith({
				[mockAccount.id]: mockAccount
			});
		});
	});
});
