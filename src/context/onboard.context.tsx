import bnc_onboard from 'bnc-onboard';
import config from '../configuration';
import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { API } from 'bnc-onboard/dist/src/interfaces';

const networkId = config.XDAI_NETWORK_NUMBER;
const dappId = config.BLOCKNATIVE_DAPP_ID;

export interface IOnboardContext {
	address: string;
	network: number;
	changeWallet: () => Promise<void>;
}
const initialValue = {
	address: '',
	network: 0,
	changeWallet: () => Promise.resolve(),
};
export const OnboardContext = createContext<IOnboardContext>(initialValue);

type Props = {
	children?: ReactNode;
};
export const OnboardProvider: FC<Props> = ({ children }) => {
	const [network, setNetwork] = useState<number>(initialValue.network);
	const [address, setAddress] = useState<string>(initialValue.address);
	const [onboard, setOnboard] = useState<API>();

	const initOnboard = () => {
		const _onboard = bnc_onboard({
			dappId,
			hideBranding: false,
			networkId,
			subscriptions: {
				wallet: wallet => {
					window.localStorage.setItem(
						'selectedWallet',
						wallet.name || '',
					);
				},
				address: setAddress,
				network: setNetwork,
			},
			walletSelect: {
				wallets: [
					{ walletName: 'metamask' },
					{
						walletName: 'walletConnect',
						rpc: {
							[config.MAINNET_NETWORK_NUMBER]:
								config.MAINNET_CONFIG.nodeUrl,
							[config.XDAI_NETWORK_NUMBER]:
								config.XDAI_CONFIG.nodeUrl,
						},
					},
				],
			},
			walletCheck: [
				{ checkName: 'derivationPath' },
				{ checkName: 'connect' },
				{ checkName: 'accounts' },
			],
		});

		const previouslySelectedWallet =
			window.localStorage.getItem('selectedWallet');
		if (previouslySelectedWallet) {
			_onboard
				.walletSelect(previouslySelectedWallet)
				.then(selected => selected && _onboard.walletCheck());
		}

		setOnboard(_onboard);
	};

	const changeWallet = async () => {
		if (onboard) {
			onboard.walletReset();
			await onboard.walletSelect();
			await onboard.walletCheck();
		}
	};

	useEffect(() => {
		initOnboard();
	}, []);

	return (
		<OnboardContext.Provider value={{ network, address, changeWallet }}>
			{children}
		</OnboardContext.Provider>
	);
};
