import React, { FC } from 'react';
import { BigNumber, utils } from 'ethers';

import { Zero } from '@/helpers/number';
import BaseStakingCard from './BaseStakingCard';
import { PoolStakingConfig } from '@/types/config';
import { useOnboard, useV3Liquidity } from '@/context';
import { claimUnstakeStake } from '@/lib/stakingNFT';
import { useStakingNFT } from '@/hooks/useStakingNFT';
interface IStakingPositionCardProps {
	network: number;
	poolStakingConfig: PoolStakingConfig;
}

const StakingPositionCard: FC<IStakingPositionCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { rewardBalance } = useStakingNFT();
	const { address: walletAddress, provider } = useOnboard();
	const { currentIncentive, unstakedPositions, stakedPositions } =
		useV3Liquidity();

	const stakeInfo = {
		apr: Zero,
		rewardRatePerToken: Zero,
		userNotStakedAmount: BigNumber.from(unstakedPositions.length),
		earned: rewardBalance,
		stakedLpAmount: BigNumber.from(stakedPositions.length),
	};

	const handleHarvest = async () => {
		if (!provider) return;

		await claimUnstakeStake(
			walletAddress,
			provider,
			currentIncentive,
			stakedPositions,
		);
	};

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			onHarvest={handleHarvest}
			poolStakingConfig={poolStakingConfig}
		/>
	);
};

export default StakingPositionCard;
