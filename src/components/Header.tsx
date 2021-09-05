import styled from 'styled-components';
import Image from 'next/image';
import router from 'next/router';
import { Row } from './styled-components/Grid';
import { Button } from './styled-components/Button';
import { FC, useContext } from 'react';
import { ThemeContext, ThemeType } from '../context/theme.context';
import { OnboardContext } from '../context/onboard.context';
import { UserContext } from '../context/user.context';

interface IHeader {
	theme?: ThemeType;
}

const StyledHeader = styled(Row)<IHeader>`
	height: 128px;
	padding: 0 132px;
	position: relative;
	background-color: ${props => props.theme.bg};
`;

const HeaderButton = styled(Button)`
	height: 36px;
	font-size: 14px;
	font-style: normal;
	font-weight: 700;
	line-height: 18px;
	letter-spacing: 0.04em;
	text-align: center;
	padding: 0;
	white-space: nowrap;
	padding: 0 16px;
`;

const Title = styled.h1`
	font-family: 'red-hat';
	font-size: 16px;
	//font-style: bold;
	line-height: 24px;
	letter-spacing: 0.02em;
	text-align: left;
	color: ${props => props.theme.fg};
`;

const ConenctButton = styled(Button)`
	height: 36px;
	width: 300px;
`;

const Header: FC<IHeader> = () => {
	const { theme } = useContext(ThemeContext);
	const { network, connect, address, walletCheck } =
		useContext(OnboardContext);
	const goToClaim = () => {
		router.push('/claim');
	};
	return (
		<StyledHeader
			justifyContent='space-between'
			alignItems='center'
			theme={theme}
		>
			<Row gap='16px'>
				<Image
					width='58'
					height='58px'
					alt='Giveth logo'
					src={`/images/${
						theme.type === ThemeType.Dark ? 'logod' : 'logol'
					}.svg`}
				/>
				<Title theme={theme}>THE FUTURE OF GIVING</Title>
			</Row>
			<Row gap='8px'>
				<HeaderButton secondary onClick={goToClaim}>
					CLAIM GIV
				</HeaderButton>
				{address ? (
					<>
						<HeaderButton>NETWORK {network}</HeaderButton>
						<HeaderButton neutral>{644} GIV </HeaderButton>
						<HeaderButton neutral onClick={connect}>
							{address}
						</HeaderButton>
					</>
				) : (
					<ConenctButton secondary onClick={connect}>
						Connect Wallet
					</ConenctButton>
				)}
			</Row>
		</StyledHeader>
	);
};

export default Header;
