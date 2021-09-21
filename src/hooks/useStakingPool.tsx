import { PoolStakingConfig, StakingType } from '../types/config';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { StakePoolInfo, StakeUserInfo } from '../types/poolInfo';
import { Zero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import {
	fetchGivStakingInfo,
	fetchLPStakingInfo,
	fetchUserNotStakedToken,
	fetchUserStakeInfo,
} from '../lib/stakingPool';
import config from '../configuration';
import { TokenBalanceContext } from '../context/tokenBalance.context';
import { OnboardContext } from '../context/onboard.context';

export const useStakingPool = (
	poolStakingConfig: PoolStakingConfig,
	network: number,
): {
	apr: BigNumber | null;
	userStakeInfo: StakeUserInfo;
	userNotStakedAmount: ethers.BigNumber;
} => {
	const { xDaiTokenBalance, mainnetTokenBalance } =
		useContext(TokenBalanceContext);
	const { address } = useContext(OnboardContext);

	const [apr, setApr] = useState<BigNumber | null>(null);
	const [userStakeInfo, setUserStakeInfo] = useState<StakeUserInfo>({
		earned: Zero,
		stakedLpAmount: Zero,
	});
	const [userNotStakedAmount, setNotStakedAmount] =
		useState<ethers.BigNumber>(Zero);

	const stakePoolInfoPoll = useRef<NodeJS.Timer | null>(null);
	const userStakeInfoPoll = useRef<NodeJS.Timer | null>(null);

	const { type, LM_ADDRESS } = poolStakingConfig;

	useEffect(() => {
		const cb = () => {
			const promise: Promise<StakePoolInfo> =
				type === StakingType.GIV_STREAM
					? fetchGivStakingInfo(LM_ADDRESS, network)
					: fetchLPStakingInfo(poolStakingConfig, network);

			promise.then(({ apr: _apr }) => setApr(_apr));
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
		const cb = () => {
			let lpBalancePromise: Promise<ethers.BigNumber>;

			if (type === StakingType.GIV_STREAM) {
				const value =
					network === config.MAINNET_NETWORK_NUMBER
						? mainnetTokenBalance
						: xDaiTokenBalance;
				lpBalancePromise = Promise.resolve(value);
			} else {
				lpBalancePromise = fetchUserNotStakedToken(
					address,
					poolStakingConfig,
					network,
				);
			}
			Promise.all([
				fetchUserStakeInfo(address, poolStakingConfig, network),
				lpBalancePromise,
			]).then(([_userStakeInfo, _lpBalance]) => {
				if (isMounted.current) {
					setUserStakeInfo(_userStakeInfo);
					setNotStakedAmount(_lpBalance);
				}
			});
		};

		cb();

		userStakeInfoPoll.current = setInterval(cb, config.POLLING_INTERVAL); // Every 15 seconds

		return () => {
			if (userStakeInfoPoll.current) {
				clearInterval(userStakeInfoPoll.current);
				userStakeInfoPoll.current = null;
			}
		};
	}, [
		address,
		network,
		poolStakingConfig,
		mainnetTokenBalance,
		xDaiTokenBalance,
		type,
	]);

	return {
		apr,
		userStakeInfo,
		userNotStakedAmount,
	};
};
