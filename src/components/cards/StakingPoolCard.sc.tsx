import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { Button } from '../styled-components/Button';

export const StakingPoolContainer = styled.div`
	width: 380px;
	padding: 16px 24px 24px;
	border-radius: 10px;
	background: #ffffffe5;
	color: #303b72;
	position: relative;
	margin: 32px 16px;
	overflow: hidden;
`;
export const StakingPoolExchange = styled.div`
	font-family: 'Red Hat Text';
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: 18px;
	letter-spacing: 0.08em;
`;
export const StakingPoolBadge = styled.img`
	position: absolute;
	top: 12px;
	right: 0px;
`;
export const SPTitle = styled(Row)`
	margin-top: 12px;
	margin-bottom: 12px;
`;
export const StakingPoolImage = styled.img``;
export const StakingPoolLabel = styled.span`
	font-family: 'Red Hat Text';
	font-size: 32px;
	font-style: normal;
	font-weight: bold;
	line-height: 38px;
	letter-spacing: 0em;
	margin-left: 24px;
`;
export const StakingPoolSubtitle = styled.div`
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 150%;
	color: #82899a;
`;
export const DetailLabel = styled.div`
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 150%;
	color: #82899a;
`;

export const Details = styled.div`
	margin: 12px 0;
`;
export const DetailHeader = styled(Row)`
	font-family: 'Red Hat Text';
`;
export const DetailLink = styled.button`
	font-style: normal;
	font-weight: bold;
	font-size: 12px;
	line-height: 15px;
	text-align: center;
	color: #303b72;
	border: 0;
	background-color: unset;
	cursor: pointer;
`;
export const DetailValue = styled.div`
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: bold;
	font-size: 18px;
	line-height: 24px;
	letter-spacing: -0.005em;
	color: #303b72;
`;

export const CardButton = styled(Button)`
	height: 36px;
	font-size: 12px;
	width: 265px;
	margin: 8px auto;
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
