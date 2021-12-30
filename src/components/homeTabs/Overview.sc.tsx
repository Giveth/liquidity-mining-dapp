import styled from 'styled-components';
import {
	D3,
	H1,
	H2,
	H3,
	P,
	Button,
	QuoteText,
	DataBlock,
	brandColors,
	ButtonLink,
} from '@giveth/ui-design-system';
import { TabContainer, TopContainer } from './commons';

export const OverviewBottomContainer = styled.div`
	background-image: url('/images/backgrounds/curves.svg');
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
`;

export const OverviewTopContainer = styled(TopContainer)`
	height: 650px;
`;

export const OverviewTitle = styled(D3)`
	font-size: 107px;
	padding-bottom: 36px;
	max-width: 989px;
`;

export const PreTitle = styled(D3)`
	padding-top: 77px;
	display: block;
	color: #a3b0f6;
`;

export const SubTitle = styled(QuoteText)`
	max-width: 907px;
`;

export const ClaimCardButton = styled(Button)`
	width: 300px;
	margin-top: 36px;
	margin-bottom: 36px;
`;

export const TabTitle = styled(H1)`
	margin-bottom: 40px;
`;

export const TabDesc = styled(QuoteText)`
	width: 812px;
	margin-bottom: 50px;
`;

export const Section2Title = styled(H1)`
	margin-top: 124px;
	margin-bottom: 60px;
	color: ${brandColors.giv[200]};
`;

export const ClaimCard = styled.div`
	background-color: #3c14c5;
	padding: 105px 146px;
	background-image: url('/images/backgrounds/giv-outline.svg');
	border-radius: 8px;
	min-height: 480px;
	margin: 80px 0 45px;
	position: relative;
	::before {
		content: url('/images/pie1.png');
		position: absolute;
		top: 0;
		right: 0;
	}
	::after {
		content: url('/images/pie2.png');
		position: absolute;
		bottom: -4px;
		left: 0;
	}
`;
export const ClaimCardTitle = styled(H1)`
	margin-bottom: 22px;
`;

export const EGDataBlock = styled(DataBlock)`
	width: 355px;
`;

export const ParticipateDataBlock = styled(DataBlock)`
	min-height: 345px;
	width: 286px;
	display: flex;
	flex-flow: column nowrap;
	align-items: flex-start;

	div:nth-child(2) {
		flex-grow: 1;
	}
`;

export const DataBlockButton = styled(ButtonLink)`
	margin-top: auto;
`;

export const ClaimCardQuote = styled(QuoteText)`
	color: ${brandColors.giv[200]};
`;
