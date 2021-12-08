import bnc_onboard from 'bnc-onboard';
import config from '../configuration';
import { Web3Provider } from '@ethersproject/providers';
import {
	useContext,
	createContext,
	FC,
	ReactNode,
	useEffect,
	useState,
	useRef,
} from 'react';
import { API, Wallet } from 'bnc-onboard/dist/src/interfaces';
import { providers } from 'ethers';

const networkId = config.XDAI_NETWORK_NUMBER;
const dappId = config.BLOCKNATIVE_DAPP_ID;

export interface IOnboardContext {
	address: string;
	network: number;
	changeWallet: () => Promise<void>;
	connect: () => Promise<void>;
	walletCheck: () => Promise<void>;
	isReady: boolean;
	provider: Web3Provider | null;
	lastBlockDate: Date;
}
const initialValue = {
	address: '',
	network: 0,
	changeWallet: () => Promise.resolve(),
	connect: () => Promise.resolve(),
	walletCheck: () => Promise.resolve(),
	isReady: false,
	provider: null,
	lastBlockDate: new Date(),
};
export const OnboardContext = createContext<IOnboardContext>(initialValue);

type Props = {
	children?: ReactNode;
};
export const OnboardProvider: FC<Props> = ({ children }) => {
	const [network, setNetwork] = useState<number>(initialValue.network);
	const [address, setAddress] = useState<string>(initialValue.address);
	const [onboard, setOnboard] = useState<API>();
	const [isReady, setIsReady] = useState(initialValue.isReady);
	const [provider, setProvider] = useState<Web3Provider | null>(null);
	const [wallet, setWallet] = useState<Wallet | null>(null);
	const [date, setDate] = useState<Date>(new Date());

	const datePoll = useRef<NodeJS.Timer | null>(null);

	const clearDatePoll = () => {
		if (datePoll.current) {
			clearInterval(datePoll.current);
			datePoll.current = null;
		}
	};

	useEffect(() => {
		if (provider) {
			const fetchBlockDate = async () => {
				try {
					const block = await provider.getBlock('latest');
					const { timestamp } = block;
					setDate(new Date(timestamp * 1000 + 30000));
				} catch (e) {}
			};

			fetchBlockDate();

			datePoll.current = setInterval(fetchBlockDate, 60000);
		}

		return clearDatePoll;
	}, [provider]);

	const updateProvider = () => {
		const ethersProvider =
			wallet && wallet.provider
				? new providers.Web3Provider(wallet.provider)
				: null;
		setProvider(ethersProvider);
	};

	useEffect(() => {
		if (!wallet) return;
		if (provider && provider.network?.chainId === network) return;

		updateProvider();
	}, [network]);

	useEffect(() => {
		updateProvider();
	}, [wallet]);

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
					setWallet(wallet);
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

		setOnboard(_onboard);
	};

	const connect = async (selectedWallet?: string) => {
		if (onboard) {
			try {
				const selected = await onboard.walletSelect(selectedWallet);
				if (!selected) {
					setIsReady(false);
					return;
				}
				const ready = await onboard.walletCheck();
				setIsReady(ready);
			} catch (e) {
				console.error(e);
				setIsReady(false);
			}
		}
	};

	const walletCheck = async () => {
		if (onboard) {
			const ready = await onboard.walletCheck();
			setIsReady(ready);
		}
	};
	const changeWallet = async () => {
		if (onboard) {
			onboard.walletReset();
			return connect();
		}
	};

	const disconnect = () => {
		setIsReady(false);
		window.localStorage.removeItem('selectedWallet');
		if (onboard) onboard.walletReset();
	};

	useEffect(() => {
		initOnboard();
	}, []);

	useEffect(() => {
		if (onboard) {
			const previouslySelectedWallet =
				window.localStorage.getItem('selectedWallet');
			if (previouslySelectedWallet) {
				onboard
					.walletSelect(previouslySelectedWallet)
					.then(selected => {
						selected && walletCheck();
					});
			}
		}
	}, [onboard]);
	return (
		<OnboardContext.Provider
			value={{
				network,
				address,
				changeWallet,
				isReady,
				connect,
				provider,
				walletCheck,
				lastBlockDate: date,
			}}
		>
			{children}
		</OnboardContext.Provider>
	);
};

export function useOnboard() {
	const context = useContext(OnboardContext);

	if (!context) {
		throw new Error('Onboard context not found!');
	}

	return context;
}
