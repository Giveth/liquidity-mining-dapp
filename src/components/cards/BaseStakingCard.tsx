import config from '../../configuration';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
	StakingType,
} from '@/types/config';
import React, { FC, useEffect, useState, ReactNode, useMemo } from 'react';
import { Row } from '../styled-components/Grid';
import { IconWithTooltip } from '../IconWithToolTip';
import { formatEthHelper, formatWeiHelper } from '@/helpers/number';
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
	IconHelpWraper,
	GIVgardenTooltip,
	IconGift,
	GiftTooltip,
} from './BaseStakingCard.sc';
import {
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
import { IconGIV } from '../Icons/GIV';
import { IconHoneyswap } from '../Icons/Honeyswap';
import { IconBalancer } from '../Icons/Balancer';
import { IconUniswap } from '../Icons/Uniswap';
import { HarvestAllModal } from '../modals/HarvestAll';
import { useFarms } from '@/context/farm.context';
import { constants } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';
import BigNumber from 'bignumber.js';
import { WhatisGIVstreamModal } from '../modals/WhatisGIVstream';
import { IconSushiswap } from '../Icons/Sushiswap';
import { useWeb3React } from '@web3-react/core';
import { UniV3APRModal } from '../modals/UNIv3APR';
import { useLiquidityPositions } from '@/context';

export const getPoolIconWithName = (pool: string) => {
	switch (pool) {
		case StakingType.BALANCER:
			return <IconBalancer size={16} />;
		case StakingType.GIV_LM:
			return <IconGIV size={16} />;
		case StakingType.HONEYSWAP:
			return <IconHoneyswap size={16} />;
		case StakingType.UNISWAP:
			return <IconUniswap size={16} />;
		case StakingType.SUSHISWAP:
			return <IconSushiswap size={16} />;
		default:
			break;
	}
};
interface IBaseStakingCardProps {
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig;
	stakeInfo: any;
	notif?: ReactNode;
}

const BaseStakingCard: FC<IBaseStakingCardProps> = ({
	stakeInfo,
	poolStakingConfig,
	notif,
}) => {
	const [showAPRModal, setShowAPRModal] = useState(false);
	const [showUniV3APRModal, setShowUniV3APRModal] = useState(false);
	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showUnStakeModal, setShowUnStakeModal] = useState(false);
	const [showHarvestModal, setShowHarvestModal] = useState(false);
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { getTokenDistroHelper } = useTokenDistro();
	const { setInfo } = useFarms();
	const { chainId } = useWeb3React();
	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;
	const tokenDistroHelper = useMemo(() => {
		return getTokenDistroHelper(regenStreamType);
	}, [getTokenDistroHelper, poolStakingConfig]);

	const { type, title, description, provideLiquidityLink, BUY_LINK, unit } =
		poolStakingConfig;

	const isV3Staking = type === StakingType.UNISWAP;

	const { apr, earned, stakedLpAmount, userNotStakedAmount } = stakeInfo;
	const { minimumApr } = useLiquidityPositions();

	const regenStreamConfig = useMemo(() => {
		if (!regenStreamType) return undefined;
		const networkConfig =
			chainId === config.XDAI_NETWORK_NUMBER
				? config.XDAI_CONFIG
				: config.MAINNET_CONFIG;
		return networkConfig.regenStreams.find(s => s.type === regenStreamType);
	}, [chainId, regenStreamType]);

	useEffect(() => {
		if (tokenDistroHelper) {
			setRewardLiquidPart(tokenDistroHelper.getLiquidPart(earned));
			setRewardStream(
				tokenDistroHelper.getStreamPartTokenPerWeek(earned),
			);
		}
	}, [earned, tokenDistroHelper]);

	useEffect(() => {
		if (chainId) {
			setInfo(chainId, type, earned);
		}
	}, [chainId, earned, type]);

	return (
		<>
			<StakingPoolContainer>
				<StakingPoolExchangeRow gap='4px' alignItems='center'>
					{getPoolIconWithName(type)}
					<StakingPoolExchange styleType='Small'>
						{type === StakingType.GIV_LM &&
							chainId === config.XDAI_NETWORK_NUMBER &&
							`GIVgarden `}
						{type}
					</StakingPoolExchange>
					{chainId === config.XDAI_NETWORK_NUMBER &&
						type === StakingType.GIV_LM && (
							<IconWithTooltip
								direction={'top'}
								icon={
									<IconHelp
										color={brandColors.deep[100]}
										size={12}
									/>
								}
							>
								<GIVgardenTooltip>
									While staking GIV in this pool you are also
									granted voting power (gGIV) in the
									GIVgarden.
								</GIVgardenTooltip>
							</IconWithTooltip>
						)}
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
							<DetailLabel>APR</DetailLabel>
							{/* <Row gap='8px' alignItems='center'>
								<IconContainer
									onClick={() => setShowAPRModal(true)}
								>
									<IconCalculator size={16} />
								</IconContainer>
							</Row> */}
							<Row gap='8px' alignItems='center'>
								<IconSpark
									size={24}
									color={brandColors.mustard[500]}
								/>
								{isV3Staking ? (
									<IconWithTooltip
										direction={'top'}
										icon={
											<IconGift
												src='/images/heart-ribbon.svg'
												alt='gift'
											/>
										}
									>
										<GiftTooltip>
											Provide a narrow range of liquidity
											to maximize your rate of reward. The
											average APR is{' '}
											{formatEthHelper(apr, 2)}%, and the
											minimum APR for full range liquidity
											is {formatEthHelper(minimumApr, 2)}
											%.
										</GiftTooltip>
									</IconWithTooltip>
								) : (
									<DetailValue>
										{apr && formatEthHelper(apr, 2)}%
									</DetailValue>
								)}
								<IconContainer
									onClick={() => setShowAPRModal(true)}
								>
									<IconHelp size={16} />
								</IconContainer>
							</Row>
						</FirstDetail>
						<Detail justifyContent='space-between'>
							<DetailLabel>Claimable</DetailLabel>
							<DetailValue>
								{`${formatWeiHelper(rewardLiquidPart)} GIV`}
							</DetailValue>
						</Detail>
						<Detail justifyContent='space-between'>
							<Row gap='8px' alignItems='center'>
								<DetailLabel>Streaming</DetailLabel>
								<IconHelpWraper
									onClick={() => {
										setShowWhatIsGIVstreamModal(true);
									}}
								>
									<IconHelp size={16} />
								</IconHelpWraper>
							</Row>
							<Row gap='4px' alignItems='center'>
								<DetailValue>
									{formatWeiHelper(rewardStream)}
								</DetailValue>
								<DetailUnit>GIV/week</DetailUnit>
							</Row>
						</Detail>
					</Details>
					<ClaimButton
						disabled={earned.isZero()}
						onClick={() => setShowHarvestModal(true)}
						label='HARVEST REWARDS'
						buttonType='primary'
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
									  )} ${unit}`}
							</StakeAmount>
						</StakeContainer>
					</StakeButtonsRow>
					<LiquidityButton
						label={
							type === StakingType.GIV_LM
								? 'BUY GIV TOKENS'
								: 'PROVIDE LIQUIDITY'
						}
						onClick={() => {
							if (isV3Staking) {
								setShowUniV3APRModal(true);
							} else {
								window.open(
									type === StakingType.GIV_LM
										? BUY_LINK
										: provideLiquidityLink,
								);
							}
						}}
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
			{showAPRModal && (
				<APRModal
					showModal={showAPRModal}
					setShowModal={setShowAPRModal}
					poolStakingConfig={poolStakingConfig}
					maxAmount={userNotStakedAmount}
				/>
			)}
			{showUniV3APRModal && (
				<UniV3APRModal
					showModal={showUniV3APRModal}
					setShowModal={setShowUniV3APRModal}
					poolStakingConfig={poolStakingConfig}
				/>
			)}
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
			{showHarvestModal && chainId && (
				<HarvestAllModal
					title='GIVfarm Rewards'
					showModal={showHarvestModal}
					setShowModal={setShowHarvestModal}
					poolStakingConfig={poolStakingConfig}
					claimable={earned}
					network={chainId}
					regenStreamConfig={regenStreamConfig}
				/>
			)}
			{showWhatIsGIVstreamModal && (
				<WhatisGIVstreamModal
					showModal={showWhatIsGIVstreamModal}
					setShowModal={setShowWhatIsGIVstreamModal}
				/>
			)}
		</>
	);
};

export default BaseStakingCard;
