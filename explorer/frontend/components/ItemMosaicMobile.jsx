import ValueMosaic from './ValueMosaic';
import ValueTimestamp from './ValueTimestamp';
import styles from '@/styles/components/ItemMosaicMobile.module.scss';

const ItemMosaicMobile = ({ data, chainHeight }) => {
	const { name, id, supply, registrationTimestamp, namespaceExpirationHeight } = data;

	return (
		<div className={styles.itemMosaicMobile}>
			<ValueMosaic
				mosaicName={name}
				mosaicId={id}
				amount={supply}
				size="md"
				chainHeight={chainHeight}
				expirationHeight={namespaceExpirationHeight}
			/>
			<ValueTimestamp className={styles.timestamp} value={registrationTimestamp} />
		</div>
	);
};

export default ItemMosaicMobile;
