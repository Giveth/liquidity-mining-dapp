import {
	createContext,
	FC,
	useContext,
	useEffect,
	useState,
	useCallback,
} from 'react';
import { OnboardContext } from '@/context/onboard.context';
import { ethers } from 'ethers';
import config from '@/configuration';

export interface FarmContext {
	totalEarned: ethers.BigNumber;
	setInfo: (network: number, key: string, value: ethers.BigNumber) => void;
}

export const FarmContext = createContext<FarmContext>({
	totalEarned: ethers.constants.Zero,
	setInfo: (network: number, key: string, value: ethers.BigNumber) => {
		console.log('Not implemented!');
	},
});

interface IInfos {
	[key: string]: ethers.BigNumber;
}

export const FarmProvider: FC = ({ children }) => {
	const [xDaiInfos, setxDaiInfos] = useState<IInfos>({});
	const [xDaiTotalEarned, setxDaiTotalEarned] = useState(
		ethers.constants.Zero,
	);
	const [mainnetInfos, setMainnetInfos] = useState<IInfos>({});
	const [mainnetTotalEarned, setMainnetTotalEarned] = useState(
		ethers.constants.Zero,
	);
	const { network, address } = useContext(OnboardContext);

	const setInfo = useCallback(
		(network: number, key: string, value: ethers.BigNumber) => {
			if (network === config.MAINNET_NETWORK_NUMBER) {
				setMainnetInfos(prevInfos => ({ ...prevInfos, [key]: value }));
			} else if (network === config.XDAI_NETWORK_NUMBER) {
				setxDaiInfos(prevInfos => ({ ...prevInfos, [key]: value }));
			}
		},
		[],
	);

	useEffect(() => {
		let sum = ethers.constants.Zero;
		for (const key in xDaiInfos) {
			if (Object.prototype.hasOwnProperty.call(xDaiInfos, key)) {
				const value = xDaiInfos[key];
				sum = sum.add(value);
			}
		}
		setxDaiTotalEarned(sum);
	}, [xDaiInfos]);

	useEffect(() => {
		let sum = ethers.constants.Zero;
		for (const key in mainnetInfos) {
			if (Object.prototype.hasOwnProperty.call(mainnetInfos, key)) {
				const value = mainnetInfos[key];
				sum = sum.add(value);
			}
		}
		setMainnetTotalEarned(sum);
	}, [mainnetInfos]);

	useEffect(() => {
		setxDaiInfos({});
		setxDaiTotalEarned(ethers.constants.Zero);
		setMainnetInfos({});
		setMainnetTotalEarned(ethers.constants.Zero);
	}, [address]);

	useEffect(() => {
		if (network === config.MAINNET_NETWORK_NUMBER) {
			setxDaiInfos({});
			setxDaiTotalEarned(ethers.constants.Zero);
		} else if (network === config.XDAI_NETWORK_NUMBER) {
			setMainnetInfos({});
			setMainnetTotalEarned(ethers.constants.Zero);
		}
	}, [network]);

	return (
		<FarmContext.Provider
			value={{
				totalEarned:
					network === config.MAINNET_NETWORK_NUMBER
						? mainnetTotalEarned
						: xDaiTotalEarned,
				setInfo,
			}}
		>
			{children}
		</FarmContext.Provider>
	);
};

export function useFarms() {
	const context = useContext(FarmContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
