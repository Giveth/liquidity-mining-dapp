import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import {
	brandColors,
	neutralColors,
	Overline,
	H4,
	B,
	P,
	Caption,
	Button,
	OulineButton,
} from '@giveth/ui-design-system';

export const StakingPoolContainer = styled.div`
	width: 383px;
	border-radius: 8px;
	background: ${brandColors.giv[600]};
	color: ${neutralColors.gray[100]};
	position: relative;
	overflow: hidden;
`;
export const StakingPoolExchangeRow = styled(Row)`
	margin: 16px;
`;

export const StakingPoolExchange = styled(Overline)`
	color: ${brandColors.deep[100]};
`;

export const StakingPoolBadge = styled.img`
	position: absolute;
	top: 12px;
	right: 0px;
`;
export const SPTitle = styled(Row)`
	margin-top: 12px;
	margin-bottom: 24px;
`;

interface IStakingPoolImagesProps {
	lenght: number;
}

export const StakingPoolImages = styled.div<IStakingPoolImagesProps>`
	padding-left: 27px;
	padding-right: 31px;
	height: 56px;
	width: ${props => (props.lenght == 1 ? 72 : 105)}px;
	background: ${brandColors.giv[700]};
	position: relative;
	border-radius: 0 28px 28px 0;
	& > div {
		position: absolute;
		right: 38px;
		top: 8px;
		z-index: 1;
		:last-child {
			z-index: 0;
			right: 7px;
		}
	}
`;

export const StakingPoolLabel = styled(H4)``;

export const StakingPoolSubtitle = styled(Caption)``;

export const StakePoolInfoContainer = styled.div`
	padding: 0 24px;
`;

export const Details = styled.div`
	margin: 12px 0;
`;
export const FirstDetail = styled(Row)`
	margin-bottom: 28px;
`;

export const Detail = styled(Row)`
	margin-bottom: 16px;
`;

export const DetailLabel = styled(Caption)``;
export const DetailValue = styled(B)``;
export const DetailUnit = styled(P)`
	color: ${brandColors.deep[100]};
`;

export const ClaimButton = styled(Button)`
	width: 100%;
`;

export const StakeButtonsRow = styled(Row)`
	margin: 16px 0;
	gap: 16px;
`;

export const StakeButton = styled(OulineButton)`
	width: 100%;
`;

export const StakeContainer = styled(Row)`
	gap: 6px;
	width: 100%;
`;
export const StakeAmount = styled(Caption)`
	text-align: center;
`;

export const LiquidityButton = styled(Button)`
	width: 100%;
	margin-bottom: 16px;
`;

export const CardDisable = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	background-color: #ffffffa0;
`;

export const Input = styled.input`
	height: 48px;
	padding-left: 10px;
	background: #f4f5f6;
	border-radius: 8px;
	height: 48px;
	color: #222a29;
	font-family: 'Inter';
	border: solid 0px transparent;
	font-size: 14px;
	line-height: 16px;
	margin-top: 16px;
	width: calc(100% - 12px);
	&:focus {
		outline: none;
		background: #eefcfb;
	}
	&[type='number'] {
		-moz-appearance: textfield;
	}
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

export const Return = styled.img`
	background: transparent;
	width: 50px;
	height: 50px;
	position: absolute;
	cursor: pointer;
	top: 0;
	right: 0;
	padding: 16px;
`;
