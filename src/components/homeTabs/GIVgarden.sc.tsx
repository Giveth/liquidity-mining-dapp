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
	width: 426px;
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
