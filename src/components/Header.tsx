import styled from 'styled-components';
import Image from 'next/image';
import router from 'next/router';
import { Row } from './styled-components/Grid';
import { Button } from './styled-components/Button';
import { FC, useContext } from 'react';
import { ThemeContext, ThemeType } from '../context/theme.context';
import { OnboardContext } from '../context/onboard.context';
import { TokenBalanceContext } from '../context/tokenBalance.context';
import { formatWeiHelper } from '../helpers/number';
import config from '../configuration';
import { claimReward } from '../lib/claim';
import { networksParams } from '../helpers/blockchain';

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


const WalletButton = styled(Button)`
	display: flex;
	width: 176px;
	height: 48px;
	color: white;
	font-family: 'red-hat';
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 22px;
	padding: 4px 16px;
	// border: 1px solid #3811BF;
	// box-sizing: border-box;
	border-radius: 48px;
	text-align: left;
`;
const WBContainer = styled.div`
	display: flex;
	align-items: center;
`; 

const WBInfo = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 8px;
`; 

const WBNetwork = styled.span`
	font-family: 'red-hat';
	font-style: normal;
	font-weight: normal;
	font-size: 10px;
	line-height: 13px;
	color: #B9A7FF;
	width: 120px;
`;

const WBProfilePic = styled.img`
	border-radius: 24px;
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
	const { tokenBalance, tokenDistroBalance } =
		useContext(TokenBalanceContext);

	const { network, connect, address, provider } = useContext(OnboardContext);
	const goToClaim = () => {
		router.push('/claim');
	};

	const onClaimReward = () => {
		claimReward(
			config.NETWORKS_CONFIG[network]?.TOKEN_DISTRO_ADDRESS,
			provider,
		);
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
					CLAIM GIVdrop
				</HeaderButton>
				{address ? (
					<>
						<HeaderButton>NETWORK {network}</HeaderButton>
						<HeaderButton neutral>
							{'Balance: ' +
								formatWeiHelper(
									tokenBalance,
									config.TOKEN_PRECISION,
								)}{' '}
							GIV{' '}
						</HeaderButton>
						<HeaderButton neutral onClick={onClaimReward}>
							{'Claimable: ' +
								formatWeiHelper(
									tokenDistroBalance.claimable,
									config.TOKEN_PRECISION,
								)}{' '}
							GIV{' '}
						</HeaderButton>
						<WalletButton outline onClick={connect}>
							<WBContainer>
								<WBProfilePic src={"/images/placeholders/profile.png"} alt="Profile Pic" width={'24px'} height={'24px'}/>
								<WBInfo>
									<span>{`${address.substr(0,6)}...${address.substr(address.length-5,address.length)}`}</span>
									<WBNetwork>Connected to {networksParams[network].nativeCurrency.symbol}</WBNetwork> 
								</WBInfo>
							</WBContainer>
						</WalletButton>
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
