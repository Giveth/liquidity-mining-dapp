import { Footer } from '../Footer';
import Header from '../Header';
import { TabGardenTop, TabGardenBottom } from '../homeTabs/GIVgarden';

import Tabs from '../Tabs';

function GIVgardenView() {
	return (
		<>
			<Header />
			<Tabs />
			<TabGardenTop />
			<TabGardenBottom />
			<Footer />
		</>
	);
}

export default GIVgardenView;
