import Image from 'next/image';
import { Row } from './styled-components/Grid';
import React, { FC, useContext } from 'react';
import { ThemeContext, ThemeType } from '@/context/theme.context';
import { OnboardContext } from '@/context/onboard.context';
import { useBalances } from '@/context/balance.context';
import { formatWeiHelper } from '@/helpers/number';
import { networksParams } from '@/helpers/blockchain';
import {
	ConnectButton,
	HBBalanceLogo,
	HBContainer,
	HBContent,
	HBPic,
	HeaderButton,
	HeaderLinks,
	HeaderLink,
	StyledHeader,
	WalletButton,
	WBInfo,
	WBNetwork,
	CreateProject,
	Logo,
	BalanceTooltip,
} from './Header.sc';
import { IconWithTooltip } from './IconWithToolTip';
import Link from 'next/link';

export interface IHeader {
	theme?: ThemeType;
	scrolled?: boolean;
}

const Header: FC<IHeader> = () => {
	const { theme } = useContext(ThemeContext);
	const { currentBalance } = useBalances();
	const { network, connect, address, provider } = useContext(OnboardContext);

	return (
		<>
			<StyledHeader
				justifyContent='space-between'
				alignItems='center'
				theme={theme}
			>
				<Row gap='16px'>
					<Logo>
						<Image
							width='48p'
							height='48px'
							alt='Giveth logo'
							src={`/images/logo/logo1.png`}
						/>
					</Logo>
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
						onClick={() => window.open(`https://giveth.io/create`)}
					/>
					{address ? (
						<>
							<IconWithTooltip
								icon={
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
								}
								direction={'bottom'}
							>
								<BalanceTooltip>
									GIV currently in wallet
								</BalanceTooltip>
							</IconWithTooltip>

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
