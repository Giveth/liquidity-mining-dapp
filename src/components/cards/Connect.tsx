import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { WalletAddressInputWithButton } from '../input';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { H2, P } from '../styled-components/Typography';
import { ArrowButton, Card } from './common';
import { OnboardContext } from '../../context/onboard.context';
import { UserContext, GiveDropStateType } from '../../context/user.context';
import { utils, BigNumber } from 'ethers';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import next from 'next';
import config from '@/config/development';
import { WrongNetworkModal } from '@/components/modals/WrongNetwork';
import { formatWeiHelper } from '@/helpers/number';
import { addGIVToken } from '@/lib/metamask';
import { ButtonLink, OulineLinkButton } from '@giveth/ui-design-system';
interface IConnectCardContainerProps {
	data: any;
}

const ConnectCardContainer = styled(Card)<IConnectCardContainerProps>`
	::before {
		content: '';
		background-image: url('${props => props.data.bg}');
		position: absolute;
		width: ${props => props.data.width};
		height: ${props => props.data.height};
		top: ${props => props.data.top};
		right: ${props => props.data.right};
		z-index: -1;
	}
	// @media only screen and (max-width: 1360px) {}
	// @media only screen and (max-width: 1120px) {}
	@media only screen and (max-width: 1120px) {
		padding: 32px;
		::before {
			background-image: none;
		}
	}
`;

export const Header = styled.div`
	margin-bottom: 92px;
	@media only screen and (max-width: 1120px) {
		margin-bottom: 32px;
	}
`;

const Title = styled(H2)`
	width: 800px;
	@media only screen and (max-width: 1360px) {
		width: 700px;
	}
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;

const Desc = styled(P)`
	margin-top: 22px;
`;

const ConnectRow = styled(Row)`
	flex-direction: row;
	gap: 16px;
	// @media only screen and (max-width: 1360px) {}
	@media only screen and (max-width: 1120px) {
		flex-direction: column;
	}
`;

const ConnectButton = styled(Button)`
	width: 300px;
	@media only screen and (max-width: 1360px) {
		width: 257px;
	}
`;

const Span = styled.div`
	display: inline-block;
	font-size: 20px;
	line-height: 26px;
	text-transform: uppercase;
`;

const InputWithButtonContainer = styled.div`
	width: 588px;
`;

const ClickableStrong = styled.strong`
	cursor: pointer;
`;

const ClaimedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
	@media only screen and (max-width: 1120px) {
		margin-top: 64px;
	}
`;

const SunImage = styled.div`
	position: relative;
	height: 0px;
	@media only screen and (max-width: 1120px) {
		display: none;
	}
`;

const StarsImage = styled(SunImage)`
	left: 75%;
	top: -50px;
`;

const ClaimedTitle = styled.div`
	font-family: 'Red Hat Text';
	font-size: 64px;
	font-weight: 700;
	text-align: center;
`;

const ClaimedSubtitleContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 8px;
`;

const ClaimedSubtitleA = styled.div`
	font-family: 'Red Hat Text';
	font-size: 21px;
	text-align: center;
	display: flex;
	gap: 12px;
`;

const AddGivButton = styled.div`
	cursor: pointer;
`;

const SocialButton = styled(Button)`
	font-family: 'Red Hat Text';
	font-size: 14px;
	font-weight: bold;
	text-transform: uppercase;
	background-color: transparent;
	border: 2px solid white;
	height: 50px;
	width: 265px;
	margin: 12px 0 0 0;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
`;

const ExploreButton = styled(SocialButton)`
	background-color: #e1458d;
	border: none;
	margin-left: 80px;
	width: 285px;
`;

const ClaimFromAnother = styled.span`
	cursor: pointer;
	color: '#FED670'
	margin-top: 4px;
`;

export const ConnectCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep, goFirstStep } =
		useContext(ClaimViewContext);

	const { address, isReady, connect, network } = useContext(OnboardContext);
	const { submitUserAddress, totalAmount, giveDropState, resetWallet } =
		useContext(UserContext);

	const [walletAddress, setWalletAddress] = useState<string>('');
	const [addressSubmitted, setAddressSubmitted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [connectWallet, setConnectionWallet] = useState<boolean>(false);
	const [networkModal, setNetworkModal] = useState<boolean>(false);

	useEffect(() => {
		setWalletAddress(address);
		if (address && connectWallet) {
			submitAddress(address);
			setConnectionWallet(false);
		}
	}, [address, connectWallet]);

	useEffect(() => {
		if (addressSubmitted) {
			setLoading(false);
			setAddressSubmitted(false);
		}
	}, [addressSubmitted, totalAmount]);

	const submitAddress = async (value: string): Promise<void> => {
		setLoading(true);
		await submitUserAddress(value);
		setAddressSubmitted(true);
	};

	let title;
	let desc;
	let btnLabel;
	let bg = {
		width: '473px',
		height: '210px',
		top: '0',
		right: '0',
		bg: '/images/connectbg.png',
	};

	switch (giveDropState) {
		case GiveDropStateType.notConnected:
			title = 'Claim your GIVdrop';
			desc =
				'Connect your wallet or check an Ethereum address to see your rewards.';
			btnLabel = 'CONNECT WALLET';
			bg = {
				width: '473px',
				height: '210px',
				top: '0',
				right: '0',
				bg: '/images/connectbg.png',
			};
			break;
		case GiveDropStateType.Success:
			title = `You have ${formatWeiHelper(
				totalAmount.div(10),
			)} GIV to claim.`;
			desc = 'Congrats, your GIVdrop awaits. Go claim it!';
			bg = {
				width: '856px',
				height: '582px',
				top: '0',
				right: '0',
				bg: '/images/connectSuccbg.png',
			};
			break;
		case GiveDropStateType.Missed:
			title = 'You missed the GIVdrop';
			desc = (
				<span>
					But there are more ways to get GIV! Try another address or
					donate to verified projects to qualify for{' '}
					<Link href='/givbacks' passHref>
						<ClickableStrong>GIVbacks</ClickableStrong>
					</Link>
					.
				</span>
			);
			btnLabel = 'CHANGE WALLET';
			bg = {
				width: '622px',
				height: '245px',
				top: '337px',
				right: '300px',
				bg: '/images/connectMissbg.png',
			};
			break;
		case GiveDropStateType.Claimed:
			bg = {
				width: '622px',
				height: '245px',
				top: '337px',
				right: '300px',
				bg: '/images/connectMissbg.png',
			};
			break;
		default:
			break;
	}

	const checkConnection = async () => {
		if (!isReady) await connect();
		goNextStep();
	};

	useEffect(() => {
		setNetworkModal(network !== config.XDAI_NETWORK_NUMBER && isReady);
	}, [network, isReady]);

	return (
		<>
			{networkModal && (
				<WrongNetworkModal
					showModal={networkModal}
					setShowModal={setNetworkModal}
					targetNetworks={[config.XDAI_NETWORK_NUMBER]}
				/>
			)}
			<ConnectCardContainer
				activeIndex={activeIndex}
				index={index}
				data={bg}
			>
				{giveDropState !== GiveDropStateType.Claimed && (
					<Header>
						<Title as='h1'>{title}</Title>
						<Desc size='small' color={'#CABAFF'}>
							{desc}
						</Desc>
					</Header>
				)}
				{giveDropState !== GiveDropStateType.Success &&
					giveDropState !== GiveDropStateType.Claimed && (
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<ConnectButton
								secondary
								onClick={async () => {
									await connect();
									setConnectionWallet(true);
								}}
							>
								{btnLabel}
							</ConnectButton>
							<Span>or</Span>
							<InputWithButtonContainer>
								<WalletAddressInputWithButton
									btnLable='Check'
									placeholder='Enter an address to check your GIVdrop'
									walletAddress={walletAddress}
									onSubmit={submitAddress}
									disabled={loading}
									onUpdate={() => {
										resetWallet();
									}}
								/>
							</InputWithButtonContainer>
						</Row>
					)}
				{giveDropState === GiveDropStateType.Success &&
					activeIndex === index && (
						<ArrowButton onClick={checkConnection} />
					)}
				{giveDropState === GiveDropStateType.Claimed && (
					<>
						<SunImage>
							<Image
								src='/images/claimed_logo.svg'
								height='225'
								width='255'
								alt='Claimed sun'
							/>
						</SunImage>
						<StarsImage>
							<Image
								src='/images/claimed_stars.svg'
								height='105'
								width='105'
								alt='Yellow stars.'
							/>
						</StarsImage>
						<ClaimedContainer>
							<ClaimedTitle>Congratulations!</ClaimedTitle>
							<ClaimedSubtitleContainer>
								<ClaimedSubtitleA>
									You already claimed your GIV!
									<AddGivButton
										onClick={() =>
											addGIVToken(
												config.XDAI_NETWORK_NUMBER,
											)
										}
									>
										<Image
											src='/images/icons/metamask.svg'
											height='24'
											width='24'
											alt='Metamask logo.'
										/>
									</AddGivButton>
								</ClaimedSubtitleA>
								<a
									href='https://twitter.com/intent/tweet?text=The%20%23GIVeconomy%20is%20here!%20Excited%20to%20be%20part%20of%20the%20Future%20of%20Giving%20with%20$GIV%20%26%20%40givethio%20%23blockchain4good%20%23defi4good%20%23givethlove%20%23givdrop'
									target='_blank'
									rel='noreferrer'
								>
									<SocialButton>
										<>
											share on twitter
											<Image
												src='/images/icons/twitter.svg'
												height='15'
												width='15'
												alt='Twitter logo.'
											/>
										</>
									</SocialButton>
								</a>
								<a
									href='https://swag.giveth.io/'
									target='_blank'
									rel='noreferrer'
								>
									<SocialButton>
										claim your free swag
										<Image
											src='/images/icons/tshirt.svg'
											height='15'
											width='15'
											alt='T shirt.'
										/>
									</SocialButton>
								</a>
								<a
									href='https://discord.giveth.io/'
									target='_blank'
									rel='noreferrer'
								>
									<SocialButton>
										join our discord
										<Image
											src='/images/icons/discord.svg'
											height='15'
											width='15'
											alt='discord logo.'
										/>
									</SocialButton>
								</a>
								<Link href='/' passHref>
									<a target='_blank' rel='noreferrer'>
										<ExploreButton>
											explore the giveconomy
										</ExploreButton>
									</a>
								</Link>
								<ClaimFromAnother
									onClick={() => {
										goFirstStep();
										resetWallet();
									}}
								>
									Claim from another address!
								</ClaimFromAnother>
							</ClaimedSubtitleContainer>
						</ClaimedContainer>
					</>
				)}
			</ConnectCardContainer>
		</>
	);
};

export default ConnectCard;
