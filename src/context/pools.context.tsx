import {
	createContext,
	FC,
	useContext,
	useEffect,
	useState,
	useRef,
} from 'react';
import { OnboardContext } from '@/context/onboard.context';
import config from '@/configuration';
import { ethers } from 'ethers';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { fetchUserStakeInfo } from '@/lib/stakingPool';

export interface PoolsContext {
	stakeInfos: any[];
}

export const PoolsContext = createContext<PoolsContext>({ stakeInfos: [] });

export const PoolsProvider: FC = ({ children }) => {
	const { address, network } = useContext(OnboardContext);
	const userStakeInfoPoll = useRef<NodeJS.Timer | null>(null);

	useEffect(() => {
		const pools =
			network === config.MAINNET_NETWORK_NUMBER
				? config.MAINNET_CONFIG.pools
				: config.XDAI_CONFIG.pools;
		const tempPools = [
			...pools,
			network === config.MAINNET_NETWORK_NUMBER
				? getGivStakingConfig(config.MAINNET_CONFIG)
				: getGivStakingConfig(config.XDAI_CONFIG),
		];

		const cb = () => {
			try {
				const promises = tempPools.map(pool => {
					return fetchUserStakeInfo(address, pool, network);
				});
				Promise.all(promises).then(_userStakesInfo => {
					_userStakesInfo.forEach(_userStakeInfo => {
						console.log(
							`_userStakeInfo: `,
							_userStakeInfo.earned.toString(),
						);
					});
				});
			} catch (error) {
				console.error('Error in fetching Staking data', error);
			}
		};

		cb();

		userStakeInfoPoll.current = setInterval(cb, config.POLLING_INTERVAL); // Every 15 seconds

		return () => {
			if (userStakeInfoPoll.current) {
				clearInterval(userStakeInfoPoll.current);
				userStakeInfoPoll.current = null;
			}
		};
	}, [address, network]);

	return (
		<PoolsContext.Provider value={{ stakeInfos: [] }}>
			{children}
		</PoolsContext.Provider>
	);
};

export function usePools() {
	const context = useContext(PoolsContext);

	if (!context) {
		throw new Error('Pools context not found!');
	}

	return context;
}
