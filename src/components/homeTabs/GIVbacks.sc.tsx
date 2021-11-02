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

export const Title = styled(D1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const Subtitle = styled(QuoteText)`
	margin-bottom: 89px;
`;

export const GIVbackRewardCard = styled(RewardCard)`
	position: absolute;
	z-index: 1;
	bottom: -37px;
`;

export const GbDataBlock = styled(DataBlock)`
	width: 459px;
`;

export const GbButton = styled(Button)`
	padding: 24px 31px;
`;

export const GIVbacksBottomContainer = styled.div``;
