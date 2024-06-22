import symbolSnapFactory from './snap';

describe('symbolSnapFactory', () => {
	let mockProvider;
	let symbolSnap;

	const mockSnaps = { snap1: {
		blocked: false,
		enabled: true,
		id: 'local:http://localhost:8080',
		version: '0.1.0',
		initialPermissions: []
	}, snap2: {
		blocked: false,
		enabled: true,
		id: 'local:http://localhost:8080',
		version: '0.2.0',
		initialPermissions: []
	} };

	beforeAll(() => {
		// Mock window.ethereum for testing
		mockProvider = {
			request: jest.fn()
		};

		symbolSnap = symbolSnapFactory.create(mockProvider);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('create', () => {
		it('returns an object with provider and methods', () => {

			// Assert:
			expect(symbolSnap.provider).toBe(mockProvider);
			expect(symbolSnap.getSnaps).toBeInstanceOf(Function);
			expect(symbolSnap.getSnap).toBeInstanceOf(Function);
			expect(symbolSnap.connectSnap).toBeInstanceOf(Function);
		});
	});

	describe('getSnaps', () => {
		it('returns snaps when provider request is successful', async () => {
			// Arrange:
			mockProvider.request.mockResolvedValue(mockSnaps);

			// Act:
			const result = await symbolSnap.getSnaps();

			// Assert:
			expect(result).toEqual(mockSnaps);
			expect(mockProvider.request).toHaveBeenCalledWith({ method: 'wallet_getSnaps' });
		});

		it('returns empty object when provider request fails', async () => {
			// Arrange:
			mockProvider.request.mockRejectedValue();

			// Act:
			const result = await symbolSnap.getSnaps();

			// Assert:
			expect(result).toEqual({});
			expect(mockProvider.request).toHaveBeenCalledWith({ method: 'wallet_getSnaps' });
		});
	});

	describe('getSnap', () => {
		const assertSnap = async (version, expectedSnap) => {
			// Arrange:
			mockProvider.request.mockResolvedValue(mockSnaps);

			// Act:
			const result = await symbolSnap.getSnap(version);

			// Assert:
			expect(result).toEqual(expectedSnap);
		};

		it('returns the matching snap when version is provided', async () => {
			await assertSnap('0.2.0', mockSnaps.snap2);
		});

		it('returns first snap when no version is provided', async () => {
			await assertSnap('', mockSnaps.snap1);
		});

		it('returns undefined when no matching snap found', async () => {
			await assertSnap('0.3.0', undefined);
		});
	});

	describe('connectSnap', () => {
		it('returns true when connect snap request success', async () => {
			const snapId = mockSnaps.snap1.id;
			const params = { param1: 'value1', param2: 'value2' };
			const expectedParams = { [snapId]: params };

			mockProvider.request.mockResolvedValue(mockSnaps.snap1);

			const result = await symbolSnap.connectSnap(snapId, params);

			expect(result).toBe(true);
			expect(mockProvider.request).toHaveBeenCalledWith({
				method: 'wallet_requestSnaps',
				params: expectedParams
			});
		});

		it('returns false when connect snap request fails', async () => {
			// Arrange:
			mockProvider.request.mockRejectedValueOnce();

			// Act:
			const result = await symbolSnap.connectSnap();

			expect(result).toBe(false);
		});
	});

	describe('getNetwork', () => {
		it('returns network data when provider request is successful', async () => {
			// Arrange:
			const mockNetworkData = {
				identifier: 104,
				networkName: 'mainnet',
				url: 'http://localhost:3000'
			};

			mockProvider.request.mockResolvedValue(mockNetworkData);

			// Act:
			const result = await symbolSnap.getNetwork();

			// Assert:
			expect(result).toEqual(mockNetworkData);
			expect(mockProvider.request).toHaveBeenCalledWith({
				method: 'wallet_invokeSnap',
				params: {
					snapId: 'local:http://localhost:8080',
					request: {
						method: 'getNetwork'
					}
				}
			});
		});
	});

	describe('switchNetwork', () => {
		it('returns network data when provider request is successful', async () => {
			// Arrange:
			const networkName = 'testnet';
			const mockNetworkData = {
				identifier: 152,
				networkName: 'testnet',
				url: 'http://localhost:3000'
			};

			mockProvider.request.mockResolvedValue(mockNetworkData);

			// Act:
			const result = await symbolSnap.switchNetwork(networkName);

			// Assert:
			expect(result).toEqual(mockNetworkData);
			expect(mockProvider.request).toHaveBeenCalledWith({
				method: 'wallet_invokeSnap',
				params: {
					snapId: 'local:http://localhost:8080',
					request: {
						method: 'switchNetwork',
						params: {
							networkName
						}
					}
				}
			});
		});
	});

	describe('initialSnap', () => {
		it('returns initial snap state when provider request is successful', async () => {
			// Arrange:
			const networkName = 'mainnet';
			const mockInitialSnapState = {
				network: {
					identifier: 104,
					networkName: 'mainnet',
					url: 'http://localhost:3000'
				}
			};

			mockProvider.request.mockResolvedValue(mockInitialSnapState);

			// Act:
			const result = await symbolSnap.initialSnap(networkName);

			// Assert:
			expect(result).toEqual(mockInitialSnapState);
			expect(mockProvider.request).toHaveBeenCalledWith({
				method: 'wallet_invokeSnap',
				params: {
					snapId: 'local:http://localhost:8080',
					request: {
						method: 'initialSnap',
						params: {
							networkName
						}
					}
				}
			});
		});
	});

	describe('createAccount', () => {
		it('returns account data when provider request is successful', async () => {
			// Arrange:
			const accountLabel = 'Test Wallet';
			const mockAccountData = {
				id: '1234',
				addressIndex: 0,
				address: 'TBZ6JU7K5Y3W4H3XJ7XJ5JQW6X3J5JQW6X3J5JQW',
				label: accountLabel,
				networkName: 'testnet',
				publicKey: '1234',
				type: 'metamask'
			};

			mockProvider.request.mockResolvedValue(mockAccountData);

			// Act:
			const result = await symbolSnap.createAccount(accountLabel);

			// Assert:
			expect(result).toEqual(mockAccountData);
			expect(mockProvider.request).toHaveBeenCalledWith({
				method: 'wallet_invokeSnap',
				params: {
					snapId: 'local:http://localhost:8080',
					request: {
						method: 'createAccount',
						params: {
							accountLabel
						}
					}
				}
			});
		});
	});
});
