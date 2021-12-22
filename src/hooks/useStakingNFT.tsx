import { useCallback, useEffect, useState, useMemo } from 'react';

import { useLiquidityPositions, useOnboard } from '@/context';
import { LiquidityPosition } from '@/types/nfts';
import { UniswapV3PoolStakingConfig } from '@/types/config';
import { BigNumber } from '@ethersproject/bignumber';
import config from '@/configuration';
import { getUniswapV3StakerContract } from '@/lib/contracts';

export const useStakingNFT = () => {
	const { address: walletAddress, network, provider } = useOnboard();
	const { stakedPositions } = useLiquidityPositions();

	const [rewardBalance, setRewardBalance] = useState<BigNumber>(
		BigNumber.from(0),
	);

	const mainnetConfig = config.MAINNET_CONFIG;
	const uniswapConfig = mainnetConfig.pools[0] as UniswapV3PoolStakingConfig;
	const rewardToken = uniswapConfig.REWARD_TOKEN;
	const poolAddress = uniswapConfig.UNISWAP_V3_LP_POOL;
	const incentiveRefundeeAddress = uniswapConfig.INCENTIVE_REFUNDEE_ADDRESS;

	const currentIncentive = useMemo(() => {
		if (
			!rewardToken ||
			!poolAddress ||
			!incentiveRefundeeAddress ||
			!(network === config.MAINNET_NETWORK_NUMBER)
		)
			return { key: null };

		const { INCENTIVE_START_TIME, INCENTIVE_END_TIME } = uniswapConfig;

		return {
			key: [
				rewardToken,
				poolAddress,
				INCENTIVE_START_TIME,
				INCENTIVE_END_TIME,
				incentiveRefundeeAddress,
			],
		};
	}, [
		rewardToken,
		poolAddress,
		incentiveRefundeeAddress,
		network,
		uniswapConfig,
	]);

	const checkForRewards = useCallback(() => {
		const uniswapV3StakerContract = getUniswapV3StakerContract(provider);

		if (
			!walletAddress ||
			!uniswapV3StakerContract ||
			!currentIncentive.key ||
			network !== config.MAINNET_NETWORK_NUMBER
		)
			return;

		const load = async () => {
			const allRewards = stakedPositions.reduce(
				(acc: BigNumber, curr: LiquidityPosition) =>
					acc.add(curr.reward),
				BigNumber.from(0),
			);
			setRewardBalance(allRewards);
		};
		load();
	}, [
		walletAddress,
		network,
		currentIncentive.key,
		stakedPositions,
		provider,
	]);

	useEffect(() => {
		if (
			!walletAddress ||
			!currentIncentive.key ||
			network !== config.MAINNET_NETWORK_NUMBER
		)
			return;

		const interval = setInterval(() => {
			if (stakedPositions.length > 0) {
				checkForRewards();
			}
		}, 15000);

		checkForRewards();
		return () => {
			clearInterval(interval);
		};
	}, [
		walletAddress,
		network,
		checkForRewards,
		currentIncentive.key,
		stakedPositions,
	]);

	return {
		rewardBalance,
	};
};
