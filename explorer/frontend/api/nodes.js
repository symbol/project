import config from '@/config';
import { createPage, createSearchCriteria, createSearchURL, makeRequest } from '@/utils/server';

/**
 * @typedef Page
 * @property {Array} data - the page data, an array of objects
 * @property {number} pageNumber The page number
 */

/**
 * Fetches the node list.
 * @returns {Promise<Array>} node list
 */
export const fetchNodeLists = async () => {
	const url = `${config.NODEWATCH_URL}/nodes`;
	const nodes = await makeRequest(url);

	return nodes.map(nodeInfoFromDTO);
};

/**
 * Fetches the supernodenode page.
 * @param {object} searchParams - search parameters
 * @returns {Promise<Page>} suernodenode page
 */
export const fetchSupernodePage = async searchParams => {
	const searchCriteria = createSearchCriteria(searchParams);
	const url = createSearchURL(`${config.SUPERNODE_URL}/nodes`, searchCriteria);
	const nodes = await makeRequest(url);

	return createPage(nodes, searchCriteria.pageNumber, supernodeInfoFromDTO);
};

/**
 * Maps the node info from the DTO.
 * @param {object} data - raw data from response
 * @returns {object} mapped node info
 */
const nodeInfoFromDTO = data => ({
	endpoint: data.endpoint,
	name: data.name,
	version: data.version
});

/**
 * Maps the supernode info from the DTO.
 * @param {object} data - raw data from response
 * @returns {object} mapped node info
 */
const supernodeInfoFromDTO = data => ({
	endpoint: data.endpoint,
	name: data.name,
	status: data.status
});
