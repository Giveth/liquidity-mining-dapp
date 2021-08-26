import { FC, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { WalletAddressInputWithButton } from '../input'
import { Button } from '../styled-components/Button'
import { Row } from '../styled-components/Grid'
import { H2, P } from '../styled-components/Typography'
import { ArrowButton, Card, Header, ICardProps } from './common'
import { OnboardContext } from '../../context/onboard.context'
import { UserContext } from '../../context/user.context'

const ConnectCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/connect.png');
		position: absolute;
		width: 473px;
		height: 210px;
		top: 0;
		right: 0;
	}
`
const Title = styled(H2)`
	width: 600px;
`

const Desc = styled(P)`
	margin-top: 22px;
`

const ConenctButton = styled(Button)`
	width: 300px;
`

const Span = styled.div`
	display: inline-block;
	font-size: 20px;
	line-height: 26px;
	text-transform: uppercase;
`

const InputWithButtonContainer = styled.div`
	width: 588px;
`

const SuccessArrowButton = styled(ArrowButton)`
	right: 300px;
	bottom: 260px;
`

enum GiveDropStateType {
	notConnected,
	Success,
	Missed,
}

export const ConnectCard: FC<ICardProps> = ({ activeIndex, index }) => {
	const { address, changeWallet = () => {} } = useContext(OnboardContext)
	const { submitUserAddress } = useContext(UserContext)

	const [walletAddress, setWalletAddress] = useState<string>('')
	const [giveDropState, setGiveDropState] = useState<GiveDropStateType>(
		GiveDropStateType.Success,
	)

	useEffect(() => {
		setWalletAddress(address)
	}, [address])

	const submitAddress = async (value: string): Promise<void> => {
		await submitUserAddress(value)
	}

	let title
	let desc
	let btnLabel
	switch (giveDropState) {
		case GiveDropStateType.notConnected:
			title = 'Claim your GIVdrop'
			desc =
				'Connect your wallet or check an ethereum address to see your rewards.'
			btnLabel = 'CONNECT WALLET'
			break
		case GiveDropStateType.Success:
			title = `You have ${333} GIV to claim.`
			desc = 'Congrats, your GIVdrop awaits. Go claim it!'
			break
		case GiveDropStateType.Missed:
			title = 'You missed the GIVdrop'
			desc =
				'But there are more ways to get GIV. Try another address or learn how to earn GIV.'
			btnLabel = 'CHANGE WALLET'
			break
		default:
			break
	}

	return (
		<ConnectCardContainer activeIndex={activeIndex} index={index}>
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
						/>
					</InputWithButtonContainer>
				</Row>
			)}
			{giveDropState === GiveDropStateType.Missed && <ArrowButton />}
			{giveDropState === GiveDropStateType.Success && (
				<SuccessArrowButton />
			)}
		</ConnectCardContainer>
	)
}

export default ConnectCard
