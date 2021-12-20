import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { H2, P } from '../styled-components/Typography';
import { Card, Header } from './common';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import { utils, BigNumber as EtherBigNumber } from 'ethers';
import { UserContext } from '../../context/user.context';
import { toast } from 'react-hot-toast';
import { networksParams } from '../../helpers/blockchain';
import { OnboardContext } from '../../context/onboard.context';
import config from '../../configuration';
import { claimAirDrop } from '../../lib/claim';
import { addGIVToken } from '@/lib/metamask';
import { WrongNetworkModal } from '@/components/modals/WrongNetwork';
import { GIVdropHarvestModal } from '../modals/GIVdropHarvestModal';
import { formatWeiHelper } from '@/helpers/number';

enum ClaimState {
	UNKNOWN,
	WAITING,
	SUBMITTING,
	CLAIMED,
	ERROR,
}

const ClaimedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
`;

const SunImage = styled.div`
	position: relative;
	height: 0px;
	left: -5%;
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
	gap: 4px;
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

const ClaimedSubtitleB = styled.div`
	font-family: 'Red Hat Text';
	font-size: 20px;
	text-align: center;
	padding-left: 64px;
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
	margin-left: 80px;
`;

interface IClaimCardContainer {
	claimed: any;
}

const ClaimCardContainer = styled(Card)<IClaimCardContainer>`
	::before {
		content: '';
		background-image: ${props =>
			props.claimed ? '' : 'url(/images/wave.png)'};
		position: absolute;
		height: 143px;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 0;
	}
`;

const Title = styled(H2)``;

const Desc = styled(P)`
	margin-top: 22px;
`;

const ClaimHeader = styled(Header)`
	margin: 116px auto 48px auto;
	text-align: center;
`;

const ClaimButton = styled(Button)`
	width: 356px;
	text-transform: uppercase;
`;

const MetamaskButton = styled.a`
	width: 215px;
	heigh: 32px;
	margin-top: 12px;
	background: transparent;
	cursor: pointer;
`;

const ClaimCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goFirstStep } = useContext(ClaimViewContext);
	const { userAddress, claimableAmount, resetWallet } =
		useContext(UserContext);
	const {
		isReady,
		changeWallet,
		connect,
		provider,
		network,
		walletCheck,
		address,
	} = useContext(OnboardContext);

	const [txStatus, setTxStatus] = useState();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
	const [claimState, setClaimState] = useState<ClaimState>(
		ClaimState.UNKNOWN,
	);

	useEffect(() => {
		setClaimState(ClaimState.UNKNOWN);
	}, [address, userAddress]);

	useEffect(() => {
		setShowModal(
			isReady &&
				network !== config.XDAI_NETWORK_NUMBER &&
				activeIndex === 5,
		);
	}, [network, activeIndex, isReady]);

	const checkNetworkAndWallet = async () => {
		if (!isReady) {
			console.log('Wallet is not connected');
			await connect();
			return false;
		}

		if (!provider || userAddress !== address) {
			console.log('Connected wallet is not the claimed address');
			wrongWallet(userAddress);
			await changeWallet();
			return false;
		}

		if (network !== config.XDAI_NETWORK_NUMBER) {
			await walletCheck();
			return false;
		}

		return true;
	};

	const openHarvestModal = async () => {
		const check = checkNetworkAndWallet();
		if (!check) return;

		setShowClaimModal(true);
	};

	const onClaim = async () => {
		const check = checkNetworkAndWallet();
		if (!check) return;
		if (!provider) return;

		try {
			setClaimState(ClaimState.WAITING);
			const tx = await claimAirDrop(userAddress, provider);
			setTxStatus(tx);

			setClaimState(ClaimState.SUBMITTING);
			showPendingClaim(config.XDAI_NETWORK_NUMBER, tx.hash);
			const { status } = await tx.wait();

			if (status) {
				setClaimState(ClaimState.CLAIMED);
				showConfirmedClaim(config.XDAI_NETWORK_NUMBER, tx.hash);
			} else {
				setClaimState(ClaimState.ERROR);
				showFailedClaim(config.XDAI_NETWORK_NUMBER, tx.hash);
			}
		} catch (e) {
			setClaimState(ClaimState.ERROR);
			console.error(e);
		}
	};

	return (
		<ClaimCardContainer
			activeIndex={activeIndex}
			index={index}
			claimed={txStatus}
		>
			{showModal && (
				<WrongNetworkModal
					showModal={showModal}
					setShowModal={setShowModal}
					targetNetworks={[config.XDAI_NETWORK_NUMBER]}
				/>
			)}
			{showClaimModal && (
				<GIVdropHarvestModal
					showModal={showClaimModal}
					setShowModal={setShowClaimModal}
					network={config.XDAI_NETWORK_NUMBER}
					claimState={claimState}
					setClaimState={setClaimState}
					txStatus={txStatus}
					givdropAmount={claimableAmount}
					onClaim={onClaim}
				/>
			)}

			{claimState === ClaimState.CLAIMED ? (
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
								You have successfully claimed{' '}
								{formatWeiHelper(claimableAmount.div(10))} GIV.{' '}
								<AddGivButton
									onClick={() =>
										addGIVToken(config.XDAI_NETWORK_NUMBER)
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
							<ClaimedSubtitleB>
								Plus you&apos;re getting an additional{' '}
								<span style={{ color: '#FED670' }}>
									{formatWeiHelper(
										claimableAmount.mul(9).div(10 * 52 * 5),
									)}{' '}
									GIV
								</span>{' '}
								per week.
							</ClaimedSubtitleB>
							<a
								href='https://twitter.com/intent/tweet?text=The%20%23GIVeconomy%20is%20here!%20Excited%20to%20be%20part%20of%20the%20Future%20of%20Giving%20with%20$GIV%20%26%20%40givethio%20%23blockchain4good%20%23defi4good%20%23givethlove%20%23givdrop'
								target='_blank'
								rel='noreferrer'
							>
								<SocialButton>
									share on twitter
									<Image
										src='/images/icons/twitter.svg'
										height='15'
										width='15'
										alt='Twitter logo.'
									/>
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
									setClaimState(ClaimState.UNKNOWN);
								}}
							>
								Claim from another address!
							</ClaimFromAnother>
						</ClaimedSubtitleContainer>
					</ClaimedContainer>
				</>
			) : (
				<>
					<ClaimHeader>
						<Title as='h1'>Claim your GIV now!</Title>
						<Desc size='small' color={'#CABAFF'}>
							Join the giving economy.
						</Desc>
					</ClaimHeader>
					<Row alignItems={'center'} justifyContent={'center'}>
						{/* <ClaimButton secondary onClick={onClaim}> */}
						<ClaimButton
							secondary
							onClick={() => {
								openHarvestModal();
							}}
						>
							CLAIM {formatWeiHelper(claimableAmount.div(10))} GIV
						</ClaimButton>
					</Row>
					<Row alignItems={'center'} justifyContent={'center'}>
						<MetamaskButton
							onClick={() =>
								addGIVToken(config.XDAI_NETWORK_NUMBER)
							}
						>
							<Image
								src='/images/metamask.png'
								height='32'
								width='215'
								alt='Metamask button'
							/>
						</MetamaskButton>
					</Row>
				</>
			)}
		</ClaimCardContainer>
	);
};

export function showPendingClaim(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}/tx/${txHash}`;

	toast.success(
		<span>
			Claim submitted! Check the status{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				here
			</a>
			.
		</span>,
	);
}

export function wrongWallet(address: string): void {
	toast(
		<span>
			Please connect to the eligible wallet address on xDai: {address}
		</span>,
		{
			duration: 3000,
			position: 'bottom-center',
			style: {
				minWidth: '450px',
				textAlign: 'center',
				color: 'white',
				backgroundColor: '#E1458D',
			},
		},
	);
}

export function showFailedClaim(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}/tx/${txHash}`;

	toast.error(
		<span>
			Your claim failed! Check your transaction{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				here
			</a>
			.
		</span>,
	);
}

export function showConfirmedClaim(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}/tx/${txHash}`;

	toast.success(
		<span>
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				Claimed
			</a>
			Your GIV tokens are in your wallet.
		</span>,
	);
}
export default ClaimCard;
