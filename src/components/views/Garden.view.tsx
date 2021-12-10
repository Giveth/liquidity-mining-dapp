import config from '@/configuration';
import { useOnboard } from '@/context';
import Header from '../Header';
import { TabGIVbacksTop, TabGIVbacksBottom } from '../homeTabs/GIVbacks';
import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';
import { TabGardenTop, TabGardenBottom } from '../homeTabs/GIVgarden';
import { TabGIVstreamTop, TabGIVstreamBottom } from '../homeTabs/GIVstream';
import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';
import { WrongNetworkInnerModal } from '../modals/WrongNetwork';

import Tabs from '../Tabs';

function GIVgardenView() {
	const { isReady, network } = useOnboard();
	const { XDAI_NETWORK_NUMBER } = config;

	return (
		<>
			{isReady && network !== XDAI_NETWORK_NUMBER && (
				<WrongNetworkInnerModal
					targetNetworks={[XDAI_NETWORK_NUMBER]}
					text='GIVgarden is available on xDAI network.'
				/>
			)}
			<Header />
			<TabGardenTop />
			<Tabs />
			<TabGardenBottom />,
		</>
	);
}

export default GIVgardenView;
