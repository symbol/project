import styles from '@/styles/components/ItemNodeMobile.module.scss';
import { useTranslation } from 'next-i18next';

const ItemNodeMobile = ({ data }) => {
	const { t } = useTranslation();
	const { name, endpoint, status, version } = data;

	return (
		<div className={styles.itemNodeMobile}>
			<div className={styles.mainSection}>
				<div className={styles.info}>
					<div className={styles.name}>{name}</div>
					<div>{endpoint}</div>
					<div>{status}</div>
					<div>{version}</div>
				</div>
			</div>
		</div>
	);
};

export default ItemNodeMobile;
