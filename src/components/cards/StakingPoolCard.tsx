import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { Button } from '../styled-components/Button';
import config from '../../configuration';
import { OnboardContext } from '../../context/onboard.context';
import { PoolStakingConfig, StakingType } from '../../types/config';
import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { H4, P } from '../styled-components/Typography';
import {
	fetchGivStakingInfo,
	fetchLPStakingInfo,
	fetchUserNotStakedToken,
	fetchUserStakeInfo,
	stakeTokens,
} from '../../lib/stakingPool';
import BigNumber from 'bignumber.js';
import { StakePoolInfo, StakeUserInfo } from '../../types/poolInfo';
import { formatEthHelper, formatWeiHelper } from '../../helpers/number';
import { Zero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import { TokenBalanceContext } from '../../context/tokenBalance.context';
import { useStakingPool } from '../../hooks/useStakingPool';

const StakingPoolContainer = styled.div`
	width: 380px;
	padding: 16px 24px 24px;
	border-radius: 10px;
	background: #ffffffe5;
	color: #303b72;
	position: relative;
	margin: 32px 16px;
	overflow: hidden;
`;
const StakingPoolExchange = styled.div`
	font-family: red-hat;
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: 18px;
	letter-spacing: 0.08em;
`;
const StakingPoolBadge = styled.img`
	position: absolute;
	top: 12px;
	right: 0px;
`;
const SPTitle = styled(Row)`
	margin-top: 12px;
	margin-bottom: 12px;
`;
const StakingPoolImage = styled.img``;
const StakingPoolLabel = styled.span`
	font-family: red-hat;
	font-size: 32px;
	font-style: normal;
	font-weight: bold;
	line-height: 38px;
	letter-spacing: 0em;
	margin-left: 24px;
`;
const StakingPoolSubtitle = styled.div`
	font-family: red-hat;
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 150%;
	color: #82899a;
`;
const DetailLabel = styled.div`
	font-family: red-hat;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 150%;
	color: #82899a;
`;

enum StakingPoolExchangeType {
	GIVETH,
	UNISWAP,
	HONETSWAP,
}

interface IStakingPoolCardProps {
	// composition: string;
	// logo: string;
	// option: string;
	// platform: string;
	network: number;
	poolStakingConfig: PoolStakingConfig;
}
const Details = styled.div`
	margin: 12px 0;
`;
const DetailHeader = styled(Row)`
	font-family: red-hat;
`;
const DetailLink = styled.button`
	font-style: normal;
	font-weight: bold;
	font-size: 12px;
	line-height: 15px;
	text-align: center;
	color: #303b72;
	border: 0;
	background-color: unset;
	cursor: pointer;
`;
const DetailValue = styled.div`
	font-family: red-hat;
	font-style: normal;
	font-weight: bold;
	font-size: 18px;
	line-height: 24px;
	letter-spacing: -0.005em;
	color: #303b72;
`;

enum SwapCardExchangeType {
	GIVETH,
	UNISWAP,
	HONETSWAP,
}

const CardButton = styled(Button)`
	height: 36px;
	font-size: 12px;
	width: 265px;
	margin: 8px auto;
`;

const CardDisable = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	background-color: #ffffffa0;
`;

export const Input = styled.input`
	height: 48px;
	padding-left: 10px;
	background: #f4f5f6;
	border-radius: 8px;
	height: 48px;
	color: #222a29;
	font-family: 'Inter';
	border: solid 0px transparent;
	font-size: 14px;
	line-height: 16px;
	margin-top: 16px;
	width: calc(100% - 12px);
	&:focus {
		outline: none;
		background: #eefcfb;
	}
	&[type='number'] {
		-moz-appearance: textfield;
	}
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

enum SwapCardStates {
	Default,
	Manage,
	Deposit,
	Withdraw,
}

export const Return = styled.img`
	background: transparent;
	width: 50px;
	height: 50px;
	position: absolute;
	cursor: pointer;
	top: 0;
	right: 0;
	padding: 16px;
`;

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
		console.log('value:', value);
		console.log('type of value:', typeof value);
		setDisplayAmount(formatEthHelper(value, 6, false));
		setAmount(ethers.utils.parseUnits('' + value).toString());
	}, []);

	useEffect(() => {
		setAmount('0');
	}, [state]);

	const onDeposit = () => {
		if (provider) {
			stakeTokens(amount, POOL_ADDRESS, LM_ADDRESS, provider);
		}
	};

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
					<CardButton>Withdraw</CardButton>
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
