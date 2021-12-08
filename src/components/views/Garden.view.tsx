import Header from '../Header';
import { TabGIVbacksTop, TabGIVbacksBottom } from '../homeTabs/GIVbacks';
import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';
import { TabGardenTop, TabGardenBottom } from '../homeTabs/GIVgarden';
import { TabGIVstreamTop, TabGIVstreamBottom } from '../homeTabs/GIVstream';
import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

function GIVgardenView() {
	return (
		<>
			<Header />
			<TabGardenTop />
			<Tabs />
			<TabGardenBottom />,
		</>
	);
}

export default GIVgardenView;
