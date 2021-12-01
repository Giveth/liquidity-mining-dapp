import config from '../../configuration';
import { PoolStakingConfig, StakingType } from '../../types/config';
import React, { FC, useContext, useEffect, useState, ReactNode } from 'react';
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
import { IconEthereum } from '../Icons/Eth';
import { IconGIV } from '../Icons/GIV';
import { IconHoneyswap } from '../Icons/Honeyswap';
import { IconBalancer } from '../Icons/Balancer';
import { IconUniswap } from '../Icons/Uniswap';
import { HarvestAllModal } from '../modals/HarvestAll';
import { OnboardContext } from '@/context/onboard.context';
import { ITokenInfo, calcTokenInfo } from '@/lib/helpers';
import { getTokenDistroInfo } from '@/services/subgraph';

export const getPoolIconWithName = (pool: string) => {
	switch (pool) {
		case StakingType.BALANCER:
			return <IconBalancer size={16} />;
		case StakingType.GIV_STREAM:
			return <IconGIV size={16} />;
		case StakingType.HONEYSWAP:
			return <IconHoneyswap size={16} />;
		case StakingType.UNISWAP:
			return <IconUniswap size={16} />;
		default:
			break;
	}
};
interface IBaseStakingCardProps {
	poolStakingConfig: PoolStakingConfig;
	onHarvest: () => Promise<void>;
	stakeInfo: any;
	notif?: ReactNode;
}

const BaseStakingCard: FC<IBaseStakingCardProps> = ({
	stakeInfo,
	onHarvest,
	poolStakingConfig,
	notif,
}) => {
	const [tokenInfo, setTokenInfo] = useState<ITokenInfo>();
	const [showAPRModal, setShowAPRModal] = useState(false);
	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showUnStakeModal, setShowUnStakeModal] = useState(false);
	const [showHarvestModal, setShowHarvestModal] = useState(false);
	const { network: walletNetwork } = useContext(OnboardContext);

	const { type, title, description, provideLiquidityLink, LM_ADDRESS, unit } =
		poolStakingConfig;

	const isV3Staking = type === StakingType.UNISWAP;

	const {
		apr,
		earned,
		stakedLpAmount,
		rewardRatePerToken,
		userNotStakedAmount,
	} = stakeInfo;

	useEffect(() => {
		getTokenDistroInfo(walletNetwork).then(distroInfo => {
			if (distroInfo) {
				const {
					initialAmount,
					totalTokens,
					startTime,
					cliffTime,
					duration,
				} = distroInfo;
				const _tokenInfo = calcTokenInfo(
					initialAmount,
					totalTokens,
					earned,
					duration,
					cliffTime,
					startTime,
				);
				setTokenInfo(_tokenInfo);
			}
		});
	}, [earned, walletNetwork]);

	return (
		<>
			<StakingPoolContainer>
				<StakingPoolExchangeRow gap='4px' alignItems='center'>
					{getPoolIconWithName(type)}
					<StakingPoolExchange styleType='Small'>
						{type}
					</StakingPoolExchange>
					<div style={{ flex: 1 }}></div>
					{notif && notif}
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
									{tokenInfo &&
										formatWeiHelper(
											tokenInfo.flowratePerWeek,
											config.TOKEN_PRECISION,
										)}
								</DetailValue>
								<DetailUnit>GIV/week</DetailUnit>
							</Row>
						</Detail>
					</Details>
					<ClaimButton
						disabled={earned.isZero()}
						onClick={() => setShowHarvestModal(true)}
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
									? `${userNotStakedAmount.toNumber()} ${unit}`
									: `${formatWeiHelper(
											userNotStakedAmount,
											config.TOKEN_PRECISION,
									  )} ${unit}`}
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
									? `${stakedLpAmount.toNumber()} ${unit}`
									: `${formatWeiHelper(
											stakedLpAmount,
											config.TOKEN_PRECISION,
									  )} ${unit}`}
							</StakeAmount>
						</StakeContainer>
					</StakeButtonsRow>
					<LiquidityButton
						label={
							title === 'GIV'
								? 'BUY GIV TOKENS'
								: 'PROVIDE LIQUIDITY'
						}
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
			{showHarvestModal && (
				<HarvestAllModal
					showModal={showHarvestModal}
					setShowModal={setShowHarvestModal}
					poolStakingConfig={poolStakingConfig}
					claimable={earned}
					onHarvest={onHarvest}
					network={walletNetwork}
				/>
			)}
		</>
	);
};

export default BaseStakingCard;
