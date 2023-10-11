export const getSearchCriteria = req => {
	const { searchParams } = new URL(req.url);
	const pageNumber = searchParams.get('pageNumber');
	const pageSize = searchParams.get('pageSize');

	return {
		pageNumber: pageNumber || 1,
		pageSize: pageSize || 50
	};
};

export const createSearchCriteria = (searchCriteria = {}) => {
	const { pageNumber, pageSize, ...filter } = searchCriteria;
	const parsedPageNumber = parseInt(pageNumber);
	const parsedPageSize = parseInt(pageSize);

	return {
		pageNumber: isNaN(parsedPageNumber) ? 1 : parsedPageNumber,
		pageSize: isNaN(parsedPageSize) ? 50 : parsedPageSize,
		filter
	};
};

export const createPage = (data, pageNumber, formatter) => {
	let formattedData;

	if (!data.length) {
		formattedData = [];
	} else if (formatter) {
		formattedData = data.map(formatter);
	} else {
		formattedData = data;
	}

	return {
		data: formattedData,
		pageNumber
	};
};

export const createAPISearchURL = (baseURL, searchCriteria, filter = {}) => {
	const limit = searchCriteria.pageSize;
	const offset = searchCriteria.pageSize * (searchCriteria.pageNumber - 1);
	const params = new URLSearchParams({
		limit,
		offset,
		...filter
	}).toString();

	return `${baseURL}?${params}`;
};

export const createAPICallFunction =
	func =>
	async (...args) => {
		try {
			const data = await func(...args);

			if (data.status) {
				return null;
			}

			return data;
		} catch {
			return null;
		}
	};
