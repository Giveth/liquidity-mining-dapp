import styled from 'styled-components';
import Image from 'next/image';
import router from 'next/router';
import { Row } from './styled-components/Grid';
import React, { FC, useContext, useRef, useEffect, useState } from 'react';
import { ThemeContext, ThemeType } from '@/context/theme.context';
import { OnboardContext } from '@/context/onboard.context';
import { useBalances } from '@/context/balance.context';
import { formatWeiHelper } from '@/helpers/number';
import config from '../configuration';
import { claimReward } from '@/lib/claim';
import { networksParams } from '@/helpers/blockchain';
import {
	ConenctButton,
	HBBalanceLogo,
	HBContainer,
	HBContent,
	HBPic,
	HeaderButton,
	HeaderLink,
	HeaderPlaceHolder,
	NotifButton,
	StyledHeader,
	WalletButton,
	WBInfo,
	WBNetwork,
} from './Header.sc';

export interface IHeader {
	theme?: ThemeType;
	scrolled?: boolean;
}

const Header: FC<IHeader> = () => {
	const [scrolled, setScrolled] = useState(false);

	const { theme } = useContext(ThemeContext);
	const placeholderRef = useRef<HTMLDivElement>(null);
	const { currentBalance } = useBalances();
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
		if (
			!('IntersectionObserver' in window) ||
			!('IntersectionObserverEntry' in window) ||
			!('intersectionRatio' in window.IntersectionObserverEntry.prototype)
		) {
			// TODO: load polyfill
			// console.log('load polyfill now');
		} else {
			observer = new IntersectionObserver(
				([entry]) => {
					setScrolled(!entry.isIntersecting);
				},
				{
					root: null,
					rootMargin: '-30px',
				},
			);
			if (placeholderRef.current) {
				observer.observe(placeholderRef.current);
			}
			return () => {
				if (observer) {
					observer.disconnect();
				}
			};
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
										<span>{`${address.substr(
											0,
											6,
										)}...${address.substr(
											address.length - 5,
											address.length,
										)}`}</span>
										<WBNetwork>
											Connected to{' '}
											{networksParams[network] &&
												networksParams[network]
													.nativeCurrency.symbol}
										</WBNetwork>
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
