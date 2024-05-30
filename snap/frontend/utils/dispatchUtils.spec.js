import dispatchUtils from './dispatchUtils';

describe('dispatchUtils', () => {
	let dispatchState = jest.fn();
	let dispatch;

	beforeEach(() => {
		jest.clearAllMocks();
		dispatch = dispatchUtils(dispatchState);
	});
	describe('setIsSnapInstalled', () => {
		const assertIsSnapInstalled = isInstalled => {
			// Act:
			dispatch.setIsSnapInstalled(isInstalled);

			// Assert:
			expect(dispatchState).toHaveBeenCalledWith({ type: 'setSnapInstalled', payload: isInstalled });
		};

		it('dispatches SET_SNAP_INSTALLED action with true', () => {
			assertIsSnapInstalled(true);
		});

		it('dispatches SET_SNAP_INSTALLED action with false', () => {
			assertIsSnapInstalled(false);
		});
	});

	describe('setLoadingStatus', () => {
		const assertLoadingStatus = status => {
			// Act:
			dispatch.setLoadingStatus(status);

			// Assert:
			expect(dispatchState).toHaveBeenCalledWith({ type: 'setLoadingStatus', payload: status });
		};

		it('dispatches SET_LOADING_STATUS action with isLoading true', () => {
			assertLoadingStatus({ isLoading: true, message: 'loading' });
		});

		it('dispatches SET_LOADING_STATUS action with isLoading false', () => {
			assertLoadingStatus({ isLoading: false, message: '' });
		});
	});

	describe('setNetwork', () => {
		it('dispatches SET_NETWORK action with network', () => {
			// Arrange:
			const network = {
				identifier: 1,
				networkName: 'network',
				url: 'url'
			};

			// Act:
			dispatch.setNetwork(network);

			// Assert:
			expect(dispatchState).toHaveBeenCalledWith({ type: 'setNetwork', payload: network });
		});
	});
});
