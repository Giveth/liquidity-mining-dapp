import config from '@/configuration';
import { useOnboard } from '@/context';
import { Footer } from '../Footer';
import Header from '../Header';
import { TabGardenTop, TabGardenBottom } from '../homeTabs/GIVgarden';
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
			<TabGardenBottom />
			<Footer />
		</>
	);
}

export default GIVgardenView;
