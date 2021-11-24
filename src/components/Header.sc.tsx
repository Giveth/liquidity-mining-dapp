import styled from 'styled-components';
import { Row } from './styled-components/Grid';
import { Button } from './styled-components/Button';
import { IHeader } from './Header';

export const StyledHeader = styled(Row)<IHeader>`
	height: 104px;
	padding: 0 32px;
	position: fixed;
	background-color: ${props => props.theme.bg};
	top: 0;
	left: 0;
	right: 0;
	z-index: 1050;
	transition: box-shadow 0.3s ease;
	${props => {
		if (props.scrolled) {
			return 'box-shadow: 0px 0px 13px 4px rgba(0,0,0,0.5);';
		}
	}}
`;

export const HeaderButton = styled(Button)`
	display: flex;
	height: 48px;
	color: white;
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 22px;
	padding: 11px;
	border-radius: 48px;
	text-align: left;
	border: 1px solid #3811bf;
`;

export const WalletButton = styled(HeaderButton)`
	font-size: 14px;
	width: 176px;
	padding: 6px 16px;
`;

export const HBContainer = styled.div`
	display: flex;
	align-items: center;
`;

export const WBInfo = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 8px;
`;

export const WBNetwork = styled.span`
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: normal;
	font-size: 10px;
	line-height: 13px;
	color: #b9a7ff;
	width: 120px;
`;

export const HBPic = styled.img`
	border-radius: 24px;
`;

export const HBBalanceLogo = styled(HBPic)`
	padding: 4px;
	background: #5326ec;
`;

export const HBContent = styled.span`
	margin-left: 8px;
`;

export const Title = styled.h1`
	font-family: 'Red Hat Text';
	font-size: 16px;
	//font-style: bold;
	line-height: 24px;
	letter-spacing: 0.02em;
	text-align: left;
	color: ${props => props.theme.fg};
`;

interface IHeaderLinkProps {
	active?: boolean;
	important?: boolean;
}

export const HeaderLink = styled.a<IHeaderLinkProps>`
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 104px;
	position: relative;
	height: 100%;
	// height: 104px;
	color: ${props => {
		if (props.active) {
			return '#FCFCFF';
		}

		if (props.important) {
			return '#2FC8E0';
		}

		return '#A3B0F6';
	}};
	::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 3px;
		${props => (props.active ? 'background: #FCFCFF;' : '')}
	}
`;

export const ConenctButton = styled(HeaderButton)``;

export const NotifButton = styled(HeaderButton)`
	padding: 23px;
	background-image: url('/images/notif.svg');
	background-position: center;
	background-repeat: no-repeat;
	max-width: 48px;
`;

export const HeaderPlaceHolder = styled.div`
	height: 120px;
`;
