import Navbar from '.';
import helper from '../../utils/helper';
import testHelper from '../testHelper';
import { act, fireEvent, screen } from '@testing-library/react';

const context = {
	dispatch: {
		setNetwork: jest.fn()
	},
	walletState: {},
	symbolSnap: {
		switchNetwork: jest.fn(),
		initialSnap: jest.fn()
	}
};

describe('components/Navbar', () => {
	it('renders symbol logo', () => {
		// Arrange:
		testHelper.customRender(<Navbar />, context);

		// Act:
		const image = screen.getByAltText('Symbol logo');

		// Assert:
		expect(image).toHaveAttribute('src', '/symbol-logo.svg');
	});

	describe('dropdowns', () => {
		const assertDropdown = dropdownName => {
			// Arrange:
			testHelper.customRender(<Navbar />, context);

			// Act:
			const dropdown = screen.getByText(dropdownName);

			// Assert:
			expect(dropdown).toBeInTheDocument();
		};

		const assertOptions = (dropdownName, options) => {
			// Arrange:
			testHelper.customRender(<Navbar />, context);
			const dropdown = screen.getByText(dropdownName);

			// Act:
			fireEvent.click(dropdown);

			// Assert:
			options.forEach(option => {
				const element = screen.getByText(option);
				expect(element).toBeInTheDocument();
			});
		};

		const assertSelectedOption = (dropdownName, option) => {
			// Arrange:
			testHelper.customRender(<Navbar />, context);
			const dropdown = screen.getByText(dropdownName);
			fireEvent.click(dropdown);
			const item = screen.getByText(option);

			// Act:
			fireEvent.click(item);

			// Assert:
			const selectedOption = screen.getByText(option);
			expect(selectedOption).toBeInTheDocument();
		};

		describe('network', () => {
			const assertInitialNetwork = (networkName, expectLabel) => {
				// Arrange:
				context.walletState.network = { networkName };

				// Act:
				testHelper.customRender(<Navbar />, context);

				// Assert:
				const label = screen.getByText(expectLabel);
				expect(label).toBeInTheDocument();
			};

			it('renders dropdown', () => {
				assertDropdown('Network');
			});

			it('renders options items', () => {
				assertOptions('Network', ['Mainnet', 'Testnet']);
			});

			it('renders nothing when selected same network', async () => {
				// Arrange:
				jest.spyOn(helper, 'setupSnap').mockReturnValue();

				testHelper.customRender(<Navbar />, context);

				const dropdown = screen.getByText('Network');
				fireEvent.click(dropdown);

				const item = screen.getByText('Testnet');

				await act(async () => fireEvent.click(item));

				// Act:
				// Click on the same network
				await act(async () => fireEvent.click(item));

				// Assert:
				const selectedOption = screen.getByText('Testnet');
				expect(selectedOption).toBeInTheDocument();
				expect(helper.setupSnap).not.toHaveBeenNthCalledWith(2);
			});

			it('sets selected network when clicked on item', async () => {
				// Arrange:
				jest.spyOn(helper, 'setupSnap').mockReturnValue();

				testHelper.customRender(<Navbar />, context);
				const dropdown = screen.getByText('Network');
				fireEvent.click(dropdown);
				const item = screen.getByText('Testnet');

				// Act:
				await act(async () => fireEvent.click(item));

				// Assert:
				const selectedOption = screen.getByText('Testnet');

				expect(selectedOption).toBeInTheDocument();
				expect(helper.setupSnap).toHaveBeenCalledWith(context.dispatch, context.symbolSnap, 'testnet');
			});

			it('renders network name when network is set when initial', () => {
				assertInitialNetwork('mainnet', 'Mainnet');
				assertInitialNetwork('testnet', 'Testnet');
			});

			it('does not render network name when network is not set when initial', () => {
				assertInitialNetwork(undefined, 'Network');
			});
		});

		describe('currency', () => {
			it('renders dropdown', () => {
				assertDropdown('Currency');
			});

			it('renders options items', () => {
				assertOptions('Currency', ['USD', 'JPY']);
			});

			it('sets selected currency when clicked on item', () => {
				assertSelectedOption('Currency', 'USD');
				assertSelectedOption('Currency', 'JPY');
			});
		});
	});

	describe('connection status', () => {
		const assertConnectionStatus = (context, expectedResult) => {
			// Arrange:
			testHelper.customRender(<Navbar />, context);

			// Act:
			const connectionStatus = screen.getByRole('connection-status');

			// Assert:
			expect(connectionStatus).toHaveClass(expectedResult);
		};

		it('renders green when isSnapInstalled is true', () => {
			// Arrange:
			context.walletState.isSnapInstalled = true;

			assertConnectionStatus(context, 'bg-green');
		});

		it('renders red when isSnapInstalled is false', () => {
			// Arrange:
			context.walletState.isSnapInstalled = false;

			assertConnectionStatus(context, 'bg-red-500');
		});
	});
});