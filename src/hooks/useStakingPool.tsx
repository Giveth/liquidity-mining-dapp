import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import {
	getGivStakingAPR,
	getLPStakingAPR,
	getUserStakeInfo,
} from '@/lib/stakingPool';
import { useSubgraph, useOnboard } from '@/context';
import { PoolStakingConfig, StakingType } from '@/types/config';
import { APR, UserStakeInfo } from '@/types/poolInfo';
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
	const { provider, network: walletNetwork } = useOnboard();
	const { currentValues } = useSubgraph();

	const { balances } = currentValues;

	const [apr, setApr] = useState<BigNumber | null>(null);
	const [userStakeInfo, setUserStakeInfo] = useState<UserStakeInfo>({
		earned: ethers.constants.Zero,
		notStakedAmount: ethers.constants.Zero,
		stakedAmount: ethers.constants.Zero,
	});

	const stakePoolInfoPoll = useRef<NodeJS.Timer | null>(null);

	const { type, LM_ADDRESS } = poolStakingConfig;

	const unipoolIsDefined = !!currentValues[type];

	useEffect(() => {
		const cb = () => {
			const providerNetwork = provider?.network?.chainId;
			if (
				provider &&
				walletNetwork === network &&
				// When switching to another network, the provider may still be connected to wrong one
				(providerNetwork === undefined || providerNetwork === network)
			) {
				const promise: Promise<APR> =
					type === StakingType.GIV_LM
						? getGivStakingAPR(
								LM_ADDRESS,
								network,
								currentValues[type],
						  )
						: getLPStakingAPR(
								poolStakingConfig,
								network,
								provider,
								currentValues[type],
						  );
				promise.then(setApr);
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
	}, [provider, walletNetwork, unipoolIsDefined]);

	const isMounted = useRef(true);
	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const unipoolInfo = currentValues[type];
		if (unipoolInfo) {
			const unipoolHelper = new UnipoolHelper(unipoolInfo);
			setUserStakeInfo(getUserStakeInfo(type, balances, unipoolHelper));
		}
	}, [type, currentValues, balances]);

	return {
		apr,
		...userStakeInfo,
	};
};
