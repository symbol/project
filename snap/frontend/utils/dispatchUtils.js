import { actionTypes } from '../context/index';

const dispatchUtils = dispatch => ({
	/**
	 * Set snap installed status
	 * @param {boolean} isInstalled - The snap installed status.
	 */
	setIsSnapInstalled: isInstalled => {
		dispatch({ type: actionTypes.SET_SNAP_INSTALLED, payload: isInstalled });
	},
	/**
	 * Set loading status
	 * @param {{isLoading: boolean, message: string}} status - The loading status.
	 */
	setLoadingStatus: status => {
		dispatch({ type: actionTypes.SET_LOADING_STATUS, payload: status });
	},
	/**
	 * Set network
	 * @param {NodeInfo} network - The network information.
	 */
	setNetwork: network => {
		dispatch({ type: actionTypes.SET_NETWORK, payload: network });
	},
	/**
	 * Set selected account
	 * @param {Account} account - The account object.
	 */
	setSelectedAccount: account => {
		dispatch({ type: actionTypes.SET_SELECTED_ACCOUNT, payload: account });
	},
	/**
	 * Set accounts
	 * @param {Accounts} accounts - The accounts object.
	 */
	setAccounts: accounts => {
		dispatch({ type: actionTypes.SET_ACCOUNTS, payload: accounts });
	},
	/**
	 * Set currency
	 * @param {{symbol: string, price: number}} currency - The currency object.
	 */
	setCurrency: currency => {
		dispatch({ type: actionTypes.SET_CURRENCY, payload: currency });
	}
});

export default dispatchUtils;

// region type declarations

/**
 * Result of a node request.
 * @typedef {object} NodeInfo
 * @property {number} identifier - The network identifier.
 * @property {string} networkName - The network name.
 * @property {string} url - The node URL.
 * @property {string} currencyMosaicId - The native currency mosaic id.
 */

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
