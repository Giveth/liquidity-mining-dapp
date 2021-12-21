import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { Card, Header, PreviousArrowButton } from './common';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import useUser from '../../context/user.context';
import { OnboardContext } from '../../context/onboard.context';
import config from '../../configuration';
import { addGIVToken } from '@/lib/metamask';
import { WrongNetworkModal } from '@/components/modals/WrongNetwork';
import { GIVdropHarvestModal } from '../modals/GIVdropHarvestModal';
import { formatWeiHelper } from '@/helpers/number';
import type { TransactionResponse } from '@ethersproject/providers';
import { wrongWallet } from '../toasts/claim';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { H2, Lead } from '@giveth/ui-design-system';
import SparkleBurstAnimation from '../../animations/sparkle-burst.json';
import SparkleAnimation from '../../animations/sparkle.json';
import Lottie from 'react-lottie';

const ClaimedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
`;

const SunImage = styled.div`
	position: absolute;
	height: 0px;
	left: 146px;
	top: 211px;
	@media only screen and (max-width: 1360px) {
		left: 71px;
		top: 180px;
	}
	@media only screen and (max-width: 1120px) {
		display: none;
	}
`;

const ClaimedTitle = styled.div`
	padding-top: 60px;
	font-family: 'Red Hat Text';
	font-size: 64px;
	font-weight: 700;
	text-align: center;
	@media only screen and (max-width: 1360px) {
		padding-top: 30px;
	}
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
	margin-top: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
`;

const ExploreButton = styled(SocialButton)`
	background-color: #e1458d;
	border: none;
	width: 285px;
`;

const ClaimFromAnother = styled.span`
	cursor: pointer;
	color: '#FED670'
	margin-top: 4px;
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

const Desc = styled(Lead)`
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

const SparkleContainer = styled.div`
	position: absolute;
	right: 232px;
	top: 73px;
	@media only screen and (max-width: 1360px) {
		right: 146px;
	}
	@media only screen and (max-width: 1120px) {
		right: 36px;
	}
`;

const SparkleBurstContainer = styled.div`
	position: absolute;
	left: 54px;
	top: 70px;
	@media only screen and (max-width: 1360px) {
	}
	@media only screen and (max-width: 1120px) {
		display: none;
	}
`;

const SparkleAnimationOptions = {
	loop: false,
	autoplay: false,
	animationData: SparkleAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const SparkleBurstAnimationOptions = {
	loop: false,
	autoplay: false,
	animationData: SparkleBurstAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const ClaimCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goFirstStep, goPreviousStep } =
		useContext(ClaimViewContext);
	const { userAddress, totalAmount, resetWallet } = useUser();
	const {
		isReady,
		changeWallet,
		connect,
		provider,
		network,
		walletCheck,
		address,
	} = useContext(OnboardContext);

	const [txStatus, setTxStatus] = useState<TransactionResponse | undefined>();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
	const [isClaimed, setIsClaimed] = useState(false);
	const [streamValue, setStreamValue] = useState<string>('0');

	const { tokenDistroHelper } = useTokenDistro();

	useEffect(() => {
		setStreamValue(
			formatWeiHelper(
				tokenDistroHelper.getStreamPartTokenPerWeek(totalAmount),
			),
		);
	}, [totalAmount, tokenDistroHelper]);

	useEffect(() => {
		setIsClaimed(false);
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

	const onSuccess = (tx: TransactionResponse) => {
		setIsClaimed(true);
		setTxStatus(tx);
	};

	return (
		<>
			<ClaimCardContainer
				activeIndex={activeIndex}
				index={index}
				claimed={txStatus}
			>
				{isClaimed ? (
					<>
						<SparkleBurstContainer>
							<Lottie
								options={SparkleBurstAnimationOptions}
								height={200}
								width={200}
							/>
						</SparkleBurstContainer>
						<SparkleContainer>
							<Lottie
								options={SparkleAnimationOptions}
								height={100}
								width={100}
							/>
						</SparkleContainer>
						<SunImage>
							<Image
								src='/images/union.svg'
								height='115'
								width='194'
								alt='union'
							/>
						</SunImage>
						<ClaimedContainer>
							<ClaimedTitle>Congratulations!</ClaimedTitle>
							<ClaimedSubtitleContainer>
								<ClaimedSubtitleA>
									You have successfully claimed{' '}
									{formatWeiHelper(totalAmount.div(10))} GIV.{' '}
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
								<ClaimedSubtitleB>
									Plus you&apos;re getting an additional{' '}
									<span style={{ color: '#FED670' }}>
										{streamValue} GIV
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
										setIsClaimed(false);
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
							<Title as='h1' weight={700}>
								Claim your GIV now!
							</Title>
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
								CLAIM {formatWeiHelper(totalAmount.div(10))} GIV
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
				{activeIndex === index && (
					<>
						<PreviousArrowButton onClick={goPreviousStep} />
					</>
				)}
			</ClaimCardContainer>
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
					txStatus={txStatus}
					givdropAmount={totalAmount}
					checkNetworkAndWallet={checkNetworkAndWallet}
					onSuccess={onSuccess}
				/>
			)}
		</>
	);
};

export default ClaimCard;
