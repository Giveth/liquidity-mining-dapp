import Image from 'next/image';
import router from 'next/router';
import { Row } from './styled-components/Grid';
import React, { FC, useContext, useRef, useEffect, useState } from 'react';
import { ThemeContext, ThemeType } from '@/context/theme.context';
import { OnboardContext } from '@/context/onboard.context';
import { useBalances } from '@/context/balance.context';
import { formatWeiHelper } from '@/helpers/number';
import { networksParams } from '@/helpers/blockchain';
import {
	ConenctButton,
	HBBalanceLogo,
	HBContainer,
	HBContent,
	HBPic,
	HeaderButton,
	HeaderLinks,
	HeaderLink,
	HeaderPlaceHolder,
	NotifButton,
	StyledHeader,
	WalletButton,
	WBInfo,
	WBNetwork,
	CreateProject,
} from './Header.sc';
import Link from 'next/link';

export interface IHeader {
	theme?: ThemeType;
	scrolled?: boolean;
}

const Header: FC<IHeader> = () => {
	const [scrolled, setScrolled] = useState(false);

	const { theme } = useContext(ThemeContext);
	// const placeholderRef = useRef<HTMLDivElement>(null);
	const { currentBalance } = useBalances();
	const { network, connect, address, provider } = useContext(OnboardContext);

	// useEffect(() => {
	// 	let observer: IntersectionObserver;
	// 	if (
	// 		!('IntersectionObserver' in window) ||
	// 		!('IntersectionObserverEntry' in window) ||
	// 		!('intersectionRatio' in window.IntersectionObserverEntry.prototype)
	// 	) {
	// 		// TODO: load polyfill
	// 		// console.log('load polyfill now');
	// 	} else {
	// 		observer = new IntersectionObserver(
	// 			([entry]) => {
	// 				setScrolled(!entry.isIntersecting);
	// 			},
	// 			{
	// 				root: null,
	// 				rootMargin: '-30px',
	// 			},
	// 		);
	// 		if (placeholderRef.current) {
	// 			observer.observe(placeholderRef.current);
	// 		}
	// 		return () => {
	// 			if (observer) {
	// 				observer.disconnect();
	// 			}
	// 		};
	// 	}
	// }, [placeholderRef]);

	return (
		<>
			<HeaderPlaceHolder />
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
				<HeaderLinks>
					<HeaderLink size='Big' href='https://giveth.io/'>
						Home
					</HeaderLink>
					<HeaderLink size='Big' href='https://giveth.io/projects'>
						Projects
					</HeaderLink>
					<Link href='/' passHref>
						<HeaderLink size='Big' active>
							GIVeconomy
						</HeaderLink>
					</Link>
					<HeaderLink size='Big' href='https://giveth.io/join'>
						Community
					</HeaderLink>
				</HeaderLinks>
				<Row gap='8px'>
					{/* <NotifButton /> */}
					<CreateProject label='CREATE A PROJECT' />
					{address ? (
						<>
							<HeaderButton outline>
								<HBContainer>
									<HBBalanceLogo
										src={'/images/logo/logo.svg'}
										alt='Profile Pic'
										width={'24px'}
										height={'24px'}
									/>
									<HBContent>
										{formatWeiHelper(
											currentBalance.balance,
										)}
									</HBContent>
								</HBContainer>
							</HeaderButton>
							<WalletButton outline onClick={connect}>
								<HBContainer>
									<HBPic
										src={'/images/placeholders/profile.png'}
										alt='Profile Pic'
										width={'24px'}
										height={'24px'}
									/>
									<WBInfo>
										<span>{`${address.substring(
											0,
											6,
										)}...${address.substring(
											address.length - 5,
											address.length,
										)}`}</span>
										<WBNetwork>
											Connected to{' '}
											{networksParams[network]
												? networksParams[network]
														.nativeCurrency.symbol
												: provider?._network?.name}
										</WBNetwork>
									</WBInfo>
								</HBContainer>
							</WalletButton>
						</>
					) : (
						<ConenctButton
							buttonType='primary'
							label='Connect Wallet'
							onClick={connect}
						/>
					)}
				</Row>
			</StyledHeader>
		</>
	);
};

export default Header;
