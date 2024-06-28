const config = {
	NATIVE_MOSAIC_ID: process.env.NEXT_PUBLIC_NATIVE_MOSAIC_ID,
	NATIVE_MOSAIC_TICKER: process.env.NEXT_PUBLIC_NATIVE_MOSAIC_TICKER,
	NATIVE_MOSAIC_DIVISIBILITY: +process.env.NEXT_PUBLIC_NATIVE_MOSAIC_DIVISIBILITY,
	BLOCKCHAIN_UNWIND_LIMIT: +process.env.NEXT_PUBLIC_BLOCKCHAIN_UNWIND_LIMIT,
	REQUEST_TIMEOUT: +process.env.NEXT_PUBLIC_REQUEST_TIMEOUT,
	API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
	SUPERNODE_URL: process.env.NEXT_PUBLIC_SUPERNODE_URL,
	NODEWATCH_URL: process.env.NEXT_PUBLIC_NODEWATCH_URL,
	MARKET_DATA_URL: process.env.NEXT_PUBLIC_MARKET_DATA_URL,
	HISTORICAL_PRICE_URL: process.env.NEXT_PUBLIC_HISTORICAL_PRICE_URL
};

export default config;
