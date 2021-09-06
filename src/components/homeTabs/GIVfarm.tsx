import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Container, Row } from '../styled-components/Grid';
import { H4, P } from '../styled-components/Typography';
import { TabContainer } from './commons';

const GIVfarmTabContainer = styled(TabContainer)``;

const TabGIVfarm = () => {
	return (
		<GIVfarmTabContainer>
			<Container>
				<Row>
					<SwapCard max={100} />
					<SwapCard wrongNetwork={true} max={0} />
				</Row>
			</Container>
		</GIVfarmTabContainer>
	);
};

const SwapCardContainer = styled.div`
	width: 380px;
	padding: 16px 24px 24px;
	border-radius: 10px;
	background: #ffffffe5;
	color: #303b72;
	position: relative;
	margin: 32px 16px;
	overflow: hidden;
`;
const SwapCardExchange = styled.div`
	font-family: red-hat;
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: 18px;
	letter-spacing: 0.08em;
`;
const SwapCardBadge = styled.img`
	position: absolute;
	top: 12px;
	right: 0px;
`;
const SwapCardTitle = styled(Row)`
	margin-top: 12px;
	margin-bottom: 12px;
`;
const SCTImage = styled.img``;
const SCTLable = styled.span`
	font-family: red-hat;
	font-size: 32px;
	font-style: normal;
	font-weight: bold;
	line-height: 38px;
	letter-spacing: 0em;
	margin-left: 24px;
`;
const SwapCardSubtitle = styled.div`
	font-family: red-hat;
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 150%;
	color: #82899a;
`;
const Details = styled.div`
	margin: 12px 0;
`;
const DetailHeader = styled(Row)`
	font-family: red-hat;
`;
const DetailLable = styled.div`
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 150%;
	color: #82899a;
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

interface ISwapCardProps {
	wrongNetwork?: boolean;
	max: number;
}

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

const SwapCard: FC<ISwapCardProps> = ({ wrongNetwork }) => {
	const [state, setState] = useState(SwapCardStates.Default);
	const [amount, setAmount] = useState<string>('0');

	const onChange = useCallback(value => {
		setAmount(value.toString());
	}, []);

	return (
		<SwapCardContainer>
			{state == SwapCardStates.Default && (
				<>
					<SwapCardExchange>HONEYSWAP</SwapCardExchange>
					<SwapCardBadge src='/images/chain/xdai-badge-s.png' />
					<SwapCardTitle alignItems='center'>
						<SCTImage src='/images/badge.png' />
						<SCTLable>{`${'HNY'} / ${'GIV'}`}</SCTLable>
					</SwapCardTitle>
					<SwapCardSubtitle>50% GIV, 50%ETH</SwapCardSubtitle>
					<Details>
						<DetailHeader justifyContent='space-between'>
							<DetailLable>APR</DetailLable>
							<DetailLink>See details</DetailLink>
						</DetailHeader>
						<DetailValue>145%</DetailValue>
						<DetailHeader justifyContent='space-between'>
							<DetailLable>Claimable</DetailLable>
							<DetailLink
								onClick={() => {
									setState(SwapCardStates.Manage);
								}}
							>
								Manage
							</DetailLink>
						</DetailHeader>
						<DetailValue>{`${0} GIV`}</DetailValue>
						<DetailHeader>
							<DetailLable>Streaming</DetailLable>
							<DetailLink>?</DetailLink>
						</DetailHeader>
						<DetailValue>{`${0} GIV`}</DetailValue>
					</Details>
					<CardButton secondary outline>
						PROVIDE LIQUIDITY
					</CardButton>
					<CardButton outline>STAKE LP TOKENS</CardButton>
				</>
			)}
			{state == SwapCardStates.Manage && (
				<>
					<CardButton
						secondary
						outline
						onClick={() => {
							setState(SwapCardStates.Deposit);
						}}
					>
						Depsite
					</CardButton>
					<CardButton
						outline
						onClick={() => {
							setState(SwapCardStates.Withdraw);
						}}
					>
						Withdraw
					</CardButton>
				</>
			)}
			{state == SwapCardStates.Deposit && (
				<>
					<H4>Deposit LP tokens</H4>
					<P>
						You currently have <b>{0}</b> staked LP tokens. Deposit
						more to accrue more rewards.
					</P>
					<P>BALANCE: {0} LP Tokens</P>
					<Input
						onChange={e => onChange(+e.target.value || '0')}
						type='number'
						value={amount}
					/>
					<CardButton secondary>Deposit</CardButton>
				</>
			)}
			{state == SwapCardStates.Withdraw && (
				<>
					<H4>Withdraw LP tokens</H4>
					<P>
						You currently have <b>{0}</b> staked LP tokens. Enter
						the amount you’d like to withdraw.
					</P>
					<P>BALANCE: {0} LP Tokens</P>
					<Input
						onChange={e => onChange(+e.target.value || '0')}
						type='number'
						value={amount}
					/>
					<CardButton>Withdraw</CardButton>
				</>
			)}
			{wrongNetwork && <CardDisable />}
			{state !== SwapCardStates.Default && (
				<Return
					src='/images/close.svg'
					onClick={() => setState(SwapCardStates.Default)}
				/>
			)}
		</SwapCardContainer>
	);
};

export default TabGIVfarm;
