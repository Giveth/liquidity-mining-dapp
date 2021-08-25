import { FC } from 'react'
import styled from 'styled-components'
import { InputWithButton } from '../input'
import { Button } from '../styled-components/Button'
import { Row } from '../styled-components/Grid'
import { H2, P } from '../styled-components/Typography'
import { Card, Header, ICardProps } from './common'

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

export const ConnectCard: FC<ICardProps> = ({ activeIndex, index }) => {
	return (
		<ConnectCardContainer activeIndex={activeIndex} index={index}>
			<Header>
				<H2 as='h1'>Claim your GIVdrop</H2>
				<P size='small' color={'#CABAFF'}>
					Connect your wallet or check an ethereum address to see your
					rewards.
				</P>
			</Header>
			<Row alignItems={'center'} justifyContent={'space-between'}>
				<ConenctButton secondary>CONNECT WALLET</ConenctButton>
				<Span>or</Span>
				<InputWithButtonContainer>
					<InputWithButton
						btnLable='Check'
						placeholder='Enter an address to check your GIVdrop'
					/>
				</InputWithButtonContainer>
			</Row>
		</ConnectCardContainer>
	)
}

export default ConnectCard
