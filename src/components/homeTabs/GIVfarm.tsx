import styled from 'styled-components';
import { Container, Row } from '../styled-components/Grid';
import { TabContainer } from './commons';

const GIVfarmTabContainer = styled(TabContainer)``;

const TabGIVfarm = () => {
	return (
		<GIVfarmTabContainer>
			<Container>
				<Row>
					<SwapCard />
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
	margin-top: 32px;
	margin-bottom: 32px;
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
const DetailLable = styled.div`
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

enum SwapCardExchangeType {
	GIVETH,
	UNISWAP,
	HONETSWAP,
}

const SwapCard = () => {
	return (
		<SwapCardContainer>
			<SwapCardExchange>HONEYSWAP</SwapCardExchange>
			<SwapCardBadge src='/images/chain/xdai-badge-s.png' />
			<SwapCardTitle alignItems='center'>
				<SCTImage src='/images/badge.png' />
				<SCTLable>{`${'HNY'} / ${'GIV'}`}</SCTLable>
			</SwapCardTitle>
			<SwapCardSubtitle>50% GIV, 50%ETH</SwapCardSubtitle>
			<Details>
				<DetailLable>APR</DetailLable>
				<DetailValue>145%</DetailValue>
				<DetailLable>Claimable</DetailLable>
				<DetailValue>{`${0} GIV`}</DetailValue>
				<DetailLable>Streaming</DetailLable>
				<DetailValue>{`${0} GIV`}</DetailValue>
			</Details>
		</SwapCardContainer>
	);
};

export default TabGIVfarm;
