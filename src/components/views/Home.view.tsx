import Header from '../Header';
import { TabGIVbacksTop, TabGIVbacksBottom } from '../homeTabs/GIVbacks';
import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';
import { TabGardenTop, TabGardenBottom } from '../homeTabs/GIVgarden';
import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

function HomeView() {
	return (
		<>
			<Header />
			{/*  */}
			<Tabs
				tabs={[
					{
						label: 'Overview',
						topComponent: <TabOverviewTop />,
						bottomComponent: <TabOverviewBottom />,
					},
					{
						label: 'GIVgarden',
						topComponent: <TabGardenTop />,
						bottomComponent: <TabGardenBottom />,
					},
					{
						label: 'GIVfarm',
						topComponent: <TabGIVfarmTop />,
						bottomComponent: <TabGIVfarmBottom />,
					},
					{
						label: 'GIVbacks',
						topComponent: <TabGIVbacksTop />,
						bottomComponent: <TabGIVbacksBottom />,
					},
					{
						label: 'GIVstrem',
						topComponent: <></>,
						bottomComponent: <></>,
					},
				]}
			></Tabs>
		</>
	);
}

export default HomeView;
