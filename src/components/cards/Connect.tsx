import { FC, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { WalletAddressInputWithButton } from '../input';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { H2, P } from '../styled-components/Typography';
import { ArrowButton, Card, Header } from './common';
import { OnboardContext } from '../../context/onboard.context';
import { UserContext, GiveDropStateType } from '../../context/user.context';
import { utils } from 'ethers';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';

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
`;
const Title = styled(H2)`
	width: 800px;
`;

const Desc = styled(P)`
	margin-top: 22px;
`;

const ConnectButton = styled(Button)`
	width: 300px;
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

const ClaimedRow = styled(Row)`
	gap: 50px;
`;

const ChangeWallet = styled.div`
	color: #fed670;
	cursor: pointer;
`;

const ClickableStrong = styled.strong`
	cursor: pointer;
`;

export const ConnectCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);

	const { address, changeWallet } = useContext(OnboardContext);
	const { submitUserAddress, claimableAmount, giveDropState, resetWallet } =
		useContext(UserContext);

	const [walletAddress, setWalletAddress] = useState<string>('');
	const [addressSubmitted, setAddressSubmitted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setWalletAddress(address);
	}, [address]);

	useEffect(() => {
		if (addressSubmitted) {
			setLoading(false);
			setAddressSubmitted(false);
		}
	}, [addressSubmitted, claimableAmount]);

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
			title = `You have ${utils.formatEther(
				claimableAmount,
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
					donate to verified projects to get{' '}
					<Link href='/givbacks' passHref>
						<ClickableStrong>GIV back</ClickableStrong>
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
			title = 'You already claimed!';
			desc =
				'It seems like you already claimed your GIVdrop with this address.';
			btnLabel = 'JOIN THE GIVECONOMY';
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

	return (
		<ConnectCardContainer activeIndex={activeIndex} index={index} data={bg}>
			<Header>
				<Title as='h1'>{title}</Title>
				<Desc size='small' color={'#CABAFF'}>
					{desc}
				</Desc>
			</Header>
			{giveDropState !== GiveDropStateType.Success &&
				giveDropState !== GiveDropStateType.Claimed && (
					<Row alignItems={'center'} justifyContent={'space-between'}>
						<ConnectButton
							secondary
							onClick={() => {
								changeWallet();
								submitAddress(walletAddress);
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
				activeIndex === index && <ArrowButton onClick={goNextStep} />}
			{giveDropState === GiveDropStateType.Claimed && (
				<>
					<ClaimedRow
						alignItems={'center'}
						justifyContent={'flex-start'}
					>
						<Link href='/' passHref>
							<ConnectButton secondary>{btnLabel}</ConnectButton>
						</Link>
						<ChangeWallet onClick={() => resetWallet()}>
							Try different wallet address
						</ChangeWallet>
					</ClaimedRow>
				</>
			)}
		</ConnectCardContainer>
	);
};

export default ConnectCard;
