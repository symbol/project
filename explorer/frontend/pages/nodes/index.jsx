import { fetchNodeLists, fetchSupernodePage } from '@/api/nodes';
import { fetchNodeStats } from '@/api/stats';
import Field from '@/components/Field';
import Filter from '@/components/Filter';
import ItemNodeMobile from '@/components/ItemNodeMobile';
import Section from '@/components/Section';
import Separator from '@/components/Separator';
import Table from '@/components/Table';
import styles from '@/styles/pages/Home.module.scss';
import { usePagination } from '@/utils';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps = async ({ locale }) => {
	const supernodePage = await fetchSupernodePage();
	const nodeList = await fetchNodeLists();
	const stats = await fetchNodeStats();

	return {
		props: {
			preloadedSupernodes: supernodePage.data,
			nodes: nodeList,
			stats,
			...(await serverSideTranslations(locale, ['common']))
		}
	};
};

const Nodes = ({ preloadedSupernodes, nodes, stats }) => {
	const { t } = useTranslation();
	const supernodePagination = usePagination(fetchSupernodePage, preloadedSupernodes);

	const nodeTableColumns = [
		{
			key: 'name',
			size: '20rem'
		},
		{
			key: 'endpoint',
			size: '30rem'
		},
		{
			key: 'version',
			size: '8rem'
		}
	];
	const supernodeTableColumns = [
		{
			key: 'name',
			size: '20rem'
		},
		{
			key: 'endpoint',
			size: '30rem'
		},
		{
			key: 'status',
			size: '8rem'
		}
	];

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>{t('page_nodes')}</title>
			</Head>
			<Section title={t('section_nodes')}>
				<div className="layout-flex-row-mobile-col">
					<div className="layout-grid-row layout-flex-fill">
						<div className="layout-flex-col layout-flex-fill">
							<Field title={t('field_totalNodes')}>{stats.total}</Field>
						</div>
					</div>
					<Separator className="no-mobile" />
					<div className="layout-grid-row layout-flex-fill">
						<div className="layout-flex-col layout-flex-fill">
							<Field title={t('field_supernodes')}>{stats.supernodes}</Field>
						</div>
					</div>
					<Separator className="no-mobile" />
					<div className="layout-grid-row layout-flex-fill">
						<div className="layout-flex-col layout-flex-fill">
							<Field title={t('field_difficulty')}>-</Field>
						</div>
					</div>
				</div>
			</Section>
			<Section
				tabs={[
					{
						label: t('section_nodes'),
						content: (
							<Table
								data={nodes}
								columns={nodeTableColumns}
								renderItemMobile={data => <ItemNodeMobile data={data} />}
								isLastPage
								isLastColumnAligned
							/>
						)
					},
					{
						label: t('section_supernodes'),
						content: (
							<Table
								data={supernodePagination.data}
								columns={supernodeTableColumns}
								isLoading={supernodePagination.isLoading}
								isLastPage={supernodePagination.isLastPage}
								isError={supernodePagination.isError}
								onEndReached={supernodePagination.requestNextPage}
								renderItemMobile={data => <ItemNodeMobile data={data} />}
								isLastColumnAligned
							/>
						)
					}
				]}
			/>
		</div>
	);
};

export default Nodes;
