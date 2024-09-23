import ButtonCopy from '@/components/ButtonCopy';
import styles from '@/styles/components/ValueTransactionHash.module.scss';
import { createPageHref, truncateString } from '@/utils';
import Link from 'next/link';

const ValueTransactionHash = ({ value }) => {
	return (
		<div className={styles.valueTransactionHash}>
			<Link className={styles.text} href={createPageHref('transactions', value)} title={value}>
				{truncateString(value, 'hash')}
			</Link>
			<ButtonCopy value={value} />
		</div>
	);
};

export default ValueTransactionHash;