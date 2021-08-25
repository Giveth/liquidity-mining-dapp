import { useState, ChangeEvent, FC } from 'react'
import styled from 'styled-components'
import { InputWithUnit } from '../input'
import { Row } from '../styled-components/Grid'
import { H2, H4, P } from '../styled-components/Typography'
import { Card, Header, ICardProps, MaxGIV } from './common'

const DonateCardContainer = styled(Card)`
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

const DonateRow = styled(Row)`
	padding: 20px 0;
	height: 208px;
`

const DonateLabel = styled.span`
	color: #cabaff;
`

const DonateInput = styled.div`
	width: 392px;
`

const GetBack = styled(DonateRow)`
	padding-left: 124px;
`

const DonateGIVEarn = styled.div`
	font-family: Red Hat Text;
	font-size: 48px;
	font-style: normal;
	font-weight: 700;
	line-height: 80px;
	letter-spacing: 0em;
	text-align: left;
`

const DonateHeader = styled(Header)`
	margin-bottom: 16px;
`

export const DonateCard: FC<ICardProps> = ({ activeIndex, index }) => {
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
		<DonateCardContainer activeIndex={activeIndex} index={index}>
			<DonateHeader>
				<Title as='h1'>Give GIV to get GIVbacks!</Title>
				<Description size='small' color={'#CABAFF'}>
					Donate to verified projects on Giveth to earn more GIV with
					GIVbacks.
				</Description>
			</DonateHeader>
			<Row alignItems={'center'} justifyContent={'flex-start'}>
				<DonateRow
					flexDirection='column'
					justifyContent='space-between'
				>
					<H4 as='h2'>If you donate GIV</H4>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<DonateLabel>Your donation</DonateLabel>
							<MaxGIV>{`Max ${333} GIV`}</MaxGIV>
						</Row>
						<DonateInput>
							<InputWithUnit
								value={donation}
								unit={'GIV'}
								onChange={stackedChangeHandler}
							/>
						</DonateInput>
					</div>
				</DonateRow>
				<GetBack flexDirection='column' justifyContent='space-between'>
					<H4 as='h2'>You can get back</H4>
					<div>
						<DonateLabel>GIV Tokens</DonateLabel>
						<DonateGIVEarn>{donation}</DonateGIVEarn>
					</div>
				</GetBack>
			</Row>
		</DonateCardContainer>
	)
}
