import Image from 'next/image';
import { Row } from './styled-components/Grid';
import { FC, useContext, useState, useEffect } from 'react';
import { ThemeContext, ThemeType } from '@/context/theme.context';
import { OnboardContext } from '@/context/onboard.context';
import { formatWeiHelper } from '@/helpers/number';
import { networksParams } from '@/helpers/blockchain';
import {
	ConnectButton,
	HBBalanceLogo,
	HBContainer,
	HBContent,
	HBPic,
	BalanceButton,
	HeaderLinks,
	HeaderLink,
	StyledHeader,
	WalletButton,
	WBInfo,
	WBNetwork,
	CreateProject,
	SmallCreateProject,
	Logo,
	RewardMenuAndButtonContainer,
	CoverLine,
	SmallHeaderLinks,
	HeaderPlaceholder,
} from './Header.sc';
import Link from 'next/link';
import { useSubgraph } from '@/context/subgraph.context';
import { RewardMenu } from './menu/RewardMenu';
import { IconMenu24 } from '@giveth/ui-design-system';

export interface IHeader {
	theme?: ThemeType;
	show?: boolean;
}

const Header: FC<IHeader> = () => {
	const [showRewardMenu, setShowRewardMenu] = useState(false);
	const [showHeader, setShowHeader] = useState(true);
	const { theme } = useContext(ThemeContext);
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { network, connect, address, provider } = useContext(OnboardContext);

	const handleHoverClickBalance = (show: boolean) => {
		setShowRewardMenu(show);
	};

	useEffect(() => {
		const threshold = 0;
		let lastScrollY = window.pageYOffset;
		let ticking = false;

		const updateScrollDir = () => {
			const scrollY = window.pageYOffset;

			if (Math.abs(scrollY - lastScrollY) < threshold) {
				ticking = false;
				return;
			}
			const show = scrollY > lastScrollY ? false : true;
			setShowHeader(show);
			if (!show) {
				setShowRewardMenu(false);
			}
			lastScrollY = scrollY > 0 ? scrollY : 0;
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateScrollDir);
				ticking = true;
			}
		};

		window.addEventListener('scroll', onScroll);
		console.log(showHeader);

		return () => window.removeEventListener('scroll', onScroll);
	}, [showHeader]);

	return (
		<>
			<HeaderPlaceholder />
			<StyledHeader
				justifyContent='space-between'
				alignItems='center'
				theme={theme}
				show={showHeader}
			>
				<Row>
					<Logo>
						<Image
							width='48p'
							height='48px'
							alt='Giveth logo'
							src={`/images/logo/logo1.png`}
						/>
					</Logo>
					<SmallHeaderLinks>
						{/* <IconMenu24 /> */}
						<Link href='/' passHref>
							<HeaderLink size='Big'>GIVeconomy</HeaderLink>
						</Link>
					</SmallHeaderLinks>
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
					<CreateProject
						label='CREATE A PROJECT'
						href='https://giveth.io/create'
						target='_blank'
					/>
					<SmallCreateProject
						label=''
						href='https://giveth.io/create'
						target='_blank'
						icon={
							<Image
								src='/images/plus-white.svg'
								width={16}
								height={16}
								alt='create project'
							/>
						}
					/>
					{address ? (
						<>
							<RewardMenuAndButtonContainer
								onClick={() => handleHoverClickBalance(true)}
								onMouseEnter={() =>
									handleHoverClickBalance(true)
								}
								onMouseLeave={() =>
									handleHoverClickBalance(false)
								}
							>
								<BalanceButton outline>
									<HBContainer>
										<HBBalanceLogo
											src={'/images/logo/logo.svg'}
											alt='Profile Pic'
											width={'24px'}
											height={'24px'}
										/>
										<HBContent>
											{formatWeiHelper(balances.balance)}
										</HBContent>
									</HBContainer>
									<CoverLine />
								</BalanceButton>
								{showRewardMenu && <RewardMenu />}
							</RewardMenuAndButtonContainer>
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
						<div>
							<ConnectButton
								buttonType='primary'
								label='CONNECT WALLET'
								onClick={connect}
							/>
						</div>
					)}
				</Row>
			</StyledHeader>
		</>
	);
};

export default Header;
