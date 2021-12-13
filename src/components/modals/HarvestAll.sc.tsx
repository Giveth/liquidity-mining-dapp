import {
	brandColors,
	neutralColors,
	P,
	H6,
	IconGIVGarden,
	Lead,
	Button,
	GLink,
	OulineButton,
	H5,
	Caption,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Title } from '../Header.sc';
import { IconGIV } from '../Icons/GIV';
import { Row } from '../styled-components/Grid';

export const GIVBoxWithPriceContainer = styled(Row)`
	background-color: ${brandColors.giv[500]}66;
	margin: 16px 0;
	border-radius: 8px;
	padding: 24px;
	gap: 8px;
`;

export const GIVBoxWithPriceIcon = styled(IconGIV)``;

export const GIVBoxWithPriceAmount = styled(Title)`
	margin-left: 8px;
	color: ${neutralColors.gray[100]};
`;

export const GIVBoxWithPriceUSD = styled(P)`
	color: ${brandColors.deep[200]};
	user-select: none;
	opacity: 0;
`;

export const HarvestAllModalContainer = styled.div`
	width: 686px;
	padding: 24px;
`;

export const HarvestAllModalTitleRow = styled(Row)`
	gap: 14px;
	margin-bottom: 32px;
`;

export const HarvestAllModalTitle = styled(H6)`
	color: ${neutralColors.gray[100]};
`;

export const TitleIcon = styled(IconGIVGarden)``;

export const StyledGivethIcon = styled.div`
	margin-top: 48px;
	margin-bottom: 23px;
`;

export const GIVAmount = styled(Title)`
	color: ${neutralColors.gray[100]};
`;

export const USDAmount = styled(P)`
	margin-bottom: 22px;
	color: ${brandColors.deep[200]};
`;

export const HelpRow = styled(Row)`
	gap: 8px;
	margin-bottom: 4px;
`;

export const RateRow = styled(Row)`
	gap: 4px;
	margin-bottom: 36px;
`;

export const GIVRate = styled(Lead)`
	color: ${neutralColors.gray[100]};
`;

export const HarvestButton = styled(Button)`
	display: block;
	width: 316px;
	margin: 0 auto 16px;
`;

export const CancelButton = styled(Button)`
	width: 316px;
	margin: 0 auto 8px;
`;

export const WitingModalContainer = styled.div`
	width: 546px;
	padding: 24px;
`;

export const WaitinMessage = styled(H6)`
	color: ${neutralColors.gray[100]};
	padding: 24px;
	margin-top: 18px;
	margin-bottom: 40px;
`;

export const ConfirmedModalContainer = styled.div`
	width: 522px;
	padding: 24px 86px;
`;

export const ConfirmedMessage = styled(H6)`
	color: ${neutralColors.gray[100]};
	margin-top: 16px;
`;

export const ConfirmedData = styled(Row)`
	margin-top: 32px;
`;

export const CDFirst = styled(P)`
	color: ${neutralColors.gray[100]};
	text-align: left;
	flex: 1;
`;

export const CDSecond = styled(P)`
	color: ${neutralColors.gray[100]};
	flex: 1;
`;

export const CDInfo = styled(Row)`
	div:first-child {
		color: ${neutralColors.gray[100]};
	}
	div:last-child {
		color: ${brandColors.giv[300]};
	}
`;

export const CDLink = styled(GLink)`
	text-align: left;
	display: block;
	color: ${brandColors.cyan[500]};
`;

export const DoneButton = styled(OulineButton)`
	padding: 16px 135px;
	margin-top: 32px;
`;

export const SPTitle = styled(Row)`
	margin-top: 12px;
	margin-bottom: 24px;
	color: ${neutralColors.gray[100]};
	margin-left: -24px;
`;

export const StakingPoolLabel = styled(H5)``;

export const StakingPoolSubtitle = styled(Caption)``;

export const StakePoolInfoContainer = styled.div`
	padding: 0 24px;
`;

export const HarvestAllDesc = styled(P)`
	text-align: justify;
	color: ${neutralColors.gray[100]};
	margin-bottom: 32px;
`;

export const Pending = styled(Row)`
	margin: 0 auto 16px;
	width: 316px;
	line-height: 46px;
	height: 46px;
	border: 2px solid ${neutralColors.gray[100]};
	border-radius: 48px;
	color: ${neutralColors.gray[100]};
	gap: 8px;
	justify-content: center;
	align-items: center;
	& > div {
		margin: 0 !important;
	}
`;
