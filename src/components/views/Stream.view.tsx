import { Footer } from '../Footer';
import Header from '../Header';
import { TabGIVstreamTop, TabGIVstreamBottom } from '../homeTabs/GIVstream';

import Tabs from '../Tabs';

function GIVstreamView() {
	return (
		<>
			<Header />
			<Tabs />
			<TabGIVstreamTop />
			<TabGIVstreamBottom />
			<Footer />
		</>
	);
}

export default GIVstreamView;
