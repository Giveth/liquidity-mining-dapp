import styled from 'styled-components';
import Image from 'next/image';
import router from 'next/router';
import { Row } from './styled-components/Grid';
import { Button } from './styled-components/Button';
import { FC, useContext, useRef, useEffect, useState } from 'react';
import { ThemeContext, ThemeType } from '../context/theme.context';
import { OnboardContext } from '../context/onboard.context';
import { TokenBalanceContext } from '../context/tokenBalance.context';
import { formatWeiHelper } from '../helpers/number';
import config from '../configuration';
import { claimReward } from '../lib/claim';
import { networksParams } from '../helpers/blockchain';

interface IHeader {
	theme?: ThemeType;
	scrolled: boolean;
}

const StyledHeader = styled(Row)<IHeader>`
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

const HeaderButton = styled(Button)`
	display: flex;
	height: 48px;
	color: white;
	font-family: 'red-hat';
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 22px;
	padding: 11px;
	border-radius: 48px;
	text-align: left;
	border: 1px solid #3811BF;
`;


const WalletButton = styled(HeaderButton)`
	font-size: 14px;
	width: 176px;
	padding: 6px 16px;
`;

const HBContainer = styled.div`
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

const HBPic = styled.img`
	border-radius: 24px;
`;

const HBBalanceLogo  = styled(HBPic)`
	padding: 4px;
	background: #5326EC;
`;

const HBContent  = styled.span`
	margin-left: 8px;
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

interface IHeaderLinkProps {
	active?: boolean;
	important?: boolean;
}

const HeaderLink = styled.a<IHeaderLinkProps>`
	font-family: 'red-hat';
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
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 3px;
		${props => props.active ? 'background: #FCFCFF;' : ''}
	}
	
`;

const ConenctButton = styled(HeaderButton)`
`;

const NotifButton = styled(HeaderButton)`
	padding: 23px;
	background-image: url('/images/notif.svg');
	background-position: center;
    background-repeat: no-repeat;
	max-width: 48px;
`;

const HeaderPlaceHolder = styled.div`
	height: 120px;
`;

const Header: FC<IHeader> = () => {
	const [scrolled,setScrolled] = useState(false);

	const { theme } = useContext(ThemeContext);
	const placeholderRef = useRef<HTMLDivElement>(null);
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

	useEffect(() => {
		let observer: IntersectionObserver;
		if (!('IntersectionObserver' in window) ||
				!('IntersectionObserverEntry' in window) ||
				!('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
				// TODO: load polyfill
				// console.log('load polyfill now');
				
		} else {
		  observer = new IntersectionObserver(
			([entry]) => {
			  setScrolled(!entry.isIntersecting)
			},
			{
			  root: null,
			  rootMargin: "-30px",
			}
		  );
		  if (placeholderRef.current) {
			observer.observe(placeholderRef.current);
		  }
		  return () => {
			if (observer) {
			  observer.disconnect()
			}
		  }
		}
	  }, [placeholderRef]);

	return (
		<>
			<HeaderPlaceHolder ref={placeholderRef} />
			<StyledHeader
				justifyContent='space-between'
				alignItems='center'
				theme={theme}
				scrolled={scrolled}
			>
				<Row gap='16px'>
					<Image
						width='32p'
						height='32px'
						alt='Giveth logo'
						src={`/images/logo/logo.svg`}
					/>
					<Image
						width='94px'
						height='20px'
						alt='Giveth logo'
						src={`/images/logo/givethio.svg`}
					/>
				</Row>
				<Row gap='40px'>
						<HeaderLink>Projects</HeaderLink>
						<HeaderLink active>GIVeconomy</HeaderLink>
						<HeaderLink>Join</HeaderLink>
						<HeaderLink important>Create a Project</HeaderLink>
				</Row>
				<Row gap='8px'>
					<NotifButton />
					{address ? (
						<>
							<HeaderButton outline onClick={onClaimReward}>
								<HBContainer>
									<HBBalanceLogo src={"/images/logo/logo.svg"} alt="Profile Pic" width={'24px'} height={'24px'}/>
									<HBContent>
									{formatWeiHelper(
										tokenBalance,
										// tokenDistroBalance.claimable,
										config.TOKEN_PRECISION,
									)}
									</HBContent>
								</HBContainer>
							</HeaderButton>
							<WalletButton outline onClick={connect}>
								<HBContainer>
									<HBPic src={"/images/placeholders/profile.png"} alt="Profile Pic" width={'24px'} height={'24px'}/>
									<WBInfo>
										<span>{`${address.substr(0,6)}...${address.substr(address.length-5,address.length)}`}</span>
										<WBNetwork>Connected to {networksParams[network].nativeCurrency.symbol}</WBNetwork> 
									</WBInfo>
								</HBContainer>
							</WalletButton>
						</>
					) : (
						<ConenctButton secondary onClick={connect}>
							Connect Wallet
						</ConenctButton>
					)}
				</Row>
			</StyledHeader>
		</>
	);
};

export default Header;
