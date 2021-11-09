import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

import { useOnboard, useContracts, useV3Liquidity } from '@/context';
import { LiquidityPosition } from '@/types/nfts';
import config from '@/configuration';
import { getUniswapV3StakerContract } from '@/lib/contracts';

export const useStakingNFT = () => {
	const { stakedPositions, currentIncentive } = useV3Liquidity();
	const { address: walletAddress, network, provider } = useOnboard();
	const [rewardBalance, setRewardBalance] = useState<BigNumber>(
		BigNumber.from(0),
	);

	const uniswapV3StakerContract = getUniswapV3StakerContract(provider);

	const checkForRewards = useCallback(() => {
		if (
			!walletAddress ||
			!uniswapV3StakerContract ||
			!currentIncentive.key ||
			network !== config.MAINNET_NETWORK_NUMBER
		)
			return;

		const load = async () => {
			try {
				const getReward = (p: LiquidityPosition) =>
					uniswapV3StakerContract.getRewardInfo(
						currentIncentive.key,
						p?.tokenId,
					);

				const rewards = await Promise.all(
					stakedPositions.map(getReward),
				);

				const allRewards = rewards.reduce(
					(acc: BigNumber, [reward]) => acc.add(reward),
					BigNumber.from(0),
				);
				setRewardBalance(allRewards);
			} catch {}
		};
		load();
	}, [
		walletAddress,
		uniswapV3StakerContract,
		network,
		currentIncentive.key,
		stakedPositions,
	]);

	useEffect(() => {
		if (
			!walletAddress ||
			!uniswapV3StakerContract ||
			!currentIncentive.key ||
			network !== config.MAINNET_NETWORK_NUMBER
		)
			return;

		const interval = setInterval(() => {
			if (stakedPositions.length > 0) {
				checkForRewards();
			}
		}, 10000);

		checkForRewards();
		return () => {
			clearInterval(interval);
		};
	}, [
		walletAddress,
		uniswapV3StakerContract,
		network,
		checkForRewards,
		currentIncentive.key,
		stakedPositions,
	]);

	useEffect(() => {
		// extra check
		if (
			!walletAddress ||
			!uniswapV3StakerContract ||
			!currentIncentive.key ||
			network !== config.MAINNET_NETWORK_NUMBER
		)
			return;

		const handleTransfer = (
			_1: any,
			address1: string,
			address2: string,
		) => {
			checkForRewards();
		};

		const subscribe = () => {
			const inTransfer =
				uniswapV3StakerContract.filters.DepositTransferred(
					null,
					walletAddress,
					null,
				);
			const outTransfer =
				uniswapV3StakerContract.filters.DepositTransferred(
					null,
					null,
					walletAddress,
				);
			uniswapV3StakerContract.on(inTransfer, handleTransfer);
			uniswapV3StakerContract.on(outTransfer, handleTransfer);
			// const rewardEvent = uniswapV3StakerContract.filters.RewardClaimed();

			return () => {
				uniswapV3StakerContract.off(inTransfer, handleTransfer);
				uniswapV3StakerContract.off(outTransfer, handleTransfer);
			};
		};
		return subscribe();
	}, [
		stakedPositions,
		uniswapV3StakerContract,
		walletAddress,
		currentIncentive.key,
		network,
		checkForRewards,
	]);

	return {
		rewardBalance,
	};
};
