import { FC, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { WalletAddressInputWithButton } from '../input';
import { Button } from '../styled-components/Button';
import { Row } from '../styled-components/Grid';
import { H2, P } from '../styled-components/Typography';
import { ArrowButton, Card, Header, ICardProps } from './common';
import { OnboardContext } from '../../context/onboard.context';
import { UserContext } from '../../context/user.context';
import { ethers } from 'ethers';

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
	width: 600px;
`;

const Desc = styled(P)`
	margin-top: 22px;
`;

const ConenctButton = styled(Button)`
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

const SuccessArrowButton = styled(ArrowButton)`
	right: 300px;
	bottom: 260px;
`;

const EarnGiv = styled.span`
	font-family: 'red-hat';
	font-size: 16px;
	font-style: normal;
	font-weight: 700;
	line-height: 13px;
	letter-spacing: 0.04em;
	text-align: center;

	position: absolute;
	right: 54px;
	top: 494px;
`;

enum GiveDropStateType {
	notConnected,
	Success,
	Missed,
}

export const ConnectCard: FC<ICardProps> = ({ activeIndex, index }) => {
	const { address, changeWallet = () => {} } = useContext(OnboardContext);
	const { submitUserAddress, claimableAmount } = useContext(UserContext);

	const [walletAddress, setWalletAddress] = useState<string>('');
	const [giveDropState, setGiveDropState] = useState<GiveDropStateType>(
		GiveDropStateType.notConnected,
	);
	const [addressSubmitted, setAddressSubmitted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setWalletAddress(address);
	}, [address]);

	useEffect(() => {
		if (addressSubmitted) {
			console.log(
				'claimableAmount:',
				ethers.utils.formatEther(claimableAmount),
			);

			setGiveDropState(
				claimableAmount.isZero()
					? GiveDropStateType.Missed
					: GiveDropStateType.Success,
			);

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
				'Connect your wallet or check an ethereum address to see your rewards.';
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
			title = `You have ${ethers.utils.formatEther(
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
			desc =
				'But there are more ways to get GIV. Try another address or learn how to earn GIV.';
			btnLabel = 'CHANGE WALLET';
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
			{giveDropState !== GiveDropStateType.Success && (
				<Row alignItems={'center'} justifyContent={'space-between'}>
					<ConenctButton secondary onClick={changeWallet}>
						{btnLabel}
					</ConenctButton>
					<Span>or</Span>
					<InputWithButtonContainer>
						<WalletAddressInputWithButton
							btnLable='Check'
							placeholder='Enter an address to check your GIVdrop'
							walletAddress={walletAddress}
							onSubmit={submitAddress}
							disabled={loading}
							onUpdate={() => {
								setGiveDropState(
									GiveDropStateType.notConnected,
								);
							}}
						/>
					</InputWithButtonContainer>
				</Row>
			)}
			{giveDropState === GiveDropStateType.Missed && (
				<>
					<EarnGiv>How to earn GIV</EarnGiv>
					<ArrowButton />
				</>
			)}
			{giveDropState === GiveDropStateType.Success && (
				<SuccessArrowButton />
			)}
		</ConnectCardContainer>
	);
};

export default ConnectCard;
