import styled from 'styled-components';
import { Row } from './styled-components/Grid';
import { Button as CButton } from './styled-components/Button';
import { IHeader } from './Header';
import { brandColors, Button, GLink } from '@giveth/ui-design-system';

export const StyledHeader = styled(Row)<IHeader>`
	padding: 16px 32px;
	position: fixed;
	// background-color: ${props => props.theme.bg};
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

export const HeaderButton = styled(CButton)`
	display: flex;
	height: 50px;
	color: white;
	font-family: 'Red Hat Text';
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 22px;
	padding: 12px;
	border-radius: 48px;
	text-align: left;
	border: 1px solid #3811bf;
	background-color: ${brandColors.giv[900]};
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
}

export const HeaderLinks = styled(Row)`
	background-color: ${brandColors.giv[900]};
	border: 1px solid ${brandColors.giv[600]};
	border-radius: 48px;
	padding: 6px;
	gap: 8px;
`;

export const HeaderLink = styled(GLink)<IHeaderLinkProps>`
	padding: 8px 16px 7px;
	background-color: ${props => (props.active ? brandColors.giv[600] : '')};
	border-radius: 72px;
`;

export const ConenctButton = styled(Button)``;

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

export const CreateProject = styled(Button)`
	white-space: nowrap;
`;
