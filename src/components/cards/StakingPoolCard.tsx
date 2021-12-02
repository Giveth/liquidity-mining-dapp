import React, { FC, useContext } from 'react';

import { OnboardContext } from '@/context/onboard.context';
import BaseStakingCard from './BaseStakingCard';
import { PoolStakingConfig } from '@/types/config';
import { useStakingPool } from '@/hooks/useStakingPool';
import { harvestTokens } from '@/lib/stakingPool';
interface IStakingPoolCardProps {
	network: number;
	poolStakingConfig: PoolStakingConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { apr, rewardRatePerToken, userNotStakedAmount, userStakeInfo } =
		useStakingPool(poolStakingConfig, network);

	const stakeInfo = {
		apr: apr,
		rewardRatePerToken: rewardRatePerToken,
		userNotStakedAmount: userNotStakedAmount,
		earned: userStakeInfo.earned,
		stakedLpAmount: userStakeInfo.stakedLpAmount,
	};

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			poolStakingConfig={poolStakingConfig}
		/>
	);
};

export default StakingPoolCard;
