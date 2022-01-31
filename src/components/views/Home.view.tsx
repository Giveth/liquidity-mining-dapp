import { Footer } from '../Footer';
import Header from '../Header';
import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

function HomeView() {
	return (
		<>
			<Header />
			<Tabs />
			<TabOverviewTop />
			<TabOverviewBottom />
			<Footer />
		</>
	);
}

export default HomeView;
