import config from '../../configuration';
import { PoolStakingConfig, StakingType } from '../../types/config';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Row } from '../styled-components/Grid';
import { formatEthHelper, formatWeiHelper, Zero } from '../../helpers/number';
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
} from './BaseStakingCard.sc';
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

interface IBaseStakingCardProps {
	poolStakingConfig: PoolStakingConfig;
	onHarvest: () => Promise<void>;
	stakeInfo: any;
}

const BaseStakingCard: FC<IBaseStakingCardProps> = ({
	stakeInfo,
	onHarvest,
	poolStakingConfig,
}) => {
	const [showAPRModal, setShowAPRModal] = useState(false);
	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showUnStakeModal, setShowUnStakeModal] = useState(false);

	const { type, title, description, provideLiquidityLink, LM_ADDRESS } =
		poolStakingConfig;

	const isV3Staking = type === StakingType.UNISWAP;

	const {
		apr,
		earned,
		stakedLpAmount,
		rewardRatePerToken,
		userNotStakedAmount,
	} = stakeInfo;

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
									earned,
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
						disabled={earned.isZero()}
						onClick={onHarvest}
						label='CLAIM Rewards'
					/>
					<StakeButtonsRow>
						<StakeContainer flexDirection='column'>
							<StakeButton
								label='STAKE'
								size='small'
								disabled={userNotStakedAmount.isZero()}
								onClick={() => setShowStakeModal(true)}
							/>
							<StakeAmount>
								{isV3Staking
									? `${userNotStakedAmount.toNumber()} NFT`
									: `${formatWeiHelper(
											userNotStakedAmount,
											config.TOKEN_PRECISION,
									  )} LP`}
							</StakeAmount>
						</StakeContainer>
						<StakeContainer flexDirection='column'>
							<StakeButton
								label='UNSTAKE'
								size='small'
								disabled={stakedLpAmount.isZero()}
								onClick={() => setShowUnStakeModal(true)}
							/>
							<StakeAmount>
								{isV3Staking
									? `${stakedLpAmount.toNumber()} NFT`
									: `${formatWeiHelper(
											stakedLpAmount,
											config.TOKEN_PRECISION,
									  )} LP`}
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
						maxAmount={stakedLpAmount}
					/>
				))}
		</>
	);
};

export default BaseStakingCard;
