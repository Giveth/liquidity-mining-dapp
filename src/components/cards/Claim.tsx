import { FC, useContext } from 'react';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { H2, P } from '../styled-components/Typography';
import { Card, Header } from './common';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import { Contract, ethers } from 'ethers';
import { UserContext } from '../../context/user.context';
import { toast } from 'react-hot-toast';
import { networksParams } from '../../helpers/blockchain';
import { OnboardContext } from '../../context/onboard.context';
import { isAddress } from 'ethers/lib/utils';
import config from '../../configuration';
import { abi as TOKEN_DISTRO_ABI } from '../../artifacts/TokenDistro.json';
import { claim } from '../../lib/claim';

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

const ClaimHeader = styled(Header)`
	margin: 116px auto 48px auto;
	text-align: center;
`;

const ClaimButton = styled(Button)`
	width: 356px;
`;

const ClaimCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex } = useContext(ClaimViewContext);
	const { userAddress, claimableAmount } = useContext(UserContext);
	const { isReady, changeWallet, connect, provider, network, walletCheck } =
		useContext(OnboardContext);

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
			const tx = await claim(userAddress, provider);

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
			<ClaimHeader>
				<H2 as='h1'>Claim your GIVdrop</H2>
				<P size='small' color={'#CABAFF'}>
					Claim your tokens and put them to good use.
				</P>
			</ClaimHeader>
			<Row alignItems={'center'} justifyContent={'center'}>
				<ClaimButton secondary onClick={onClaim}>
					CLAIM {ethers.utils.formatEther(claimableAmount)} GIV Tokens
				</ClaimButton>
			</Row>
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
