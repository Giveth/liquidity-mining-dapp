import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { Button } from '../styled-components/Button';
import { FC } from 'react';

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
const Details = styled.div`
	margin: 12px 0;
`;
const DetailLabel = styled.div`
	font-family: red-hat;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 150%;
	color: #82899a;
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

enum StakingPoolExchangeType {
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

interface IStakingPoolProps {
	wrongNetwork?: boolean;
}

interface StakingPoolCardProps {
	composition: string;
	name: string;
	logo: string;
	option: string;
	platform: string;
	network: number;
	provideLiquidityLink: string;
}
const StakingPoolCard: FC<IStakingPoolProps> = ({ wrongNetwork }) => {
	return (
		<StakingPoolContainer>
			<StakingPoolExchange>HONEYSWAP</StakingPoolExchange>
			<StakingPoolBadge
				src={
					wrongNetwork
						? '/images/chain/mainnet-badge-s.svg'
						: '/images/chain/xdai-badge-s.svg'
				}
			/>
			<SPTitle alignItems='center'>
				<StakingPoolImage src='/images/pool/giv-eth-logos.svg' />
				<StakingPoolLabel>{`${'HNY'} / ${'GIV'}`}</StakingPoolLabel>
			</SPTitle>
			<StakingPoolSubtitle>50% GIV, 50%ETH</StakingPoolSubtitle>
			<Details>
				<DetailLabel>APR</DetailLabel>
				<DetailValue>145%</DetailValue>
				<DetailLabel>Claimable</DetailLabel>
				<DetailValue>{`${0} GIV`}</DetailValue>
				<DetailLabel>Streaming</DetailLabel>
				<DetailValue>{`${0} GIV`}</DetailValue>
			</Details>
			<CardButton secondary outline>
				PROVIDE LIQUIDITY
			</CardButton>
			<CardButton outline>STAKE LP TOKENS</CardButton>
			{wrongNetwork && <CardDisable />}
		</StakingPoolContainer>
	);
};

export default StakingPoolCard;
