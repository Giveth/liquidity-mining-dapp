import { FC, useContext, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { H2, P } from '../styled-components/Typography';
import { Card, Header } from './common';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import { utils } from 'ethers';
import { UserContext } from '../../context/user.context';
import { toast } from 'react-hot-toast';
import { networksParams } from '../../helpers/blockchain';
import { OnboardContext } from '../../context/onboard.context';
import config from '../../configuration';
import { claimAirDrop } from '../../lib/claim';

const ClaimCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/wave.png');
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
	const { activeIndex } = useContext(ClaimViewContext);
	const { userAddress, claimableAmount } = useContext(UserContext);
	const { isReady, changeWallet, connect, provider, network, walletCheck } =
		useContext(OnboardContext);

	const [txStatus, setTxStatus] = useState();

	const onClaim = async () => {
		if (!isReady) {
			console.log('Wallet is not connected');
			await connect();
			return;
		}

		if (!provider) {
			console.log('Connected wallet is not the claimed address');
			await changeWallet();
			return;
		}

		if (network !== config.XDAI_NETWORK_NUMBER) {
			await walletCheck();
			return;
		}

		try {
			const tx = await claimAirDrop(userAddress, provider);

			showPendingClaim(config.XDAI_NETWORK_NUMBER, tx.hash);

			const { status } = await tx.wait();

			if (status) {
				showConfirmedClaim(config.XDAI_NETWORK_NUMBER, tx.hash);
			} else {
				showFailedClaim(config.XDAI_NETWORK_NUMBER, tx.hash);
			}
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<ClaimCardContainer activeIndex={activeIndex} index={index}>
			{txStatus ? (
				<></>
			) : (
				<>
					<ClaimHeader>
						<Title as='h1'>Claim your GIV tokens now!</Title>
						<Desc size='small' color={'#CABAFF'}>
							Join the giving economy.
						</Desc>
					</ClaimHeader>
					<Row alignItems={'center'} justifyContent={'center'}>
						<ClaimButton secondary onClick={onClaim}>
							CLAIM {utils.formatEther(claimableAmount)} GIV
							Tokens
						</ClaimButton>
					</Row>
					<Row alignItems={'center'} justifyContent={'center'}>
						<MetamaskButton>
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
			! Your NODE tokens are in your wallet.
		</span>,
	);
}
export default ClaimCard;
