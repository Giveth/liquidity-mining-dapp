import styled from 'styled-components';

import {
	Container,
	D1,
	H1,
	H2,
	H4,
	H5,
	P,
	Button,
	QuoteText,
	DataBlock,
	brandColors,
	GLink,
	neutralColors,
	Title,
	Subline,
	Caption,
} from '@giveth/ui-design-system';
import { TopContainer } from './commons';
import { RewardCard } from '../RewardCard';
import { Row } from '../styled-components/Grid';
import { DataBox } from '../DataBox';

export const GIVstreamTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;

export const GIVstreamTopInnerContainer = styled(Container)`
	overflow: hidden;
	position: relative;
	&::after {
		content: url('/images/stream.svg');
		position: absolute;
		right: 180px;
		top: calc(50% - 240px);
		z-index: 0;
	}
`;

export const Left = styled.div`
	width: 708px;
	z-index: 2;
`;

export const Right = styled.div`
	width: 360px;
`;

export const GSTitle = styled(D1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const GSSubtitle = styled(QuoteText)``;

export const GIVstreamRewardCard = styled(RewardCard)`
	position: absolute;
	z-index: 1;
	bottom: -37px;
`;

export const GIVbacksBottomContainer = styled.div``;

export const GsDataBlock = styled(DataBlock)`
	width: 459px;
`;

export const GsButton = styled(Button)`
	padding: 24px 34px;
`;

export const FlowRateRow = styled(Row)`
	margin-top: 48px;
	color: ${neutralColors.gray[100]};
`;

export const FlowRateTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 260px;
`;

export const FlowRateUnit = styled(H4)`
	color: ${brandColors.giv[200]};
`;

export const GIVstreamProgressContainer = styled.div`
	background: ${brandColors.giv[700]};
	border-radius: 8px;
	padding: 28px 33px;
	margin: 40px 0 64px;
`;

export const GsPTitleRow = styled(Row)``;

export const GsPTitle = styled(Row)``;

export const GsPTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 240px;
`;
interface IBarProps {
	percentage: number;
}
export const Bar = styled.div<IBarProps>`
	height: 12px;
	width: 100%;

	background: ${brandColors.giv[800]};
	border-radius: 12px;

	position: relative;
	overflow: hidden;

	margin: 24px 0 8px;

	::after {
		content: ' ';
		width: ${props => props.percentage}%;
		left: 0;
		top: 0;
		height: 12px;
		border-radius: 12px;
		background: ${brandColors.cyan[500]};
		position: absolute;
		transition: width 0.3s ease;
	}
`;

export const PercentageRow = styled(Row)`
	margin-bottom: 5px;
`;

export const IncreaseSection = styled.div`
	padding: 60px 0 32px;
	background-image: url('/images/backgrounds/GIVGIVGIV.png');
`;

export const IncreaseSectionTitle = styled(H2)`
	color: ${brandColors.giv[200]};
	margin-bottom: 40px;
`;

export const IGsDataBox = styled(DataBox)`
	height: 387px;
	margin-bottom: 16px;
`;

export const HistoryTitleRow = styled(Row)`
	margin: 110px 0 40px;
	align-items: center;
	gap: 16px;
`;

export const HistoryTitle = styled(H2)`
	color: ${brandColors.giv[200]};
`;

export const HistoryTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 265px;
`;

export const HistoryContainer = styled.div`
	margin-bottom: 64px;
`;

export const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 2fr 2fr 1fr;
	border-bottom: 2px solid ${brandColors.giv[500]};
	& > span {
		padding: 8px 4px;
		// border-left: 1px solid black;
		// border-bottom: 1px solid black;
		text-overflow: ellipsis;
		overflow: hidden;
	}
`;

export const GsHFrUnit = styled(P)`
	color: ${brandColors.giv[200]};
`;

export const TxHash = styled(GLink)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
`;

interface IPaginationItem {
	disable: boolean;
	isActive?: boolean;
}

export const PaginationRow = styled(Row)`
	margin-top: 16px;
`;

export const PaginationItem = styled(Caption)`
	${props =>
		props.disable
			? `color: ${neutralColors.gray[700]}`
			: `cursor: pointer; color: ${neutralColors.gray[100]}`};
	${props => (props.isActive ? `font-weight: bold;` : '')};
`;
