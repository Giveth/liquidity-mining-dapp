import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import {
	fetchGivStakingInfo,
	fetchLPStakingInfo,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import config from '@/configuration';
import { useBalances, useOnboard } from '@/context';
import { PoolStakingConfig, StakingType } from '@/types/config';
import { StakePoolInfo, UserStakeInfo } from '@/types/poolInfo';
import { getUnipoolInfo } from '@/services/subgraph';
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';
import { Zero } from '@/helpers/number';

export const useStakingPool = (
	poolStakingConfig: PoolStakingConfig,
	network: number,
): {
	apr: BigNumber | null;
	earned: ethers.BigNumber;
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
} => {
	const { address, provider } = useOnboard();
	const { currentBalance } = useBalances();
	// const { mainnetBalance, xDaiBalance } = useBalances();

	const [apr, setApr] = useState<BigNumber | null>(null);
	const [userStakeInfo, setUserStakeInfo] = useState<UserStakeInfo>({
		earned: ethers.constants.Zero,
		notStakedAmount: ethers.constants.Zero,
		stakedAmount: ethers.constants.Zero,
	});

	const stakePoolInfoPoll = useRef<NodeJS.Timer | null>(null);
	const userStakeInfoPoll = useRef<NodeJS.Timer | null>(null);

	const { type, LM_ADDRESS } = poolStakingConfig;

	useEffect(() => {
		const cb = () => {
			if (provider && provider?.network?.chainId === network) {
				const promise: Promise<StakePoolInfo> =
					type === StakingType.GIV_LM
						? fetchGivStakingInfo(LM_ADDRESS, network)
						: fetchLPStakingInfo(
								poolStakingConfig,
								network,
								provider,
						  );
				promise.then(({ apr: _apr }) => {
					setApr(_apr);
				});
			} else {
				setApr(Zero);
			}
		};

		cb();

		stakePoolInfoPoll.current = setInterval(cb, 60000); // Every one minutes

		return () => {
			if (stakePoolInfoPoll.current) {
				clearInterval(stakePoolInfoPoll.current);
				stakePoolInfoPoll.current = null;
			}
		};
	}, [provider]);

	const isMounted = useRef(true);
	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const cb = async () => {
			try {
				const unipoolInfo = await getUnipoolInfo(network, LM_ADDRESS);
				let unipoolHelper;
				if (unipoolInfo) unipoolHelper = new UnipoolHelper(unipoolInfo);

				setUserStakeInfo(
					getUserStakeInfo(
						poolStakingConfig.type,
						currentBalance,
						unipoolHelper,
					),
				);
			} catch (error) {
				console.error('Error in fetching Staking data', error);
			}
		};

		cb();

		userStakeInfoPoll.current = setInterval(
			cb,
			config.SUBGRAPH_POLLING_INTERVAL,
		); // Every 15 seconds

		return () => {
			if (userStakeInfoPoll.current) {
				clearInterval(userStakeInfoPoll.current);
				userStakeInfoPoll.current = null;
			}
		};
	}, [address, poolStakingConfig, currentBalance]);

	return {
		apr,
		...userStakeInfo,
	};
};
