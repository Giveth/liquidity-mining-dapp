import Header from '../Header';
import TabGIVfarm from '../homeTabs/GIVfarm';
import TabGIVgarden from '../homeTabs/GIVgarden';
import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

function HomeView() {
	return (
		<>
			<Header />
			{/*  */}
			<Tabs
				tabs={[
					{ label: 'Overview', topComponent: <TabOverviewTop />,  bottomComponent: <TabOverviewBottom /> },
					{ label: 'GIVgarden', topComponent: <></>,  bottomComponent: <TabGIVgarden /> },
					{ label: 'GIVfarm', topComponent: <></>,  bottomComponent: <TabGIVfarm /> },
					{ label: 'GIVbacks', topComponent: <></>,  bottomComponent: <></> },
					{ label: 'GIVstrem', topComponent: <></>,  bottomComponent: <></> },
				]}
			></Tabs>
		</>
	);
}

export default HomeView;
