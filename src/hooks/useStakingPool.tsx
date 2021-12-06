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
import { Zero } from '@ethersproject/constants';

export const useStakingPool = (
	poolStakingConfig: PoolStakingConfig,
	network: number,
): {
	apr: BigNumber | null;
	earned: ethers.BigNumber;
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
	rewardRatePerToken: BigNumber | null;
} => {
	const { address } = useOnboard();
	const { mainnetBalance, xDaiBalance } = useBalances();

	const [apr, setApr] = useState<BigNumber | null>(null);
	const [rewardRatePerToken, setRewardRatePerToken] =
		useState<BigNumber | null>(null);
	const [unipoolHelper, setUnipoolHelper] = useState<UnipoolHelper>();
	const [userStakeInfo, setUserStakeInfo] = useState<UserStakeInfo>({
		earned: Zero,
		notStakedAmount: Zero,
		stakedAmount: Zero,
	});

	const [balance, setBalance] = useState(
		network === config.MAINNET_NETWORK_NUMBER
			? mainnetBalance
			: xDaiBalance,
	);

	const stakePoolInfoPoll = useRef<NodeJS.Timer | null>(null);
	const userStakeInfoPoll = useRef<NodeJS.Timer | null>(null);

	const { type, LM_ADDRESS } = poolStakingConfig;

	useEffect(() => {
		const cb = () => {
			const promise: Promise<StakePoolInfo> =
				type === StakingType.GIV_LM
					? fetchGivStakingInfo(LM_ADDRESS, network)
					: fetchLPStakingInfo(poolStakingConfig, network);

			promise.then(
				({ apr: _apr, rewardRatePerToken: _rewardRatePerToken }) => {
					setApr(_apr);
					setRewardRatePerToken(_rewardRatePerToken);
				},
			);
		};

		cb();

		stakePoolInfoPoll.current = setInterval(cb, 60000); // Every 15 seconds

		return () => {
			if (stakePoolInfoPoll.current) {
				clearInterval(stakePoolInfoPoll.current);
				stakePoolInfoPoll.current = null;
			}
		};
	}, [type, LM_ADDRESS, network]);

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
				if (unipoolInfo)
					setUnipoolHelper(new UnipoolHelper(unipoolInfo));

				setUserStakeInfo(
					getUserStakeInfo(
						poolStakingConfig.type,
						balance,
						unipoolHelper,
					),
				);
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
	}, [address, poolStakingConfig, balance]);

	return {
		apr,
		...userStakeInfo,
		rewardRatePerToken,
	};
};
