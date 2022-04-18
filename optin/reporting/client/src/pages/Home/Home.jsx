import DownloadCSVButton from './DownloadCSVButton.jsx';
import Completed from '../Completed';
import Requests from '../Requests';
import { TabPanel, TabView } from 'primereact/tabview';
import React from 'react';
import 'react-tabs/style/react-tabs.css';
import './Home.scss';

const tabConfig = {
	completed: {
		label: 'Completed',
		table: <Completed />
	},
	inProgress : {
		label: 'In Progress',
		table: <Requests />
	}
};

const Home = function () {
	const [activeIndex, setActiveIndex] = React.useState(0);
	const [activePage, setActivePage] = React.useState('completed');
	const tabChangeHandler = e => {
		setActiveIndex(e.index);
		if (1 === e.index) 
			setActivePage('inProgress');
		else
			setActivePage('completed');
		
	};
	const downloadButton = <DownloadCSVButton activePage={activePage}/>;
	const renderTabList = () => {
		const tabList = Object.keys(tabConfig).map(key => {
			return (
				<TabPanel header={tabConfig[key].label} key={key}>
					{tabConfig[key].table}
				</TabPanel>
			);
		});

		tabList.push(<TabPanel headerTemplate={downloadButton} headerClassName="downloadButton"/>);
		return tabList;
	};

	return (
		<div className='App'>
			<div className='bgContainer' />
			<div className='mainContainerWrapper'>
				<div className='mainContainer'>
					<h2>Opt-in Summary</h2>
				</div>
				<div className='tableContainer'>
					<TabView activeIndex={activeIndex} onTabChange={tabChangeHandler}>
						{ renderTabList() }
					</TabView>
				</div>
			</div>
		</div>
	);
};

export default Home;
