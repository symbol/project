import LoadingIndicator from './LoadingIndicator';
import ValueMosaic from './ValueMosaic';
import ValueTransaction from './ValueTransaction';
import styles from '@/styles/components/ValueTransactionSquares.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MAX_DATA_LENGTH = 400;

const Tooltip = ({ fee }) => <ValueMosaic isNative amount={fee} />;

const ValueTransactionSquares = ({ data = [], isTransactionPreviewEnabled, isLoading, className }) => {
	const { t } = useTranslation('common');
	const isChartPresentable = data.length < MAX_DATA_LENGTH;
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const series = [
		{
			data: data.map(item => ({
				x: `${item.fee}`,
				y: item.fee,
				fillColor: '#52B12C'
			}))
		}
	];
	const options = {
		legend: {
			show: false
		},
		stroke: {
			colors: ['rgb(224, 243, 241)']
		},
		chart: {
			width: '100%',
			type: 'treemap',
			animations: {
				enabled: false
			},
			toolbar: {
				show: false
			},
			sparkline: {
				enabled: true
			},
			events: {
				dataPointSelection: (event, config, { dataPointIndex }) => {
					const transaction = data[dataPointIndex];
					setSelectedTransaction(currentValue => (currentValue?.hash === transaction.hash ? null : transaction));
				}
			}
		},
		dataLabels: {
			format: 'scale',
			enabled: true,
			offsetY: -3
		},
		plotOptions: {
			treemap: {
				enableShades: false,
				useFillColorAsStroke: false,
				shadeIntensity: 1
			}
		},
		tooltip: {
			custom: ({ series, seriesIndex, dataPointIndex, w }) => {
				const fee = series[seriesIndex][dataPointIndex];
				return renderToString(<Tooltip fee={fee} />);
			}
		},
		states: {
			hover: {
				filter: {
					type: 'none'
				}
			}
		}
	};

	return (
		<div className={`${styles.valueTransactionSquares} ${className}`} id="chart">
			{!!data.length && !isLoading && isChartPresentable && (
				<ReactApexChart className={styles.chart} options={options} series={series} type="treemap" height="100%" />
			)}
			{!data.length && !isLoading && <div className={styles.emptyDataMessage}>{t('message_emptyTable')}</div>}
			{!!isTransactionPreviewEnabled && !!selectedTransaction && (
				<div className={styles.selectedTransaction}>
					<ValueTransaction
						type={selectedTransaction.type}
						value={selectedTransaction.hash}
						amount={selectedTransaction.amount}
					/>
				</div>
			)}
			{isLoading && (
				<div className={styles.loadingIndicator}>
					<LoadingIndicator />
				</div>
			)}
		</div>
	);
};

export default ValueTransactionSquares;