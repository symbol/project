import Home from '.';
import helper from '../../utils/helper';
import testHelper from '../testHelper';
import { act, fireEvent, screen } from '@testing-library/react';

const context = {
	dispatch: {
		setLoadingStatus: jest.fn(),
		setNetwork: jest.fn(),
		setSelectedAccount: jest.fn(),
		setAccounts: jest.fn(),
		setCurrency: jest.fn()
	},
	walletState: {
		loadingStatus: {
			isLoading: false,
			message: ''
		},
		selectedAccount: {},
		accounts: {},
		mosaics: [],
		transactions: [],
		currency: {
			symbol: 'usd',
			price: 0.25
		},
		network: {
			identifier: 104,
			networkName: 'mainnet',
			url: 'http://localhost:3000',
			networkGenerationHash: 'networkGenerationHash'
		}
	},
	symbolSnap: {
		getSnap: jest.fn(),
		initialSnap: jest.fn(),
		createAccount: jest.fn()
	}
};

describe('components/Home', () => {
	const assertModalScreen = async (walletState, expectedModal) => {
		// Arrange:
		context.walletState = {
			...context.walletState,
			...walletState
		};

		// Act:
		testHelper.customRender(<Home />, context);

		const textElement = await screen.findByText(expectedModal);

		// Assert:
		expect(textElement).toBeInTheDocument();
	};

	it('renders ConnectMetamask modal when metamask is installed but snap is not installed', async () => {
		await assertModalScreen({ isSnapInstalled: false }, 'Connect MetaMask');
	});

	it('calls setup snap with mainnet when isSnapInstalled is true', async () => {
		// Arrange:
		const mockNetwork = {
			identifier: 104,
			networkName: 'mainnet',
			url: 'http://localhost:3000'
		};

		context.walletState.isSnapInstalled = true;

		jest.spyOn(helper, 'setupSnap');

		context.symbolSnap.initialSnap.mockResolvedValue({
			network: mockNetwork,
			accounts: {},
			currencies: {
				usd: 1,
				jpy: 2
			},
			currency: {
				symbol: 'usd',
				price: 1
			}
		});

		context.symbolSnap.createAccount.mockResolvedValue({
			...Object.values(testHelper.generateAccountsState(1))[0]
		});

		// Act:
		await act(() => testHelper.customRender(<Home />, context));

		// Assert:
		expect(helper.setupSnap).toHaveBeenCalledWith(context.dispatch, context.symbolSnap, 'mainnet', 'usd');
	});

	it('renders receive modal box when receive button is clicked', async () => {
		// Arrange:
		testHelper.customRender(<Home />, context);

		const receiveButton = screen.getByText('Receive');

		// Act:
		fireEvent.click(receiveButton);

		// Assert:
		const modalBox = screen.getByRole('receive-qr');
		expect(modalBox).toBeInTheDocument();
	});
});
