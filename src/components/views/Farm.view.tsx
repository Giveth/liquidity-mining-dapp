import config from '@/configuration';
import { useOnboard } from '@/context';
import { Footer } from '../Footer';
import Header from '../Header';
import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';
import { WrongNetworkInnerModal } from '../modals/WrongNetwork';

import Tabs from '../Tabs';

function GIVfarmView() {
	const { isReady, network } = useOnboard();
	const { MAINNET_NETWORK_NUMBER, XDAI_NETWORK_NUMBER } = config;
	const targetNetworks = [MAINNET_NETWORK_NUMBER, XDAI_NETWORK_NUMBER];

	return (
		<>
			{isReady &&
				network !== MAINNET_NETWORK_NUMBER &&
				network !== XDAI_NETWORK_NUMBER && (
					<WrongNetworkInnerModal
						targetNetworks={targetNetworks}
						text='GIVfarm is available on Mainnet and xDAI networks.'
					/>
				)}
			<Header />
			<TabGIVfarmTop />
			<Tabs />
			<TabGIVfarmBottom />
			<Footer />
		</>
	);
}

export default GIVfarmView;
