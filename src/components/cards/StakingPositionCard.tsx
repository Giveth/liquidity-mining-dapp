import React, { FC, useState, useEffect } from 'react';
import { BigNumber, utils } from 'ethers';

import { Zero } from '@/helpers/number';
import BaseStakingCard from './BaseStakingCard';
import { PoolStakingConfig } from '@/types/config';
import { useLiquidityPositions, useOnboard } from '@/context';
import { claimUnstakeStake } from '@/lib/stakingNFT';
import { useStakingNFT } from '@/hooks/useStakingNFT';
import { YellowDot } from './PositionCard';
import {
	OutOfRangeBadgeContianer,
	OutOfRangeTooltip,
} from './BaseStakingCard.sc';
import { SublineBold } from '@giveth/ui-design-system';
import { IconWithTooltip } from '../IconWithToolTip';

const OutOfRangeBadge = () => (
	<OutOfRangeBadgeContianer alignItems='center'>
		<YellowDot />
		<SublineBold>Out of Range</SublineBold>
	</OutOfRangeBadgeContianer>
);
interface IStakingPositionCardProps {
	network: number;
	poolStakingConfig: PoolStakingConfig;
}

const StakingPositionCard: FC<IStakingPositionCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { address: walletAddress, provider } = useOnboard();
	const { rewardBalance } = useStakingNFT();
	const { currentIncentive, unstakedPositions, stakedPositions } =
		useLiquidityPositions();
	const [oneOfPositionsOutOfRange, setOneOfPositionsOutOfRange] =
		useState(false);

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

	useEffect(() => {
		const _oneOfPositionsOutOfRange = stakedPositions.some(
			stakedPosition => {
				const { pool, tickLower, tickUpper } =
					stakedPosition._position || {};
				// Check price range
				const below =
					pool && typeof tickLower === 'number'
						? pool.tickCurrent < tickLower
						: undefined;
				const above =
					pool && typeof tickUpper === 'number'
						? pool.tickCurrent >= tickUpper
						: undefined;
				return below || above;
			},
		);
		setOneOfPositionsOutOfRange(_oneOfPositionsOutOfRange);
	}, [stakedPositions]);

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			onHarvest={handleHarvest}
			poolStakingConfig={poolStakingConfig}
			notif={
				oneOfPositionsOutOfRange && (
					<IconWithTooltip
						icon={<OutOfRangeBadge />}
						direction={'top'}
					>
						<OutOfRangeTooltip>
							One or more of your position(s) are out of range and
							not earning rewards. Please unstake and make a new
							position.
						</OutOfRangeTooltip>
					</IconWithTooltip>
				)
			}
		/>
	);
};

export default StakingPositionCard;
