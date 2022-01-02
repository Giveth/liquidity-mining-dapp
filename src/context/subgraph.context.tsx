import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { isAddress } from 'ethers/lib/utils';
import { fetchSubgraph } from '@/services/subgraph.service';
import { OnboardContext } from '@/context/onboard.context';
import config from '@/configuration';
import { IBalances, ITokenDistroInfo, ZeroBalances } from '@/types/subgraph';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';

export interface ISubgraphValue {
	balances: IBalances;
	tokenDistroInfo: ITokenDistroInfo | undefined;
}

export interface ISubgraphContext {
	currentValues: ISubgraphValue;
	mainnetValues: ISubgraphValue;
	xDaiValues: ISubgraphValue;
}
const defaultSubgraphValue: ISubgraphValue = {
	balances: ZeroBalances,
	tokenDistroInfo: undefined,
};

export const SubgraphContext = createContext<ISubgraphContext>({
	currentValues: defaultSubgraphValue,
	mainnetValues: defaultSubgraphValue,
	xDaiValues: defaultSubgraphValue,
});

export const SubgraphProvider: FC = ({ children }) => {
	const { address, network } = useContext(OnboardContext);

	const [currentSubgraphValue, setCurrentSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);

	const [mainnetSubgraphValue, setMainnetSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);
	const [xDaiSubgraphValue, setXDaiSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);

	const fetchMainnetInfo = useCallback(async useAddress => {
		try {
			const response = await fetchSubgraph(
				SubgraphQueryBuilder.getMainnetQuery(useAddress),
				config.MAINNET_NETWORK_NUMBER,
			);
			setMainnetSubgraphValue(await transformSubgraphData(response));
		} catch (e) {
			console.error('Error on query mainnet subgraph:', e);
		}
	}, []);

	const fetchXDaiInfo = useCallback(async useAddress => {
		try {
			const response = await fetchSubgraph(
				SubgraphQueryBuilder.getXDaiQuery(useAddress),
				config.XDAI_NETWORK_NUMBER,
			);
			setXDaiSubgraphValue(await transformSubgraphData(response));
		} catch (e) {
			console.error('Error on query xDai subgraph:', e);
		}
	}, []);

	useEffect(() => {
		if (network === config.XDAI_NETWORK_NUMBER) {
			setCurrentSubgraphValue(xDaiSubgraphValue);
		} else {
			setCurrentSubgraphValue(mainnetSubgraphValue);
		}
	}, [mainnetSubgraphValue, xDaiSubgraphValue, network]);

	useEffect(() => {
		if (isAddress(address)) {
			fetchMainnetInfo(address);
			fetchXDaiInfo(address);

			const interval = setInterval(() => {
				fetchMainnetInfo(address);
				fetchXDaiInfo(address);
			}, config.SUBGRAPH_POLLING_INTERVAL);
			return () => {
				clearInterval(interval);
			};
		}
	}, [address, fetchMainnetInfo, fetchXDaiInfo]);

	return (
		<SubgraphContext.Provider
			value={{
				currentValues: currentSubgraphValue,
				mainnetValues: mainnetSubgraphValue,
				xDaiValues: xDaiSubgraphValue,
			}}
		>
			{children}
		</SubgraphContext.Provider>
	);
};

export function useSubgraph() {
	const context = useContext(SubgraphContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
