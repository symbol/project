import config from '@/config';
import { truncateDecimals } from '@/utils/common';
import { createAPIURL, createPage, createSearchCriteria, createSearchURL, createTryFetchInfoFunction, makeRequest } from '@/utils/server';

/**
 * @typedef Page
 * @property {Array} data - the page data, an array of objects
 * @property {number} pageNumber The page number
 */

/**
 * Fetches the block page.
 * @param {object} searchParams - search parameters
 * @returns {Promise<Page>} block page
 */
export const fetchBlockPage = async searchParams => {
	const searchCriteria = createSearchCriteria(searchParams);
	const url = createSearchURL(createAPIURL('blocks'), searchCriteria);
	const blocks = await makeRequest(url);

	return createPage(blocks, searchCriteria.pageNumber, blockInfoFromDTO);
};

/**
 * Fetches the chain height.
 * @returns {Promise<number>} the chain height
 */
export const fetchChainHight = async () => {
	const blockPage = await fetchBlockPage({ pageSize: 1 });

	return blockPage.data[0].height;
};

/**
 * Fetches the block info.
 * @param {number} height - requested block height
 * @returns {Promise<Object>} block info
 */
export const fetchBlockInfo = createTryFetchInfoFunction(async height => {
	const block = await makeRequest(createAPIURL(`block/${height}`));

	return blockInfoFromDTO(block);
});

/**
 * Maps the block info from the DTO.
 * @param {object} data - raw data from response
 * @returns {object} mapped block info
 */
const blockInfoFromDTO = data => ({
	...data,
	harvester: data.signer,
	totalFee: data.totalFees,
	transactionCount: data.totalTransactions,
	difficulty: ((data.difficulty / Math.pow(10, 14)) * 100).toFixed(2)
});
