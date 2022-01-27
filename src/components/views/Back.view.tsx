import { Footer } from '../Footer';
import Header from '../Header';
import { TabGIVbacksTop, TabGIVbacksBottom } from '../homeTabs/GIVbacks';

import Tabs from '../Tabs';

function GIVbackView() {
	return (
		<>
			<Header />
			<Tabs />
			<TabGIVbacksTop />
			<TabGIVbacksBottom />
			<Footer />
		</>
	);
}

export default GIVbackView;
