import styled from 'styled-components';
import { D3, H1, H2, H3, P, Button } from '@giveth/ui-design-system';
import { TabContainer } from './commons';

export const OverviewBottomContainer = styled(TabContainer)`
	position: relative;
	::after {
		content: url('/images/homebg2.png');
		position: absolute;
		top: 0;
		right: 0;
	}
`;

export const OverviewTopContainer = styled.div`
	background-image: url('/images/Giv.png');
	background-size: cover;
`;

export const OverviewTitle = styled(D3)`
	font-size: 107px;
	padding-bottom: 42px;
	max-width: 989px;
`;

export const PreTitle = styled(D3)`
	color: #a3b0f6;
	// font-size: 88px;
	// padding-top: 66px;
	// padding-bottom: 42px;
	// max-width: 798px;
`;

export const SubTitle = styled(P)`
	max-width: 828px;
	padding-bottom: 156px;
`;

export const IntroSection = styled.section`
	padding-top: 80px;
`;

export const GivCard = styled.div`
	padding-right: 180px;
	flex: 1;
`;

export const ParticipateCard = styled.div`
	flex: 1;
	padding-right: 76px;
`;

export const ParticipateButton = styled(Button)`
	width: 280px;
`;

export const ParticipateDesc = styled(P)`
	height: 198px;
	width: 322px;
`;

export const ParticipateSubDesc = styled.p`
	font-size: 15px;
	font-style: normal;
	font-weight: 400;
	line-height: 22px;
	letter-spacing: 0em;
	text-align: left;
	color: #c4b2ff;
	width: 280px;
`;

export const ClaimCardButton = styled(Button)`
	width: 300px;
	margin-top: 36px;
	margin-bottom: 36px;
`;

export const TabTitle = styled(H1)`
	margin-bottom: 40px;
`;

export const TabDesc = styled(P)`
	margin-bottom: 132px;
	width: 812px;
`;

export const GivCardSub = styled(P)`
	margin-bottom: 32px;
`;

export const ParticipateSection = styled.div`
	background-image: url('/images/homebg3.png');
	background-size: cover;
	background-repeat: no-repeat;
	padding-top: 280px;
	padding-bottom: 180px;
`;

export const Section2Title = styled(H2)`
	margin-bottom: 60px;
`;

export const ParticipateCardTitle = styled(H3)`
	margin-bottom: 32px;
`;

export const Section3 = styled.div`
	padding-top: 180px;
	min-height: 100vh;
`;

export const ClaimCard = styled.div`
	background-color: #3c14c5;
	padding: 105px 146px;
	background-image: url('/images/GIVGIVGIV.png');
	background-repeat: no-repeat;
	background-size: cover;
	min-height: 480px;
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
export const ClaimCardTitle = styled(H2)`
	margin-bottom: 22px;
`;
