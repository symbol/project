import './Completed.scss';
import Table from '../../components/Table';
import TableColumn from '../../components/Table/TableColumn';
import config from '../../config';
import { addressTemplate, balanceTemplate, optinTypeTemplate, infoTemplate, dateTransactionHashTemplate } from '../../utils/pageUtils';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import React, { useState, useEffect, useRef} from 'react';
const { NemFacade, SymbolFacade } = require('symbol-sdk').facade;
const { Hash256 } = require('symbol-sdk').nem;

const Completed = ({defaultPaginationType}) => {
	const [loading, setLoading] = useState(true);
	const [first, setFirst] = useState(1);
	const [paginationType] = useState(defaultPaginationType);
	const [allPagesLoaded, setAllPagesLoaded] = useState(false);

	const [completed, setCompleted] = useState({
		data: [],
		pagination: {
			pageNumber: 0,
			pageSize: config.defaultPageSize,
			totalRecord: 0
		}
	});
	const [filterSearch, setFilterSearch] = useState('');
	const [filterOptinType, setFilterOptinType] = useState('');
	const [filterOptinTypeSubmit, setFilterOptinTypeSubmit] = useState(false);
	const [invalidFilterSearch, setInvalidFilterSearch] = useState(false);
	const initialRender = useRef(true);

	const fetchCompleted = async ({pageSize = config.defaultPageSize, pageNumber = 1}) => {
		const [nemAddress, symbolAddress, transactionHash] = parseFilterSearch(filterSearch?.trim());
		return await fetch(`/api/completed?pageSize=${pageSize}&pageNumber=${pageNumber}` +
		`&nemAddress=${nemAddress}&symbolAddress=${symbolAddress}&transactionHash=${transactionHash}&optinType=${filterOptinType}`)
			.then(res => res.json());
	};

	const parseFilterSearch = filterSearch => {
		const searchVal = filterSearch?.trim().toUpperCase();
		try {
			const address = new NemFacade.Address(searchVal);
			return [address.toString(), '', ''];
		} catch (e) {
		}
		try {
			const address = new SymbolFacade.Address(searchVal);
			return ['', address.toString(), ''];
		} catch (e) {
		}
		try {
			const hash = new Hash256(searchVal);
			return ['', '', hash.toString()];
		} catch (e) {
		}
		return ['', '', ''];
	};

	const handlePageChange = async ({page, rows, first}) =>{
		const nextPage = page ?? (completed.pagination.pageNumber || 0) + 1;
		setLoading(true);
		setFirst(first);
		const result = await fetchCompleted({
			pageNumber: nextPage,
			pageSize: rows
		});

		setAllPagesLoaded(!result.data || 0 === result.data.length);

		if ('scroll' === paginationType && 1 !== nextPage)
			setCompleted({data: [...completed.data, ...result.data], pagination: result.pagination});
		else
		  setCompleted(result);
		setLoading(false);
	};

	const shouldDoInitalFetch = initialRender.current;
	useEffect(() => {
		if (shouldDoInitalFetch) {
			const getCompleted = async () => {
				const result = await fetchCompleted({
					pageNumber: 1
				});
				setCompleted(result);
			};

			getCompleted().then(() => {setLoading(false);});
		}
	}, [shouldDoInitalFetch]);

	const validateFilterSearch = value => {
		return !parseFilterSearch(value).every(v => '' === v);
	};

	const onFilterSearchChange = e => {
		const {value} = e.target;

		setInvalidFilterSearch(value ? !validateFilterSearch(value) : false);
		setFilterSearch(value ?? '');
		setFilterOptinType('');
	};

	const clearFilterSearch = () => {
		onFilterSearchChange({target: ''});
	};

	const onFilterOptinChange = e => {
		clearFilterSearch();
		setFilterOptinType(e.value);
		setFilterOptinTypeSubmit(true);
	};

	const onFilterSubmit = async e => {
		if (e)
			e.preventDefault();
		await handlePageChange({page: 1, rows: config.defaultPageSize});
		setFilterOptinTypeSubmit(false);
	};

	useEffect(() => {
		if (!initialRender.current && filterOptinTypeSubmit)
			onFilterSubmit();
		initialRender.current = false;
	}, [filterOptinTypeSubmit]);

	const nemAddressTemplate = rowData => {
		return addressTemplate(rowData, 'nemAddress', config, true);
	};

	const symbolAddressTemplate = rowData => {
		return addressTemplate(rowData, 'symbolAddress', config, true);
	};

	const nemBalanceTemplate = rowData => {
		return balanceTemplate(rowData, 'nemBalance');
	};

	const symbolBalanceTemplate = rowData => {
		return balanceTemplate(rowData, 'symbolBalance');
	};

	const nemDateHashesTemplate = rowData => {
		return dateTransactionHashTemplate(rowData, 'nemHashes', 'nemTimestamps', config, true);
	};

	const symbolDateHashesTemplate = rowData => {
		return dateTransactionHashTemplate(rowData, 'symbolHashes', 'symbolTimestamps' , config, true);
	};

	const isPostoptinTemplate = rowData => {
		return optinTypeTemplate(rowData, 'isPostoptin');
	};

	const labelTemplate = rowData => {
		return infoTemplate(rowData, 'label');
	};

	const optinTypes = [{label: 'PRE', value: 'pre'}, {label: 'POST', value: 'post'}];

	const header = (
		<form onSubmit={onFilterSubmit}>
			<div className="flex flex-row w-full">
				<span className="p-input-icon-right w-9">
					<i className="pi pi-times" onClick={clearFilterSearch}/>
					<InputText id="filterSearch" value={filterSearch} onChange={onFilterSearchChange} className="w-full"
						placeholder="NEM Address / Symbol Address / Tx Hash" aria-describedby="filterSearch-help" />
				</span>
				<span className="w-3 ml-5">
					<SelectButton optionLabel="label" optionValue="value" value={filterOptinType} options={optinTypes}
						onChange={onFilterOptinChange}></SelectButton>
				</span>
			</div>
			{
				invalidFilterSearch &&
					<small id="filterSearch-help" className="p-error block">
						Invalid NEM / Symbol Address or Transaction Hash.
					</small>
			}
		</form>
	);

	return (
		<Table value={completed.data} rows={completed.pagination.pageSize}
			onPage={handlePageChange} loading={loading} totalRecords={completed.pagination.totalRecord}
			allPagesLoaded={allPagesLoaded} loadingMessage="Loading more items..."
			first={first} header={header} paginator={'paginator' === paginationType}>
			<TableColumn field="isPostoptin" header="Type" body={isPostoptinTemplate} align="center"/>
			<TableColumn field="label" header="Label" body={labelTemplate} align="left" className="labelCol"/>
			<TableColumn field="nemAddress" header="NEM Address" body={nemAddressTemplate} align="left"/>
			<TableColumn field="nemHashes" header="Hash" body={nemDateHashesTemplate} align="left"/>
			<TableColumn field="nemBalance" header="Balance" body={nemBalanceTemplate} align="right"/>
			<TableColumn field="symbolAddress" header="Symbol Address" body={symbolAddressTemplate} align="left"/>
			<TableColumn field="symbolHashes" header="Hash" body={symbolDateHashesTemplate} align="left"/>
			<TableColumn field="symbolBalance" header="Balance" body={symbolBalanceTemplate} align="right"/>
		</Table>
	);
};

Completed.defaultProps = {
	defaultPaginationType: 'scroll'
};
export default Completed;
