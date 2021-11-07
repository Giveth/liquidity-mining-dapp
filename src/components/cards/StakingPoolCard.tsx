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
	const { provider } = useContext(OnboardContext);

	const { LM_ADDRESS } = poolStakingConfig;

	const isV3Staking = type === StakingType.UNISWAP;

	const { apr, rewardRatePerToken, userNotStakedAmount, userStakeInfo } =
		useStakingPool(poolStakingConfig, network);

	const stakeInfo = {
		apr: apr,
		rewardRatePerToken: rewardRatePerToken,
		userNotStakedAmount: userNotStakedAmount,
		earned: userStakeInfo.earned,
		stakedLpAmount: userStakeInfo.stakedLpAmount,
	};

	const onHarvest = () => harvestTokens(LM_ADDRESS, provider);

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			onHarvest={onHarvest}
			poolStakingConfig={poolStakingConfig}
		/>
	);
};

export default StakingPoolCard;
