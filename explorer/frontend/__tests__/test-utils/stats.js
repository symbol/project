/* eslint-disable max-len */
export const accountStatisticsResponse = {
	eligibleHarvestAccounts: 9093,
	harvestedAccounts: 23675,
	total: 984546,
	totalImportance: '1.013774403838297289982',
	withBalance: 223051
};

export const transactionStatisticsResponse = {
	last24Hours: 630,
	last30Day: 17457,
	total: 10667593
};

export const nodeListResponse = [
	{
		balance: 0,
		endpoint: 'http://89.250.243.24:7890',
		finalizedHeight: 0,
		height: 0,
		mainPublicKey: 'D13199221E62A97C65EEE5E3A8799FE353D11918A003ABE3F32F79D68B94608F',
		name: 'Ar24',
		nodePublicKey: 'A0D322205AC7374AAEBD8C913AFFB4A2A316C55FC5E1CF137468F2D524398C33',
		roles: 255,
		version: '0.6.101'
	},
	{
		balance: 0,
		endpoint: 'http://89.250.243.29:7890',
		finalizedHeight: 0,
		height: 0,
		mainPublicKey: 'A7DA03C7ADC8AC430DA2332AD3D68C24D911C0A3E68D5A61CBF99D710DBCFEE8',
		name: 'Ar26',
		nodePublicKey: '3F04D922B36FCE9101D14D71547C3F1DA76D9271AF57902BB11E1EC53C7A0A52',
		roles: 255,
		version: '0.6.101'
	},
	{
		balance: 0,
		endpoint: 'http://89.250.243.30:7890',
		finalizedHeight: 0,
		height: 0,
		mainPublicKey: 'CF2105FBDE6724B3826CE70FDD15671F6FA74B6EC040AE051A1B73B68D507D07',
		name: 'Ar30',
		nodePublicKey: 'C03C3C381D2ADFE865FF2168D3BDCEE1756F14B0B57611606910514EA0801976',
		roles: 255,
		version: '0.6.101'
	}
];

export const supernodeStatisticsResponse = {
	participantCount: 2,
	roundId: 1956,
	totalPaid: 1896000000
};

export const marketDataResponse = {
	RAW: {
		XEM: {
			USD: {
				TYPE: '5',
				MARKET: 'CCCAGG',
				FROMSYMBOL: 'XEM',
				TOSYMBOL: 'USD',
				FLAGS: '1',
				PRICE: 0.02100488674247058,
				LASTUPDATE: 1718053840,
				MEDIAN: 0.02100488674247058,
				LASTVOLUME: 257.79,
				LASTVOLUMETO: 5.414849753341491,
				LASTTRADEID: '11637047',
				VOLUMEDAY: 46087579.4441077,
				VOLUMEDAYTO: 968064.3864580973,
				VOLUME24HOUR: 49221365.7216442,
				VOLUME24HOURTO: 1033889.21229286,
				OPENDAY: 0.02120699845309027,
				HIGHDAY: 0.02130222722988027,
				LOWDAY: 0.02035519270302762,
				OPEN24HOUR: 0.02127437373322538,
				HIGH24HOUR: 0.02134648910347274,
				LOW24HOUR: 0.02035519270302762,
				LASTMARKET: 'CCCAGG',
				VOLUMEHOUR: 266972.921751,
				VOLUMEHOURTO: 5607.735984686215,
				OPENHOUR: 0.02099282330586265,
				HIGHHOUR: 0.02101662286492346,
				LOWHOUR: 0.02095652283967054,
				TOPTIERVOLUME24HOUR: 49221365.7216442,
				TOPTIERVOLUME24HOURTO: 1033889.21229286,
				CHANGE24HOUR: -0.00026948699075480045,
				CHANGEPCT24HOUR: -1.2667211459857337,
				CHANGEDAY: -0.0002021117106196929,
				CHANGEPCTDAY: -0.9530425112576048,
				CHANGEHOUR: 0.000012063436607930023,
				CHANGEPCTHOUR: 0.0574645745937426,
				CONVERSIONTYPE: 'multiply',
				CONVERSIONSYMBOL: 'USDT',
				CONVERSIONLASTUPDATE: 1718053837,
				SUPPLY: 8999999999,
				MKTCAP: 189043980.66123033,
				MKTCAPPENALTY: 0,
				CIRCULATINGSUPPLY: 8999999999,
				CIRCULATINGSUPPLYMKTCAP: 189043980.66123033,
				TOTALVOLUME24H: 258536623.059179,
				TOTALVOLUME24HTO: 5430532.486138863,
				TOTALTOPTIERVOLUME24H: 226720055.36941785,
				TOTALTOPTIERVOLUME24HTO: 4762229.085281281,
				IMAGEURL: '/media/37747011/xem.png'
			}
		}
	},
	DISPLAY: {
		XEM: {
			USD: {
				FROMSYMBOL: 'XEM',
				TOSYMBOL: '$',
				MARKET: 'CryptoCompare Index',
				PRICE: '$ 0.02100',
				LASTUPDATE: 'Just now',
				LASTVOLUME: 'XEM 257.79',
				LASTVOLUMETO: '$ 5.41',
				LASTTRADEID: '11637047',
				VOLUMEDAY: 'XEM 46,087,579.4',
				VOLUMEDAYTO: '$ 968,064.4',
				VOLUME24HOUR: 'XEM 49,221,365.7',
				VOLUME24HOURTO: '$ 1,033,889.2',
				OPENDAY: '$ 0.02121',
				HIGHDAY: '$ 0.02130',
				LOWDAY: '$ 0.02036',
				OPEN24HOUR: '$ 0.02127',
				HIGH24HOUR: '$ 0.02135',
				LOW24HOUR: '$ 0.02036',
				LASTMARKET: 'CCCAGG',
				VOLUMEHOUR: 'XEM 266,972.9',
				VOLUMEHOURTO: '$ 5,607.74',
				OPENHOUR: '$ 0.02099',
				HIGHHOUR: '$ 0.02102',
				LOWHOUR: '$ 0.02096',
				TOPTIERVOLUME24HOUR: 'XEM 49,221,365.7',
				TOPTIERVOLUME24HOURTO: '$ 1,033,889.2',
				CHANGE24HOUR: '$ -0.00027',
				CHANGEPCT24HOUR: '-1.27',
				CHANGEDAY: '$ -0.00020',
				CHANGEPCTDAY: '-0.95',
				CHANGEHOUR: '$ 0.000012',
				CHANGEPCTHOUR: '0.06',
				CONVERSIONTYPE: 'multiply',
				CONVERSIONSYMBOL: 'USDT',
				CONVERSIONLASTUPDATE: 'Just now',
				SUPPLY: 'XEM 8,999,999,999.0',
				MKTCAP: '$ 189.04 M',
				MKTCAPPENALTY: '0 %',
				CIRCULATINGSUPPLY: 'XEM 8,999,999,999.0',
				CIRCULATINGSUPPLYMKTCAP: '$ 189.04 M',
				TOTALVOLUME24H: 'XEM 258.54 M',
				TOTALVOLUME24HTO: '$ 5.43 M',
				TOTALTOPTIERVOLUME24H: 'XEM 226.72 M',
				TOTALTOPTIERVOLUME24HTO: '$ 4.76 M',
				IMAGEURL: '/media/37747011/xem.png'
			}
		}
	}
};

export const priceByDateResponse = {
	id: 'nem',
	symbol: 'xem',
	name: 'NEM',
	localization: {
		en: 'NEM',
		de: 'NEM',
		es: 'NEM',
		fr: 'NEM',
		it: 'NEM',
		pl: 'NEM',
		ro: 'NEM',
		hu: 'NEM',
		nl: 'NEM',
		pt: 'NEM',
		sv: 'NEM',
		vi: 'NEM',
		tr: 'NEM',
		ru: 'NEM',
		ja: 'ネム',
		zh: '新经币',
		'zh-tw': '新經幣',
		ko: '넴',
		ar: 'نيم',
		th: 'NEM',
		id: 'NEM',
		cs: 'NEM',
		da: 'NEM',
		el: 'NEM',
		hi: 'NEM',
		no: 'NEM',
		sk: 'NEM',
		uk: 'NEM',
		he: 'NEM',
		fi: 'NEM',
		bg: 'NEM',
		hr: 'NEM',
		lt: 'NEM',
		sl: 'NEM'
	},
	image: {
		thumb: 'https://coin-images.coingecko.com/coins/images/242/thumb/NEM_WC_Logo_200px.png?1696501595',
		small: 'https://coin-images.coingecko.com/coins/images/242/small/NEM_WC_Logo_200px.png?1696501595'
	},
	market_data: {
		current_price: {
			aed: 0.07782089380825578,
			ars: 19.228030879711252,
			aud: 0.03218509514920509,
			bch: 0.0000446637589496972,
			bdt: 2.5048805857800702,
			bhd: 0.008027814280755682,
			bmd: 0.021187381974884067,
			bnb: 0.000031458783365108725,
			brl: 0.11286821357582989,
			btc: 3.041799068863305e-7,
			cad: 0.029151612922333137,
			chf: 0.018990504712672284,
			clp: 19.373725848299408,
			cny: 0.150578723695501,
			czk: 0.48445476451383557,
			dkk: 0.14663022200327983,
			dot: 0.0032498098312582495,
			eos: 0.029853520832747244,
			eth: 0.0000057170397222002025,
			eur: 0.019656953812692262,
			gbp: 0.016645146277580517,
			gel: 0.05985435407904753,
			hkd: 0.16551762891526214,
			huf: 7.677641138783449,
			idr: 344.8709256678485,
			ils: 0.07977481536136154,
			inr: 1.769736442303438,
			jpy: 3.3232073479241255,
			krw: 29.23958208479755,
			kwd: 0.0065095900505814045,
			lkr: 6.455809419730946,
			ltc: 0.0002630482617917987,
			mmk: 44.44985614038824,
			mxn: 0.38760355490217857,
			myr: 0.09939000884418107,
			ngn: 31.735308217260453,
			nok: 0.2272268959114468,
			nzd: 0.03469616009872252,
			php: 1.243805237648188,
			pkr: 5.924740889380861,
			pln: 0.08471177198485716,
			rub: 1.9018222257645652,
			sar: 0.07946361509491441,
			sek: 0.22381301542859772,
			sgd: 0.028657120614421296,
			thb: 0.7823334857316079,
			try: 0.6870045683274613,
			twd: 0.6868949024383608,
			uah: 0.857586129846396,
			usd: 0.021187381974884067,
			vef: 0.0021214925571451416,
			vnd: 538.3657744405697,
			xag: 0.0007224517999298121,
			xau: 0.000009216723032894308,
			xdr: 0.01611552529035434,
			xlm: 0.21213469406084048,
			xrp: 0.04249807497520072,
			yfi: 0.000003245759582122662,
			zar: 0.40043516311071714,
			bits: 0.3041799068863305,
			link: 0.0012942616991998388,
			sats: 30.41799068863305
		},
		market_cap: {
			aed: 699060161.2174349,
			ars: 172804247412.96326,
			aud: 289272738.0912475,
			bch: 401351.039334605,
			bdt: 22501183685.19789,
			bhd: 72113347.33774748,
			bmd: 190324910.62916332,
			bnb: 282672.8333813049,
			brl: 1013888015.3837714,
			btc: 2733.1814313402706,
			cad: 261890693.19903043,
			chf: 170608201.51253513,
			clp: 174032952490.4253,
			cny: 1352639139.8414621,
			czk: 4352319604.281992,
			dkk: 1317387159.8947284,
			dot: 29208510.1154818,
			eos: 268247005.17183727,
			eth: 51369.97317519988,
			eur: 176604578.14681733,
			gbp: 149551034.0503456,
			gel: 537667872.5273851,
			hkd: 1487018042.991184,
			huf: 68986992703.18929,
			idr: 3097953686969.82,
			ils: 716612114.8005673,
			inr: 15897430395.97123,
			jpy: 29854079993.924488,
			krw: 262657314326.04837,
			kwd: 58475235.216793425,
			lkr: 57992127215.42135,
			ltc: 2366014.88897068,
			mmk: 399290243005.3454,
			mxn: 3482687022.6352262,
			myr: 892814155.7614037,
			ngn: 285076264136.78656,
			nok: 2041440978.7008965,
			nzd: 311788175.0186778,
			php: 11173023688.160128,
			pkr: 53221572236.205025,
			pln: 761050126.5588175,
			rub: 17087121340.978266,
			sar: 713816622.5132476,
			sek: 2010033752.273782,
			sgd: 257449842.05932015,
			thb: 7024892451.322413,
			try: 6172639008.239912,
			twd: 6170333412.272556,
			uah: 7703641899.377143,
			usd: 190324910.62916332,
			vef: 19057233.301298097,
			vnd: 4836105660796.838,
			xag: 6489274.378082507,
			xau: 82762.78738709161,
			xdr: 144764743.19784346,
			xlm: 1907238088.9247656,
			xrp: 381737495.9832734,
			yfi: 29178.346041207464,
			zar: 3597136814.068051,
			bits: 2733181431.3402705,
			link: 11655593.90810792,
			sats: 273318143134.02707
		},
		total_volume: {
			aed: 12709906.554047262,
			ars: 3140370969.030671,
			aud: 5256551.701750302,
			bch: 7294.598851586576,
			bdt: 409103476.1532691,
			bhd: 1311123.0718199036,
			bmd: 3460377.179542414,
			bnb: 5137.92861155921,
			brl: 18433924.069359124,
			btc: 49.67943701173367,
			cad: 4761115.659446512,
			chf: 3101577.590550019,
			clp: 3164166242.3246646,
			cny: 24592900.615007922,
			czk: 79122385.84415492,
			dkk: 23948021.263451252,
			dot: 530767.2175481304,
			eos: 4875753.046841355,
			eth: 933.7214863398586,
			eur: 3210423.7547325254,
			gbp: 2718527.678283392,
			gel: 9775565.532207325,
			hkd: 27032760.65864559,
			huf: 1253931902.5283985,
			idr: 56325197822.14484,
			ils: 13029025.997921837,
			inr: 289037862.5358646,
			jpy: 542754686.8827919,
			krw: 4775483007.080882,
			kwd: 1063162.8242654314,
			lkr: 1054379234.6781511,
			ltc: 42961.71198979006,
			mmk: 7259663700.049205,
			mxn: 63304399.65083759,
			myr: 16232629.349233447,
			ngn: 5183091354.605825,
			nok: 37111275.292167485,
			nzd: 5666665.223938146,
			php: 203141438.86466035,
			pkr: 967643769.8918457,
			pln: 13835342.32603573,
			rub: 310610449.0580069,
			sar: 12978199.977908714,
			sek: 36553711.63798218,
			sgd: 4680353.916453169,
			thb: 127772697.16601403,
			try: 112203335.61266914,
			twd: 112185424.70038809,
			uah: 140063150.63986588,
			usd: 3460377.179542414,
			vef: 346487.56698758184,
			vnd: 87927269274.19353,
			xag: 117992.667747245,
			xau: 1505.2986768727437,
			xdr: 2632028.6299263705,
			xlm: 34646378.45239776,
			xrp: 6940893.829780108,
			yfi: 530.105720545015,
			zar: 65400090.58019787,
			bits: 49679437.011733666,
			link: 211382.1166567898,
			sats: 4967943701.173367
		}
	},
	community_data: {
		facebook_likes: null,
		twitter_followers: null,
		reddit_average_posts_48h: 0,
		reddit_average_comments_48h: 0,
		reddit_subscribers: null,
		reddit_accounts_active_48h: null
	},
	developer_data: {
		forks: null,
		stars: null,
		subscribers: null,
		total_issues: null,
		closed_issues: null,
		pull_requests_merged: null,
		pull_request_contributors: null,
		code_additions_deletions_4_weeks: {
			additions: null,
			deletions: null
		},
		commit_count_4_weeks: null
	},
	public_interest_stats: {
		alexa_rank: null,
		bing_matches: null
	}
};

export const monthlyTransactionChartResponse = [
	{ month: '2024-04', totalTransactions: 13779 },
	{ month: '2024-05', totalTransactions: 11287 },
	{ month: '2024-06', totalTransactions: 11983 }
];

export const dailyTransactionChartResponse = [
	{ date: '2024-05-27', totalTransactions: 393 },
	{ date: '2024-05-28', totalTransactions: 352 },
	{ date: '2024-05-29', totalTransactions: 355 }
];

export const accountStatisticsResult = {
	total: 984546,
	harvesting: 23675,
	eligibleForHarvesting: 9093,
	top10AccountsImportance: 69.1,
	harvestingAccountsPercentage: 2.4,
	importanceBreakdown: [
		[21.0754, 'NANEPSBUVE5NLYXCTP52LK3YAOSZUAIVOAD4FGSV'],
		[0.577, 'NAXB67KOXSIDPNGTOJA35MTNCK4AHB6JE2MJRER7'],
		[3.4318, 'NAXF4PC4RUB7HRKCCVDWFLILUUAO2HRETM34OCQZ'],
		[6.9861, 'NA2P5F6DHPZMUJMKR2E2HNBFHDQVC3YRYNPFEH3V'],
		[0.5683, 'NCES7OKBYZRCSTSNRX45H6E67J6OXABKNT6IRD2P'],
		[23.4171, 'NCHESTYVD2P6P646AMY7WSNG73PCPZDUQNSD6JAK'],
		[3.9006, 'NCT7LUEQJI3W5BELZVD7SLNUTZEKX4XAEVTRTYQZ'],
		[0.5259, 'NCYAVMNQOZ3MZETEBD34ACMAX3S57WUSWAZWY3DW'],
		[3.6243, 'NCZX5HSEAPW4APQIWMADPUXP3EKMLFDDWYACWS3J'],
		[4.9945, 'NDHEJKXY6YK7JGRFQT2L7P3O5VMUGR4BWKQNVXXQ'],
		[30.8985, 'Rest']
	],
	harvestingAccountsChart: [
		[2.4, 'Harvesting'],
		[97.6, 'Not harvesting']
	]
};

export const blockStatisticsResult = {
	blockTimeChart: [
		[4695077, 6],
		[4695078, 66],
		[4695079, 27],
		[4695080, 75],
		[4695081, 10],
		[4695082, 279],
		[4695083, 45],
		[4695084, 35],
		[4695085, 54]
	],
	blockFeeChart: [
		[4695077, 0],
		[4695078, 0.1],
		[4695079, 0],
		[4695080, 0],
		[4695081, 0],
		[4695082, 0],
		[4695083, 0],
		[4695084, 0],
		[4695085, 0]
	],
	blockDifficultyChart: [
		[4695077, '19.01'],
		[4695078, '19.03'],
		[4695079, '19.03'],
		[4695080, '19.02'],
		[4695081, '18.94'],
		[4695082, '19.22'],
		[4695083, '18.26'],
		[4695084, '18.06'],
		[4695085, '18.46']
	],
	blockTime: 66,
	blockFee: 0.011111,
	blockDifficulty: '18.46'
};

export const transactionStatisticsResult = {
	averagePerBlock: 1,
	total: 10667593,
	last30Day: 17457,
	last24Hours: 630
};

export const marketDataResult = {
	price: 0.02100488674247058,
	priceChange: -0.9530425112576048,
	volume: 49221365.7216442,
	circulatingSupply: 189043980.66123033,
	treasury: 0
};

export const monthlyTransactionChartResult = [
	['2024-04-01', 13779],
	['2024-05-01', 11287],
	['2024-06-01', 11983]
];
export const dailyTransactionChartResult = [
	['2024-05-27', 393],
	['2024-05-28', 352],
	['2024-05-29', 355]
];
export const blockTransactionChartResult = [
	[4695076, 1],
	[4695077, 0],
	[4695078, 1]
];
