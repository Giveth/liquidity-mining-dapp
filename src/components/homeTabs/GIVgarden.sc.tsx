import styled from 'styled-components';

import {
	D1,
	H1,
	H2,
	H3,
	P,
	Button,
	QuoteText,
	DataBlock,
	brandColors,
} from '@giveth/ui-design-system';
import { TopContainer } from './commons';
import { RewardCard } from '../RewardCard';
import { Row } from '../styled-components/Grid';

export const GardenTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
	&::after {
		content: url('/images/flower3.svg');
		position: absolute;
		right: 0px;
		bottom: -100px;
		z-index: 0;
	}
`;

export const Left = styled.div`
	width: 616px;
`;

export const Right = styled.div`
	width: 360px;
	position: relative;
	&::before {
		content: url('/images/flower1.svg');
		position: absolute;
		left: 0px;
		top: -20px;
		z-index: 0;
	}
	&::after {
		content: url('/images/flower2.svg');
		position: absolute;
		left: 230px;
		top: 0px;
		z-index: 0;
	}
`;

export const Title = styled(D1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const Subtitle = styled(QuoteText)`
	margin-bottom: 48px;
`;

export const GardenRewardCard = styled(RewardCard)`
	position: absolute;
	z-index: 1;
	bottom: -37px;
`;

export const GardenBottomContainer = styled.div``;

export const Section1Title = styled(H3)`
	margin-top: 80px;
	margin-bottom: 24px;
`;

export const Section1Subtitle = styled(QuoteText)`
	width: 802px;
`;

export const OpenGardenButton = styled(Button)`
	width: 251px;
	padding: 24px 55px;
`;

export const Section2Title = styled(H1)`
	color: ${brandColors.giv[200]};
	margin-top: 120px;
	margin-bottom: 40px;
`;

export const GovernanceDB = styled(DataBlock)`
	width: 343px;
`;

export const GovernanceBtn = styled(Button)`
	color: ${brandColors.cyan[500]};
	padding: 16px 0;
`;

export const GovernanceRaw = styled(Row)`
	margin-bottom: 120px;
`;

export const VoteCard = styled.div`
	background-color: #3c14c5;
	padding: 107px 103px 140px 231px;
	background-image: url('/images/flower4.svg'),
		url('/images/backgrounds/giv-outline.svg');
	background-repeat: no-repeat, repeat;
	background-position: bottom left, top;
	min-height: 480px;
	margin: 80px 0 45px;
	position: relative;
	::before {
		content: url('/images/bee1.svg');
		position: absolute;
		bottom: 30px;
		right: 20px;
	}
	::after {
		content: url('/images/bee2.svg');
		position: absolute;
		top: 30px;
		left: 40px;
	}
`;

export const VoteCardDesc = styled(QuoteText)`
	width: 754px;
	color: ${brandColors.giv[200]};
	margin-top: 24px;
	margin-bottom: 8px;
`;

export const VoteCardButton = styled(Button)`
	display: block;
	padding: 24px 73px;
	margin-left: auto;
`;
