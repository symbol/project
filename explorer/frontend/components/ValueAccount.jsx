import Avatar from '@/components/Avatar';
import ButtonCopy from '@/components/ButtonCopy';
import { STORAGE_KEY } from '@/constants';
import styles from '@/styles/components/ValueAccount.module.scss';
import { trunc, useStorage } from '@/utils';
import Link from 'next/link';
import { useState } from 'react';

const ValueAccount = ({ address, size, raw, position, className, onClick }) => {
	const [name, setName] = useState();
	useStorage(STORAGE_KEY.ADDRESS_BOOK, [], addressBook => {
		const name = addressBook.find(item => item.address === address)?.name;
		setName(name);
	});
	let containerStyle = '';
	const textStyle = size === 'md' ? styles.textMd : '';
	const displayedText = !raw && name ? `${name} (${trunc(address, 'address-short')})` : address;

	switch (position) {
		case 'left':
			containerStyle = styles.containerLeft;
			break;
		case 'right':
			containerStyle = styles.containerRight;
			break;
	}

	const handleClick = e => {
		if (!onClick) return;
		e.preventDefault();
		onClick();
	};

	return (
		<div className={`${styles.valueAccount} ${containerStyle} ${className}`}>
			<Avatar type="account" value={address} size={size} />
			<div className={styles.addressContainer}>
				<Link className={textStyle} href={`/accounts/${address}`} onClick={handleClick}>
					{displayedText}
				</Link>
				<ButtonCopy value={address} />
			</div>
		</div>
	);
};

export default ValueAccount;
