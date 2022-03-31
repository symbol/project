const optinRequestDB = require('../models/optinRequests');
const { NemFacade } = require('symbol-sdk').facade;

const controller = {
	getOptinRequests: async (req, res) => {
		const pageSize = parseInt(req.query.pageSize || 25, 10);
		const pageNumber = parseInt(req.query.pageNumber || 1, 10);
		const nemAddressBase32 = req.query.nemAddress;
		const statusIntToString = statusInt => {
			switch (statusInt) {
			case 0:
				return 'Pending';
			case 1:
				return 'Sent';
			case 5:
				return 'Error';
			default:
				return 'Unknown';
			}
		};

		try {
			const nemAddressBytes = nemAddressBase32 ? new NemFacade.Address(nemAddressBase32).bytes : null;
			const totalRecord = await optinRequestDB.getTotalRecord();

			const response = await optinRequestDB.getOptinRequestPagination({ pageNumber, pageSize, nemAddressBytes });

			const result = response.map(item => ({
				nemAddress: new NemFacade.Address(item.nemAddressBytes).toString(),
				optinTransactionHash: item.optinTransactionHashHex?.toLowerCase(),
				status: statusIntToString(item.payoutStatus),
				message: item.message
			}));

			res.json({
				data: result,
				pagination: {
					pageNumber,
					pageSize,
					totalRecord
				}
			});
		} catch (error) {
			res.json({ data: [], error: error.message });
		}
	}
};

module.exports = controller;
