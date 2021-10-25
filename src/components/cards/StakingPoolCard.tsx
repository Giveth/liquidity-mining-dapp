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
	StakingPoolImages,
	StakingPoolLabel,
	StakingPoolSubtitle,
	Details,
	FirstDetail,
	Detail,
	DetailLabel,
	DetailValue,
	ClaimButton,
	StakeButton,
	Input,
	Return,
	StakingPoolExchange,
	StakePoolInfoContainer,
	DetailUnit,
	StakeButtonsRow,
	StakeContainer,
	StakeAmount,
	LiquidityButton,
} from './StakingPoolCard.sc';
import {
	IconGiveth,
	IconETH,
	IconHoney,
	IconCalculator,
	IconSpark,
	brandColors,
	IconHelp,
	IconExternalLink,
} from '@giveth/ui-design-system';

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

const getCurIconWithName = (currency: string) => {
	switch (currency) {
		case 'GIV':
			return <IconGiveth size={40} />;
		case 'ETH':
			return <IconETH size={40} />;
		case 'HNY':
			return <IconHoney size={40} />;
		default:
			break;
	}
};

const StakingPoolCard: FC<IStakingPoolCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { network: walletNetwork, provider } = useContext(OnboardContext);

	const [state, setState] = useState(SwapCardStates.Default);
	const [amount, setAmount] = useState<string>('0');
	const [displayAmount, setDisplayAmount] = useState('0');

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

	const currencies = title.split(' / ');

	return (
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
						<StakingPoolImages lenght={currencies.length}>
							{currencies.map((currency, idx) => (
								<div key={idx}>
									{getCurIconWithName(currency)}
								</div>
							))}
						</StakingPoolImages>
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
									<IconCalculator size={16} />
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
							label='CLAIM Rewards'
						/>
						<StakeButtonsRow>
							<StakeContainer flexDirection='column'>
								<StakeButton
									disabled={userNotStakedAmount.isZero()}
									label='STAKE'
									size='small'
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
			{state == SwapCardStates.Manage && (
				<>
					{/* <ClaimButton
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
					</ClaimButton> */}
				</>
			)}
			{state == SwapCardStates.Deposit && (
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
					{/* <ClaimButton secondary onClick={onDeposit}>
						Deposit
					</ClaimButton> */}
				</>
			)}
			{state == SwapCardStates.Withdraw && (
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
					{/* <ClaimButton onClick={onWithdraw}>Withdraw</ClaimButton> */}
				</>
			)}
			{state !== SwapCardStates.Default && (
				<Return
					src='/images/close.svg'
					onClick={() => setState(SwapCardStates.Default)}
				/>
			)}
		</StakingPoolContainer>
	);
};

export default StakingPoolCard;
