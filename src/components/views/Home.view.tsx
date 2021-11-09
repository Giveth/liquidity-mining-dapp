import Header from '../Header';
import { TabGIVbacksTop, TabGIVbacksBottom } from '../homeTabs/GIVbacks';
import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';
import { TabGardenTop, TabGardenBottom } from '../homeTabs/GIVgarden';
import { TabGIVstreamTop, TabGIVstreamBottom } from '../homeTabs/GIVstream';
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
						label: 'GIVstream',
						topComponent: <TabGIVstreamTop />,
						bottomComponent: <TabGIVstreamBottom />,
					},
				]}
			></Tabs>
		</>
	);
}

export default HomeView;
