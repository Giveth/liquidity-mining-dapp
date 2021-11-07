import React, { FC, useEffect } from 'react';
import { BigNumber } from 'ethers';

import { Zero } from '@/helpers/number';
import BaseStakingCard from './BaseStakingCard';
import { PoolStakingConfig } from '@/types/config';
import { useV3Liquidity } from '@/context';
import { useV3Staking } from '@/hooks/useStakingNFT';

interface IStakingPositionCardProps {
	network: number;
	poolStakingConfig: PoolStakingConfig;
}

const StakingPositionCard: FC<IStakingPositionCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { claim } = useV3Staking(undefined);
	const { stakedPositions, unstakedPositions } = useV3Liquidity();

	const stakeInfo = {
		apr: Zero,
		rewardRatePerToken: Zero,
		userNotStakedAmount: BigNumber.from(unstakedPositions.length),
		earned: Zero,
		stakedLpAmount: BigNumber.from(stakedPositions.length),
	};

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			onHarvest={claim}
			poolStakingConfig={poolStakingConfig}
		/>
	);
};

export default StakingPositionCard;
