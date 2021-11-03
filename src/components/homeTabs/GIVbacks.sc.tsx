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

export const GIVbacksTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;

export const Left = styled.div`
	width: 708px;
`;

export const Right = styled.div`
	width: 360px;
`;

export const GBTitle = styled(D1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const GBSubtitle = styled(QuoteText)`
	margin-bottom: 89px;
`;

export const GIVbackRewardCard = styled(RewardCard)`
	position: absolute;
	z-index: 1;
	bottom: -37px;
`;

export const GIVbacksBottomContainer = styled.div``;

export const GbDataBlock = styled(DataBlock)`
	width: 459px;
`;

export const GbButton = styled(Button)`
	padding: 24px 31px;
`;

export const GIVBackCard = styled.div`
	margin: 132px 0 41px;
	background-color: #3c14c5;
	padding: 50px;
	background-image: url('/images/backgrounds/giv-outline.svg');
	border-radius: 8px;
	min-height: 480px;
	position: relative;
`;

export const RoundSection = styled.div``;

export const RoundTitle = styled(H2)``;

export const RoundInfo = styled.div`
	margin: 38px auto 32px 0;
`;

export const RoundInfoRow = styled(Row)`
	margin: 14px 0;
`;

export const RoundInfoTallRow = styled(Row)`
	margin: 32px 0;
`;

export const RoundButton = styled(Button)`
	padding: 16px 55px;
`;
