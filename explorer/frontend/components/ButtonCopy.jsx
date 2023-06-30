import styles from '@/styles/components/ButtonCopy.module.scss';
import { copyToClipboard } from '@/utils';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { toast } from 'react-toastify';

const ButtonCopy = ({ value, className }) => {
	const { t } = useTranslation();

	const copy = () => {
		try {
			copyToClipboard(value);
			toast.success(t('message_copySuccess'));
		} catch {
			toast.error(t('message_copyFailed'));
		}
	};

	return (
		<div className={`${styles.buttonCopy} ${className}`} onClick={copy}>
			<Image src="/images/icon-copy.png" fill alt="Copy" />
		</div>
	);
};

export default ButtonCopy;
