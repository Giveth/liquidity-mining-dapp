import config from '../../configuration';
import { OnboardContext } from '../../context/onboard.context';
import { PoolStakingConfig, StakingType } from '../../types/config';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Row } from '../styled-components/Grid';
import { harvestTokens } from '../../lib/stakingPool';
import { formatEthHelper, formatWeiHelper } from '../../helpers/number';
import { useStakingPool } from '../../hooks/useStakingPool';
import {
	StakingPoolContainer,
	StakingPoolExchangeRow,
	SPTitle,
	StakingPoolLabel,
	StakingPoolSubtitle,
	Details,
	FirstDetail,
	Detail,
	DetailLabel,
	DetailValue,
	ClaimButton,
	StakeButton,
	StakingPoolExchange,
	StakePoolInfoContainer,
	DetailUnit,
	StakeButtonsRow,
	StakeContainer,
	StakeAmount,
	LiquidityButton,
	IconContainer,
} from './StakingPoolCard.sc';
import {
	IconCalculator,
	IconSpark,
	brandColors,
	IconHelp,
	IconExternalLink,
} from '@giveth/ui-design-system';
import { APRModal } from '../modals/APR';
import { StakeModal } from '../modals/Stake';
import { UnStakeModal } from '../modals/UnStake';
import { StakingPoolImages } from '../StakingPoolImages';
import { V3StakeModal } from '../modals/V3Stake';

interface IStakingPoolCardProps {
	network: number;
	poolStakingConfig: PoolStakingConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { provider } = useContext(OnboardContext);

	const [showAPRModal, setShowAPRModal] = useState(false);
	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showUnStakeModal, setShowUnStakeModal] = useState(false);

	const { type, title, description, provideLiquidityLink, LM_ADDRESS } =
		poolStakingConfig;

	const isV3Staking = type === StakingType.UNISWAP;

	const { apr, userStakeInfo, userNotStakedAmount, rewardRatePerToken } =
		useStakingPool(poolStakingConfig, network);

	const onHarvest = () => harvestTokens(LM_ADDRESS, provider);

	return (
		<>
			<StakingPoolContainer>
				<StakingPoolExchangeRow>
					<StakingPoolExchange styleType='Small'>
						{type}
					</StakingPoolExchange>
				</StakingPoolExchangeRow>
				<SPTitle alignItems='center' gap='16px'>
					<StakingPoolImages title={title} />
					<div>
						<StakingPoolLabel weight={900}>
							{title}
						</StakingPoolLabel>
						<StakingPoolSubtitle>{description}</StakingPoolSubtitle>
					</div>
				</SPTitle>
				<StakePoolInfoContainer>
					<Details>
						<FirstDetail justifyContent='space-between'>
							<Row gap='8px' alignItems='center'>
								<DetailLabel>APR</DetailLabel>
								<IconContainer
									onClick={() => setShowAPRModal(true)}
								>
									<IconCalculator size={16} />
								</IconContainer>
							</Row>
							<Row gap='8px' alignItems='center'>
								<IconSpark
									size={24}
									color={brandColors.mustard[500]}
								/>
								<DetailValue>
									{apr && formatEthHelper(apr, 2)}%
								</DetailValue>
							</Row>
						</FirstDetail>
						<Detail justifyContent='space-between'>
							<DetailLabel>Claimable</DetailLabel>
							<DetailValue>
								{`${formatWeiHelper(
									userStakeInfo.earned,
									config.TOKEN_PRECISION,
								)} GIV`}
							</DetailValue>
						</Detail>
						<Detail justifyContent='space-between'>
							<Row gap='8px' alignItems='center'>
								<DetailLabel>Streaming</DetailLabel>
								<IconHelp size={16} />
							</Row>
							<Row gap='4px' alignItems='center'>
								<DetailValue>
									{rewardRatePerToken
										? formatEthHelper(
												rewardRatePerToken?.times(
													'604800',
												),
												2,
										  )
										: 0}
								</DetailValue>
								<DetailUnit>GIV/week</DetailUnit>
							</Row>
						</Detail>
					</Details>
					<ClaimButton
						disabled={userStakeInfo.earned.isZero()}
						onClick={onHarvest}
						label='CLAIM Rewards'
					/>
					<StakeButtonsRow>
						<StakeContainer flexDirection='column'>
							<StakeButton
								label='STAKE'
								size='small'
								onClick={() => setShowStakeModal(true)}
							/>
							<StakeAmount>
								{formatWeiHelper(
									userNotStakedAmount,
									config.TOKEN_PRECISION,
								)}{' '}
								LP
							</StakeAmount>
						</StakeContainer>
						<StakeContainer flexDirection='column'>
							<StakeButton
								label='UNSTAKE'
								size='small'
								onClick={() => setShowUnStakeModal(true)}
							/>
							<StakeAmount>
								{formatWeiHelper(
									userStakeInfo.stakedLpAmount,
									config.TOKEN_PRECISION,
								)}{' '}
								LP
							</StakeAmount>
						</StakeContainer>
					</StakeButtonsRow>
					<LiquidityButton
						label='Provide Liquidity'
						onClick={() => window.open(provideLiquidityLink)}
						buttonType='texty'
						icon={
							<IconExternalLink
								size={16}
								color={brandColors.deep[100]}
							/>
						}
					/>
				</StakePoolInfoContainer>
			</StakingPoolContainer>
			<APRModal showModal={showAPRModal} setShowModal={setShowAPRModal} />
			{showStakeModal &&
				(isV3Staking ? (
					<V3StakeModal
						showModal={showStakeModal}
						setShowModal={setShowStakeModal}
						poolStakingConfig={poolStakingConfig}
					/>
				) : (
					<StakeModal
						showModal={showStakeModal}
						setShowModal={setShowStakeModal}
						poolStakingConfig={poolStakingConfig}
						maxAmount={userNotStakedAmount}
					/>
				))}
			{showUnStakeModal &&
				(isV3Staking ? (
					<V3StakeModal
						isUnstakingModal={true}
						showModal={showUnStakeModal}
						setShowModal={setShowUnStakeModal}
						poolStakingConfig={poolStakingConfig}
					/>
				) : (
					<UnStakeModal
						showModal={showUnStakeModal}
						setShowModal={setShowUnStakeModal}
						poolStakingConfig={poolStakingConfig}
						maxAmount={userStakeInfo.stakedLpAmount}
					/>
				))}
		</>
	);
};

export default StakingPoolCard;
