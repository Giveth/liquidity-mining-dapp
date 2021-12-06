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
	totalLiquidity: ethers.BigNumber;
	setInfo: (network: number, key: string, value: ethers.BigNumber) => void;
}

export const FarmContext = createContext<FarmContext>({
	totalLiquidity: ethers.constants.Zero,
	setInfo: (network: number, key: string, value: ethers.BigNumber) => {
		console.log('Not implemented!');
	},
});

interface IInfos {
	[key: string]: ethers.BigNumber;
}

export const FarmProvider: FC = ({ children }) => {
	const [xDaiInfos, setxDaiInfos] = useState<IInfos>({});
	const [xDaiTotalLiquidity, setxDaiTotalLiquidity] = useState(
		ethers.constants.Zero,
	);
	const [mainnetInfos, setMainnetInfos] = useState<IInfos>({});
	const [mainnetTotalLiquidity, setMainnetTotalLiquidity] = useState(
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
				console.log(key, value.toString());
				sum = sum.add(value);
			}
		}
		setxDaiTotalLiquidity(sum);
	}, [xDaiInfos]);

	useEffect(() => {
		let sum = ethers.constants.Zero;
		for (const key in mainnetInfos) {
			if (Object.prototype.hasOwnProperty.call(mainnetInfos, key)) {
				const value = mainnetInfos[key];
				console.log(key, value.toString());
				sum = sum.add(value);
			}
		}
		setMainnetTotalLiquidity(sum);
	}, [mainnetInfos]);

	useEffect(() => {
		setxDaiInfos({});
		setxDaiTotalLiquidity(ethers.constants.Zero);
		setMainnetInfos({});
		setMainnetTotalLiquidity(ethers.constants.Zero);
	}, [address]);

	useEffect(() => {
		if (network === config.MAINNET_NETWORK_NUMBER) {
			setxDaiInfos({});
			setxDaiTotalLiquidity(ethers.constants.Zero);
		} else if (network === config.XDAI_NETWORK_NUMBER) {
			setMainnetInfos({});
			setMainnetTotalLiquidity(ethers.constants.Zero);
		}
	}, [network]);

	return (
		<FarmContext.Provider
			value={{
				totalLiquidity:
					network === config.MAINNET_NETWORK_NUMBER
						? mainnetTotalLiquidity
						: xDaiTotalLiquidity,
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
