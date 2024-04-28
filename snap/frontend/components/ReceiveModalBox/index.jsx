import helper from '../../utils/helper';
import Address from '../Address';
import ModalBox from '../ModalBox';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ReceiveModalBox = ({ account, isOpen, onRequestClose }) => {
	const [base64QR, setBase64QR] = useState('');

	useEffect(() => {
		const generateQR = async () => {
			try {
				const qr = await helper.generateAccountQRBase64(account);
				setBase64QR(qr);
			} catch (error) {
				throw new Error(`Fail to generate QR: ${error}`);
			}
		};

		generateQR();
	}, [account]);

	return (
		<ModalBox isOpen={isOpen} onRequestClose={onRequestClose}>
			<div className='flex flex-col px-5 text-center'>
				<div className='text-2xl font-bold mb-6'>
                    Receive
				</div>

				<div className='flex items-center justify-center mb-6'>
					{
						base64QR && <Image
							src={base64QR}
							width={200}
							height={200}
							alt='Account QR'
						/>
					}

				</div>

				<Address account={account} />
			</div>
		</ModalBox>
	);
};

export default ReceiveModalBox;
