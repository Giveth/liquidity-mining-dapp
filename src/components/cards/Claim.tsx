import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { Card, Header, PreviousArrowButton } from './common';
import { IClaimViewCardProps } from '../views/claim/Claim.view';
import useUser from '../../context/user.context';
import { OnboardContext } from '../../context/onboard.context';
import config from '../../configuration';
import { addGIVToken } from '@/lib/metamask';
import { WrongNetworkModal } from '@/components/modals/WrongNetwork';
import { GIVdropHarvestModal } from '../modals/GIVdropHarvestModal';
import { formatWeiHelper } from '@/helpers/number';
import type { TransactionResponse } from '@ethersproject/providers';
import { wrongWallet } from '../toasts/claim';
import { H2, Lead } from '@giveth/ui-design-system';

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

const ClaimCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { totalAmount, step, goPreviousStep, goNextStep } = useUser();
	const { isReady, connect, network, walletCheck } =
		useContext(OnboardContext);

	const [txStatus, setTxStatus] = useState<TransactionResponse | undefined>();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showClaimModal, setShowClaimModal] = useState<boolean>(false);

	useEffect(() => {
		setShowModal(
			isReady && network !== config.XDAI_NETWORK_NUMBER && step === 5,
		);
	}, [network, step, isReady]);

	const checkNetworkAndWallet = async () => {
		if (!isReady) {
			console.log('Wallet is not connected');
			await connect();
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
		setTxStatus(tx);
		goNextStep();
	};

	return (
		<>
			<ClaimCardContainer
				activeIndex={step}
				index={index}
				claimed={txStatus}
			>
				<ClaimHeader>
					<Title as='h1' weight={700}>
						Claim your GIV now!
					</Title>
					<Desc size='small' color={'#CABAFF'}>
						Let&apos;s Build the Future of Giving, together.
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
						CLAIM
					</ClaimButton>
				</Row>
				<Row alignItems={'center'} justifyContent={'center'}>
					<MetamaskButton
						onClick={() => addGIVToken(config.XDAI_NETWORK_NUMBER)}
					>
						<Image
							src='/images/metamask.png'
							height='32'
							width='215'
							alt='Metamask button'
						/>
					</MetamaskButton>
				</Row>
				{step === index && (
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
					givdropAmount={totalAmount}
					checkNetworkAndWallet={checkNetworkAndWallet}
					onSuccess={onSuccess}
				/>
			)}
		</>
	);
};

export default ClaimCard;
