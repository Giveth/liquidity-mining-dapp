import config from '../../configuration';
import { OnboardContext } from '../../context/onboard.context';
import { PoolStakingConfig } from '../../types/config';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { H4, P } from '../styled-components/Typography';
import { Row } from '../styled-components/Grid';
import {
	harvestTokens,
	stakeTokens,
	withdrawTokens,
} from '../../lib/stakingPool';
import { formatEthHelper, formatWeiHelper } from '../../helpers/number';
import { ethers } from 'ethers';
import { useStakingPool } from '../../hooks/useStakingPool';
import { Zero } from '@ethersproject/constants';
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

enum SwapCardStates {
	Default,
	Manage,
	Deposit,
	Withdraw,
}
interface IStakingPoolCardProps {
	network: number;
	poolStakingConfig: PoolStakingConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { network: walletNetwork, provider } = useContext(OnboardContext);

	const [state, setState] = useState(SwapCardStates.Default);
	const [amount, setAmount] = useState<string>('0');
	const [displayAmount, setDisplayAmount] = useState('0');
	const [showAPRModal, setShowAPRModal] = useState(false);
	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showUnStakeModal, setShowUnStakeModal] = useState(false);

	const {
		type,
		title,
		description,
		provideLiquidityLink,
		LM_ADDRESS,
		POOL_ADDRESS,
	} = poolStakingConfig;

	const { apr, userStakeInfo, userNotStakedAmount } = useStakingPool(
		poolStakingConfig,
		network,
	);

	const setAmountPercentage = useCallback(
		(percentage: number): void => {
			const newAmount = ethers.BigNumber.from(userNotStakedAmount)
				.mul(percentage)
				.div(100)
				.toString();
			setAmount(newAmount);
			setDisplayAmount(formatWeiHelper(newAmount, 6, false));
		},
		[userNotStakedAmount],
	);

	const onChange = useCallback(value => {
		setDisplayAmount(formatEthHelper(value, 6, false));
		setAmount(ethers.utils.parseUnits('' + value).toString());
	}, []);

	useEffect(() => setAmount('0'), [state]);

	const onDeposit = () =>
		stakeTokens(amount, POOL_ADDRESS, LM_ADDRESS, provider);

	const onWithdraw = () => withdrawTokens(amount, LM_ADDRESS, provider);

	const onHarvest = () => harvestTokens(LM_ADDRESS, provider);

	return (
		<>
			<StakingPoolContainer>
				{state == SwapCardStates.Default && (
					<>
						<StakingPoolExchangeRow>
							{/* {network === config.MAINNET_NETWORK_NUMBER ? 
							<
						:
						} */}
							<StakingPoolExchange styleType='Small'>
								{type}
							</StakingPoolExchange>
						</StakingPoolExchangeRow>
						{/* <StakingPoolBadge
						src={
							network === config.MAINNET_NETWORK_NUMBER
								? '/images/chain/mainnet-badge-s.svg'
								: '/images/chain/xdai-badge-s.svg'
						}
					/> */}
						<SPTitle alignItems='center' gap='16px'>
							<StakingPoolImages title={title} />
							<div>
								<StakingPoolLabel weight={900}>
									{title}
								</StakingPoolLabel>
								<StakingPoolSubtitle>
									{description}
								</StakingPoolSubtitle>
							</div>
						</SPTitle>
						<StakePoolInfoContainer>
							<Details>
								<FirstDetail justifyContent='space-between'>
									<Row gap='8px' alignItems='center'>
										<DetailLabel>APR</DetailLabel>
										<IconContainer
											onClick={() =>
												setShowAPRModal(true)
											}
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
										<DetailValue>{0}</DetailValue>
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
										disabled={userNotStakedAmount.isZero()}
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
										disabled={userStakeInfo.stakedLpAmount.isZero()}
										label='UNSTAKE'
										size='small'
										onClick={() =>
											setShowUnStakeModal(true)
										}
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
								onClick={() =>
									window.open(provideLiquidityLink)
								}
								buttonType='texty'
								icon={
									<IconExternalLink
										size={16}
										color={brandColors.deep[100]}
									/>
								}
							/>
						</StakePoolInfoContainer>
						{/* {type !== StakingType.GIV_STREAM && (
						<ClaimButton
							secondary
							outline
							onClick={() => window.open(provideLiquidityLink)}
						>
							PROVIDE LIQUIDITY
						</ClaimButton>
					)}
					<ClaimButton
						outline
						onClick={() => setState(SwapCardStates.Deposit)}
					>
						STAKE LP TOKENS
					</ClaimButton>
					{!userStakeInfo.earned.eq(Zero) && (
						<ClaimButton outline onClick={onHarvest}>
							Harvest
						</ClaimButton>
					)} */}
					</>
				)}
				{/* {state == SwapCardStates.Manage && (
				<>
					<ClaimButton
						secondary
						outline
						onClick={() => setState(SwapCardStates.Deposit)}
					>
						Depsite
					</ClaimButton>
					<ClaimButton
						outline
						onClick={() => setState(SwapCardStates.Withdraw)}
					>
						Withdraw
					</ClaimButton>
				</>
			)} */}
				{/* {state == SwapCardStates.Deposit && (
				<>
					<H4>Deposit LP tokens</H4>
					<P>
						You currently have{' '}
						<b>
							{formatWeiHelper(
								userStakeInfo.stakedLpAmount,
								config.TOKEN_PRECISION,
							)}
						</b>{' '}
						staked LP tokens. Deposit more to accrue more rewards.
					</P>
					<P>
						BALANCE:{' '}
						{formatWeiHelper(
							userNotStakedAmount,
							config.TOKEN_PRECISION,
						)}{' '}
						LP Tokens
					</P>
					<Input
						onChange={e => onChange(+e.target.value || '0')}
						type='number'
						value={displayAmount}
					/>
					<ClaimButton secondary onClick={onDeposit}>
						Deposit
					</ClaimButton>
				</>
			)} */}
				{/* {state == SwapCardStates.Withdraw && (
				<>
					<H4>Withdraw LP tokens</H4>
					<P>
						You currently have{' '}
						<b>
							{formatWeiHelper(
								userStakeInfo.stakedLpAmount,
								config.TOKEN_PRECISION,
							)}
						</b>{' '}
						staked LP tokens. Enter the amount you’d like to
						withdraw.
					</P>
					<P>BALANCE: {0} LP Tokens</P>
					<Input
						onChange={e => onChange(+e.target.value || '0')}
						type='number'
						value={displayAmount}
					/>
					<ClaimButton onClick={onWithdraw}>Withdraw</ClaimButton>
				</>
			)} */}
				{/* {state !== SwapCardStates.Default && (
				<Return
					src='/images/close.svg'
					onClick={() => setState(SwapCardStates.Default)}
				/>
			)} */}
			</StakingPoolContainer>
			<APRModal showModal={showAPRModal} setShowModal={setShowAPRModal} />
			{showStakeModal && (
				<StakeModal
					showModal={showStakeModal}
					setShowModal={setShowStakeModal}
					poolStakingConfig={poolStakingConfig}
					maxAmount={userNotStakedAmount}
				/>
			)}
			{showUnStakeModal && (
				<UnStakeModal
					showModal={showUnStakeModal}
					setShowModal={setShowUnStakeModal}
					poolStakingConfig={poolStakingConfig}
					maxAmount={userStakeInfo.stakedLpAmount}
				/>
			)}
		</>
	);
};

export default StakingPoolCard;
