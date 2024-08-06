import { useWalletContext } from '../../context';
import Button from '../Button';
import Input from '../Input';
import ModalBox from '../ModalBox';
import { useEffect, useState } from 'react';
import { SymbolFacade } from 'symbol-sdk/symbol';

const TransferModalBox = ({ isOpen, onRequestClose }) => {
	const { walletState } = useWalletContext();
	const { selectedAccount, network, mosaicInfo } = walletState;
	const mosaicsBalance = selectedAccount.mosaics || [];
	const facade = new SymbolFacade(network.networkName);

	const [to, setTo] = useState('');
	const [message, setMessage] = useState('');
	const [isEncrypt, setIsEncrypt] = useState(false);
	const [mosaicSelectorManager, setMosaicSelectorManager] = useState([]);
	const [selectedMosaics, setSelectedMosaics] = useState([]);
	const [errors, setErrors] = useState({
		address: null,
		message: null,
		amount: []
	});

	const validateForm = () => {
		const validate = (field, value) => {
			switch (field) {
			case 'address':
				return facade.network.isValidAddressString(value) ? null : 'Invalid address';
			case 'message':
				return 1024 >= value.length ? null : 'Message length should not exceed 1024 characters';
			case 'amount':
				return value.map((amount, index) => {
					const maxBalance = mosaicsBalance.find(mosaic => mosaic.id === selectedMosaics[index].id).amount;
					const absoluteAmount = amount * (10 ** mosaicInfo[selectedMosaics[index].id].divisibility);

					return absoluteAmount > maxBalance ? 'Not enough balance' : null;
				});
			default:
				return null;
			}
		};

		setErrors(errors => ({
			...errors,
			amount: validate('amount', selectedMosaics.map(mosaic => mosaic.amount))
		}));

		setErrors(errors => ({ ...errors, address: validate('address', to) }));
		setErrors(errors => ({ ...errors, message: validate('message', message) }));
	};

	const getUnselectedMosaics = () => {
		const selectedMosaicIds = selectedMosaics.map(mosaic => mosaic.id);
		return mosaicsBalance.filter(mosaic => !selectedMosaicIds.includes(mosaic.id));
	};

	const updateMosaicSelector = () => {
		const updatedMosaicSelectorManager = selectedMosaics.map((mosaic, index) => {
			const unselected = getUnselectedMosaics();
			const selected = mosaicsBalance.find(ori => ori.id === mosaic.id);
			return mosaicSelectorManager[index] = [selected, ...unselected];
		});

		setMosaicSelectorManager(updatedMosaicSelectorManager);
	};

	const addMosaic = () => {
		const unSelectedMosaics = getUnselectedMosaics();

		setSelectedMosaics([...selectedMosaics, {
			id: unSelectedMosaics[0].id,
			amount: 0
		}]);
	};

	const removeMosaic = () => {
		// Remove the last item
		const updateSelectedMosaics = selectedMosaics.slice(0, -1);

		setSelectedMosaics(updateSelectedMosaics);
	};

	const handleSelectChange = (event, index) => {
		const updateMosaic = {
			id: event.target.value,
			amount: 0
		};

		const updateSelectedMosaics = selectedMosaics.map((mosaic, i) => i === index ? updateMosaic : mosaic);

		setSelectedMosaics(updateSelectedMosaics);
	};

	const handleAmountChange = (event, index) => {
		const newAmount = event.target.value;
		const updateMosaics = [...selectedMosaics];
		updateMosaics[index] = { ...updateMosaics[index], amount: newAmount };
		setSelectedMosaics(updateMosaics);
	};

	const handleMaxAmount = index => {
		const maxAmount = mosaicsBalance.find(mosaic => mosaic.id === selectedMosaics[index].id).amount;

		const relativeAmount = maxAmount / (10 ** mosaicInfo[selectedMosaics[index].id].divisibility);

		const updateMosaics = [...selectedMosaics];
		updateMosaics[index] = { ...updateMosaics[index], amount: relativeAmount };

		setSelectedMosaics(updateMosaics);

		setErrors(errors => ({
			...errors,
			amount: validate('amount', selectedMosaics.map(mosaic => mosaic.amount))
		}));
	};

	const handleInputAddress = event => {
		const newAddress = event.target.value;
		setTo(newAddress);
	};

	const handleMessageChange = event => {
		const newMessage = event.target.value;
		setMessage(newMessage);
	};

	useEffect(() => {
		if (selectedAccount && selectedAccount.mosaics) {
			if (0 === mosaicsBalance.length) {
				return;
			} else {
				setSelectedMosaics([{
					id: mosaicsBalance[0].id,
					amount: 0
				}]);
				setMosaicSelectorManager([mosaicsBalance]);
			}
		}

	}, [selectedAccount.mosaics]);

	useEffect(() => {
		// Update mosaic selector when selectedMosaics change
		updateMosaicSelector();

	}, [selectedMosaics]);

	useEffect(() => {
		validateForm();
	}, [selectedMosaics, to, message]);

	const renderMosaicSelector = (mosaicOption, index) => {
		return (
			<div key={index} className='p-2 text-xs'>
				<div className='flex'>
					<select className='w-2/3 px-4 text-black bg-[#D9D9D9] rounded-xl' onChange={event => handleSelectChange(event, index)}>
						{
							mosaicOption.map(option => (
								<option key={option.id} value={option.id}>
									{0 < mosaicInfo[option.id].name.length ? mosaicInfo[option.id].name[0] : option.id}
								</option>
							))
						}
					</select>

					<div className='flex items-center justify-around'>
						<input className='w-2/3 px-4 py-2 text-black bg-[#D9D9D9] rounded-xl' type='number' placeholder='relative amount'
							value={selectedMosaics[index]?.amount || 0} onChange={event => handleAmountChange(event, index)} />
						<span className='cursor-pointer' onClick={() => handleMaxAmount(index)}>Max</span>
					</div>
				</div>
				<div>
					{errors.amount[index] && <p className='text-red-500 text-xs'>{errors.amount[index]}</p>}
				</div>
			</div>
		);
	};

	return (
		<ModalBox isOpen={isOpen} onRequestClose={onRequestClose}>
			<div role='transfer-form' className='flex flex-col px-5 text-center'>
				<div className='text-2xl font-bold mb-6'>
                    Send
				</div>

				<Input
					role='address-input'
					placeholder='Recipient address'
					className='p-2 flex items-start'
					label='To'
					value={to}
					onChange={handleInputAddress}
					errorMessage={errors.address}
				/>

				<div>
					<label className="p-2 flex text-sm font-medium">
                        Mosaic
					</label>

					{
						mosaicSelectorManager.map((mosaic, index) => (
							<div role='mosaic-selector' key={index}>
								{renderMosaicSelector(mosaic, index)}
							</div>
						))
					}

					<div className='flex justify-end'>
						{
							mosaicsBalance.length > mosaicSelectorManager.length &&
                            <div className='p-2 flex justify-end cursor-pointer' onClick={addMosaic}>
                                Add
                            </div>
						}

						{
							1 < mosaicSelectorManager.length &&
                            <div className='p-2 flex justify-end cursor-pointer' onClick={removeMosaic}>
                                Remove
                            </div>
						}
					</div>
				</div>

				<div>
					<Input
						role='message-input'
						placeholder='Message...'
						className='p-2 flex items-start'
						label='Message'
						value={message}
						onChange={handleMessageChange}
						errorMessage={errors.message}
					/>

					<div className='flex items-center justify-end'>
						<input
							role='message-checkbox'
							type='checkbox' name='isEncrypt'
							checked={isEncrypt}
							onChange={event => setIsEncrypt(event.target.checked)} /> Encrypt
					</div>

				</div>
				<div>
					<Button>Send</Button>
				</div>

			</div>
		</ModalBox>
	);
};

export default TransferModalBox;
