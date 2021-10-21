import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { Button } from '../styled-components/Button';
import config from '../../configuration';
import { OnboardContext } from '../../context/onboard.context';
import { PoolStakingConfig, StakingType } from '../../types/config';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { H4, P } from '../styled-components/Typography';
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
	StakingPoolExchange,
	StakingPoolBadge,
	SPTitle,
	StakingPoolImage,
	StakingPoolLabel,
	StakingPoolSubtitle,
	Details,
	DetailHeader,
	DetailLabel,
	DetailLink,
	DetailValue,
	CardButton,
	Input,
	Return,
	CardDisable,
} from './StakingPoolCard.sc';

enum SwapCardStates {
	Default,
	Manage,
	Deposit,
	Withdraw,
}
interface IStakingPoolCardProps {
	// composition: string;
	// logo: string;
	// option: string;
	// platform: string;
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
		<StakingPoolContainer>
			{state == SwapCardStates.Default && (
				<>
					<StakingPoolExchange>{type}</StakingPoolExchange>
					<StakingPoolBadge
						src={
							network === config.MAINNET_NETWORK_NUMBER
								? '/images/chain/mainnet-badge-s.svg'
								: '/images/chain/xdai-badge-s.svg'
						}
					/>
					<SPTitle alignItems='center'>
						<StakingPoolImage src='/images/pool/giv-eth-logos.svg' />
						<StakingPoolLabel>{title}</StakingPoolLabel>
					</SPTitle>
					<StakingPoolSubtitle>{description}</StakingPoolSubtitle>
					<Details>
						<DetailHeader justifyContent='space-between'>
							<DetailLabel>APR</DetailLabel>
							<DetailLink>See details</DetailLink>
						</DetailHeader>
						<DetailValue>
							{apr && formatEthHelper(apr, 2)}%
						</DetailValue>
						<DetailHeader justifyContent='space-between'>
							<DetailLabel>Claimable</DetailLabel>
							<DetailLink
								onClick={() => {
									setState(SwapCardStates.Manage);
								}}
							>
								Manage
							</DetailLink>
						</DetailHeader>
						<DetailValue>{`${formatWeiHelper(
							userStakeInfo.earned,
							config.TOKEN_PRECISION,
						)} GIV`}</DetailValue>
						<DetailHeader>
							<DetailLabel>Streaming</DetailLabel>
							<DetailLink>?</DetailLink>
						</DetailHeader>
						<DetailValue>{`${0} GIV`}</DetailValue>
					</Details>
					{type !== StakingType.GIV_STREAM && (
						<CardButton
							secondary
							outline
							onClick={() => window.open(provideLiquidityLink)}
						>
							PROVIDE LIQUIDITY
						</CardButton>
					)}
					<CardButton
						outline
						onClick={() => setState(SwapCardStates.Deposit)}
					>
						STAKE LP TOKENS
					</CardButton>
					{!userStakeInfo.earned.eq(Zero) && (
						<CardButton outline onClick={onHarvest}>
							Harvest
						</CardButton>
					)}
				</>
			)}
			{state == SwapCardStates.Manage && (
				<>
					<CardButton
						secondary
						outline
						onClick={() => setState(SwapCardStates.Deposit)}
					>
						Depsite
					</CardButton>
					<CardButton
						outline
						onClick={() => setState(SwapCardStates.Withdraw)}
					>
						Withdraw
					</CardButton>
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
					<CardButton secondary onClick={onDeposit}>
						Deposit
					</CardButton>
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
					<CardButton onClick={onWithdraw}>Withdraw</CardButton>
				</>
			)}
			{state !== SwapCardStates.Default && (
				<Return
					src='/images/close.svg'
					onClick={() => setState(SwapCardStates.Default)}
				/>
			)}
			{walletNetwork !== network && <CardDisable />}
		</StakingPoolContainer>
	);
};

export default StakingPoolCard;
