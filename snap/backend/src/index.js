import stateManager from './stateManager.js';
import accountUtils from './utils/accountUtils.js';
import mosaicUtils from './utils/mosaicUtils.js';
import networkUtils from './utils/networkUtils.js';
import priceUtils from './utils/priceUtils.js';

// eslint-disable-next-line import/prefer-default-export
export const onRpcRequest = async ({ request }) => {
	const requestParams = request?.params || {};

	let state = await stateManager.getState();

	if (!state) {
		state = {
			currencies: {},
			accounts: {},
			network: {},
			mosaicInfo: {}
		};
	}

	const apiParams = {
		state,
		requestParams
	};

	// handle request
	switch (request.method) {
	case 'initialSnap':
		await networkUtils.switchNetwork(apiParams);
		await priceUtils.getPrice(apiParams);

		return {
			...state,
			accounts: accountUtils.getAccounts(apiParams),
			currency: await priceUtils.getCurrencyPrice(apiParams),
			mosaicInfo: mosaicUtils.getMosaicInfo(apiParams)
		};
	case 'createAccount':
		return accountUtils.createAccount(apiParams);
	case 'importAccount':
		return accountUtils.importAccount(apiParams);
	case 'getNetwork':
		return state.network;
	case 'getAccounts':
		return accountUtils.getAccounts(apiParams);
	case 'switchNetwork':
		return networkUtils.switchNetwork(apiParams);
	case 'getCurrency':
		return priceUtils.getCurrencyPrice(apiParams);
	case 'getMosaicInfo':
		return mosaicUtils.getMosaicInfo(apiParams);
	case 'fetchAccountMosaics':
		return accountUtils.fetchAccountMosaics(apiParams);
	default:
		throw new Error('Method not found.');
	}
};

export const onCronjob = async ({ request }) => {
	const state = await stateManager.getState();

	switch (request.method) {
	case 'fetchCurrencyPrice':
		return priceUtils.getPrice({ state });
	default:
		throw new Error('Method not found.');
	}
};
