import { useState, ChangeEvent, FC } from 'react'
import styled from 'styled-components'
import { InputWithUnit } from '../input'
import { Row } from '../styled-components/Grid'
import { H2, H4, P } from '../styled-components/Typography'
import { ArrowButton, Card, Header, ICardProps, MaxGIV } from './common'

const StreamCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/donate.png');
		position: absolute;
		width: 305px;
		height: 333px;
		top: 0;
		right: 0;
		z-index: 0;
	}
`

const Title = styled(H2)`
	width: 577px;
`

const Description = styled(P)`
	width: 577px;
`

const StreamRow = styled(Row)`
	padding: 20px 0;
	height: 208px;
`

const StreamLabel = styled.span`
	color: #cabaff;
`

const StreamInput = styled.div`
	width: 392px;
`

const GetBack = styled(StreamRow)`
	padding-left: 124px;
`

const StreamGIVEarn = styled.div`
	font-family: Red Hat Text;
	font-size: 48px;
	font-style: normal;
	font-weight: 700;
	line-height: 80px;
	letter-spacing: 0em;
	text-align: left;
`

const StreamHeader = styled(Header)`
	margin-bottom: 16px;
`

export const StreamCard: FC<ICardProps> = ({ activeIndex, index }) => {
	const [donation, setDonation] = useState(0)

	const stackedChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length === 0) {
			setDonation(0)
		} else if (isNaN(+e.target.value)) {
			setDonation(donation)
		} else {
			setDonation(+e.target.value)
		}
	}

	return (
		<StreamCardContainer activeIndex={activeIndex} index={index}>
			<StreamHeader>
				<Title as='h1'>Give GIV to get GIVbacks!</Title>
				<Description size='small' color={'#CABAFF'}>
					Welcome to ever-expanding GIViverse. A GIVstream of 16.4
					GIV/day will be streamed continuously until September 21,
					2026. Increase your flowrate by earning more GIV!
				</Description>
			</StreamHeader>
			<ArrowButton />
		</StreamCardContainer>
	)
}
