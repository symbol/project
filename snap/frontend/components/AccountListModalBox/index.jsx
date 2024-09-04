import { useWalletContext } from '../../context';
import helper from '../../utils/helper';
import AccountCreationFormModalBox from '../AccountCreationFormModalBox';
import AccountRenameModalBox from '../AccountRenameModalBox';
import Button from '../Button';
import ModalBox from '../ModalBox';
import makeBlockie from 'ethereum-blockies-base64';
import Image from 'next/image';
import { useState } from 'react';
import { PrivateKey } from 'symbol-sdk';

const AccountListModalBox = ({ isOpen, onRequestClose }) => {
	const { walletState, dispatch, symbolSnap } = useWalletContext();
	const { accounts } = walletState;
	const [ accountCreateFormVisible, setAccountCreateFormVisible ] = useState(false);
	const [ accountImportFormVisible, setAccountImportFormVisible ] = useState(false);
	const [ renameAccountId, setRenameAccountId ] = useState(null);

	const handleOpenAccountCreateForm = () => {
		setAccountCreateFormVisible(!accountCreateFormVisible);
		onRequestClose(false);
	};

	const handleOpenAccountImportForm = () => {
		setAccountImportFormVisible(!accountImportFormVisible);
		onRequestClose(false);
	};

	const handleOpenRenameForm = accountId => {
		setRenameAccountId(accountId);
		onRequestClose(false);
	};

	const handleSelectAccount = async account => {
		await helper.updateAccountMosaics(dispatch, symbolSnap, account.id);
		onRequestClose(false);
	};

	const validateAccountName = accountName => {
		const isAccountNameExist = newAccountName => {
			return Object.values(accounts).some(account => account.label.toUpperCase() === newAccountName.toUpperCase());
		};

		if ('' === accountName.trim() )
			return 'Account name is required';
		if (isAccountNameExist(accountName))
			return 'Account name already exists';

		return null;
	};

	const validatePrivateKey = privateKey => {
		try {
			new PrivateKey(privateKey);
			return null;
		}
		catch (error) {
			return 'Invalid private key';
		}
	};

	const handleCreateNewAccount = ({ accountName }) => {
		helper.createNewAccount(dispatch, symbolSnap, accounts, accountName);
	};

	const handleImportAccount = ({ accountName, privateKey }) => {
		helper.importAccount(dispatch, symbolSnap, accounts, accountName, privateKey);
	};

	const renderImportType = type => {
		return 'import' === type ? `(${type})` : '';
	};

	const renderAccount = account => {
		return (
			<div key={`wallet_${account.id}`} className='flex items-center justify-between'>
				<div className='flex items-center cursor-pointer'
					onClick={() => handleSelectAccount(account)}>
					<Image
						src={makeBlockie(account.address)}
						alt='account-profile'
						width={24}
						height={24}
						className='rounded-full w-10 h-10' />
					<div className='flex flex-col items-start justify-center p-2'>
						<div className='font-bold'>{account.label} {renderImportType(account.type)}</div>
						<div className='truncate w-[180px]'>{account.address}</div>
					</div>
				</div>
				<Button
					className='uppercase w-20 h-8 bg-secondary text-xs'
					onClick={() => handleOpenRenameForm(account.id)}
				>
					Rename
				</Button>
			</div>
		);
	};

	const handleRenameAccount = newLabel => {
		if (renameAccountId) {
			helper.renameAccountLabel(dispatch, symbolSnap, renameAccountId, newLabel);
			setRenameAccountId(null);
		}
	};

	return (
		<>
			<ModalBox isOpen={isOpen} onRequestClose={onRequestClose}>
				<div className='flex flex-col px-5 text-center'>
					<div className='text-2xl font-bold mb-6'>
							Wallet
					</div>

					<div className='flex flex-col overflow-y-auto h-72 items-center justify-start mb-6 text-xs'>
						{
							Object.keys(accounts).map(key => renderAccount(accounts[key]))
						}
					</div>

					<div className='flex justify-center font-bold pt-2'>
						<Button className='uppercase w-40 h-10 bg-secondary m-2' onClick={handleOpenAccountCreateForm}>
								Create
						</Button>
						<Button className='uppercase w-40 h-10 bg-secondary m-2' onClick={handleOpenAccountImportForm}>
								Import
						</Button>
					</div>
				</div>
			</ModalBox>

			<AccountCreationFormModalBox
				isOpen={accountCreateFormVisible}
				onRequestClose={setAccountCreateFormVisible}
				title='Create Account'
				onSubmit={handleCreateNewAccount}
				inputs={[
					{
						label: 'Account Name:',
						placeholder: 'Account Name',
						value: '',
						field: 'accountName',
						validate: value => validateAccountName(value || '')
					}
				]}
			/>

			<AccountCreationFormModalBox
				isOpen={accountImportFormVisible}
				onRequestClose={setAccountImportFormVisible}
				title='Import Account'
				onSubmit={handleImportAccount}
				inputs={[
					{
						label: 'Account Name:',
						placeholder: 'Account Name',
						value: '',
						field: 'accountName',
						validate: value => validateAccountName(value || '')
					},
					{
						label: 'Private Key:',
						placeholder: 'Private Key',
						value: '',
						field: 'privateKey',
						validate: value => validatePrivateKey(value)
					}
				]}
			/>

			<AccountRenameModalBox
				isOpen={!!renameAccountId}
				onRequestClose={() => setRenameAccountId(null)}
				onRename={handleRenameAccount}
				currentName={renameAccountId ? accounts[renameAccountId].label : ''}
				validateAccountName={validateAccountName}
			/>
		</>
	);
};

export default AccountListModalBox;
