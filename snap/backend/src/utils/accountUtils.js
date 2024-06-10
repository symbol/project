import stateManager from '../stateManager.js';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { PrivateKey } from 'symbol-sdk';
import { SymbolFacade } from 'symbol-sdk/symbol';
import { v4 as uuidv4 } from 'uuid';

const WalletType = {
	METAMASK: 'metamask'
};

const accountUtils = {
	/**
	 * * Derives a key pair from a mnemonic and an address index.
	 * @param {'mainnet' | 'testnet'} networkName - The network name.
	 * @param {number} addressIndex - The address index.
	 * @returns {Promise<SymbolFacade.KeyPair>} - The derived key pair.
	 */
	async deriveKeyPair(networkName, addressIndex) {
		const facade = new SymbolFacade(networkName);
		const coinType = facade.bip32Path(addressIndex)[1];

		const rootNode = await snap.request({
			method: 'snap_getBip44Entropy',
			params: {
				coinType
			}
		});

		const derivePrivateKey = await getBIP44AddressKeyDeriver(rootNode);
		const key = await derivePrivateKey(addressIndex);

		const privateKey = new PrivateKey(key.privateKeyBytes);
		return new SymbolFacade.KeyPair(privateKey);
	},
	/**
	 * Get latest metamask account index.
	 * @param {Accounts} accounts - The accounts object.
	 * @param {'mainnet' | 'testnet'} networkName - The network name.
	 * @returns {number} - The latest account index.
	 */
	getLatestAccountIndex(accounts, networkName) {
		return Object.values(accounts)
			.filter(walletAccount =>
				WalletType.METAMASK === walletAccount.account.type
				&& networkName === walletAccount.account.networkName)
			.reduce((maxIndex, walletAccount) => Math.max(maxIndex, walletAccount.account.addressIndex), -1);
	},
	/**
	 * Get accounts by network name without private key.
	 * @param {Accounts} accounts - The accounts object.
	 * @param {'mainnet' | 'testnet'} networkName - The network name.
	 * @returns {Record<string, Account>} - The accounts object.
	 */
	getAccounts({ state }) {
		const { network, accounts } = state;

		return Object.keys(accounts).reduce((acc, key) => {
			if (accounts[key].account.networkName === network.networkName)
				acc[key] = accounts[key].account;

			return acc;
		}, {});
	},
	async createAccount({ state, requestParams }) {
		try {
			const { walletLabel } = requestParams;
			const { network, accounts } = state;

			const facade = new SymbolFacade(network.networkName);

			// Get the latest account index and increment it if it exists
			const newAddressIndex = this.getLatestAccountIndex(accounts, network.networkName) + 1 || 0;

			const newKeyPair = await this.deriveKeyPair(network.networkName, newAddressIndex);
			const accountId = uuidv4();

			const wallet = {
				account: {
					id: accountId,
					addressIndex: newAddressIndex,
					type: WalletType.METAMASK,
					label: walletLabel,
					address: facade.network.publicKeyToAddress(newKeyPair.publicKey).toString(),
					publicKey: newKeyPair.publicKey.toString(),
					networkName: network.networkName
				},
				privateKey: newKeyPair.privateKey.toString()
			};

			state.accounts = {
				...state.accounts,
				[accountId]: wallet
			};

			await stateManager.update(state);

			return wallet.account;
		} catch (error) {
			throw new Error(`Failed to create account: ${error.message}`);
		}
	}
};

export default accountUtils;

// region type declarations

/**
 * state of the account.
 * @typedef {object} Account
 * @property {string} id - The account id generated by uuid.
 * @property {number} addressIndex - The address index from bip 44.
 * @property {'metamask' | 'import'} type - The wallet type.
 * @property {'mainnet' | 'testnet'} networkName - network name.
 * @property {string} label - The account label.
 * @property {string} address - The account address.
 * @property {string} publicKey - The account public key.
 */

/**
 * Accounts object.
 * @typedef {Record<string, { account: Account, privateKey: string }>} Accounts
 */

// endregion
