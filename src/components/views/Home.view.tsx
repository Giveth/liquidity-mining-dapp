import styled from 'styled-components'
import { H1, H2, H3, P } from '../styled-components/Typography'
import { Row } from '../styled-components/Grid'
import { Button } from '../styled-components/Button'
import router from 'next/router'
import Header from '../Header'

const Section = styled.section`
	padding: 0 132px;
	min-height: 100vh;
`

const GivCard = styled.div`
	padding-right: 180px;
	flex: 1;
`

// eslint-disable-next-line no-unused-vars
const Container = styled.div`
	padding: 0 140px;
`

const ParticipateCard = styled.div`
	flex: 1;
	padding-right: 76px;
`

const ParticipateButton = styled(Button)`
	width: 280px;
`

const ParticipateDesc = styled(P)`
	height: 198px;
	width: 322px;
`

const ParticipateSubDesc = styled.p`
	font-size: 15px;
	font-style: normal;
	font-weight: 400;
	line-height: 22px;
	letter-spacing: 0em;
	text-align: left;
	color: #c4b2ff;
	width: 280px;
`

const ClaimCardButton = styled(Button)`
	width: 300px;
	margin-top: 36px;
	margin-bottom: 36px;
`

const Section1 = styled(Section)`
	background-image: url('/images/Giv.png');
	background-size: contain;
	::after {
		content: url('/images/homebg2.png');
		position: absolute;
		bottom: -1000px;
		right: 0;
	}
`

const Title = styled(H1)`
	padding-top: 66px;
	padding-bottom: 42px;
	max-width: 989px;
`

const SubTitle = styled(P)`
	max-width: 912px;
	padding-bottom: 288px;
`

const EconomyTitle = styled(H2)`
	margin-bottom: 30px;
`

const EconomyDesc = styled(P)`
	margin-bottom: 132px;
	width: 812px;
`

const GivCardSub = styled(P)`
	margin-bottom: 32px;
`

const Section2 = styled(Section)`
	background-image: url('/images/homebg3.png');
	background-size: contain;
	padding-top: 180px;
	padding-bottom: 180px;
`

const Section2Title = styled(H2)`
	margin-bottom: 60px;
`

const ParticipateCardTitle = styled(H3)`
	margin-bottom: 32px;
`

const Section3 = styled(Section)`
	padding-top: 180px;
`

const ClaimCard = styled.div`
	background-color: #3c14c5;
	padding: 105px 146px;
	background-image: url('/images/GIVGIVGIV.png');
	background-repeat: no-repeat;
	background-size: cover;
	min-height: 480px;
	position: relative;
	::before {
		content: url('/images/pie1.png');
		position: absolute;
		top: 0;
		right: 0;
	}
	::after {
		content: url('/images/pie2.png');
		position: absolute;
		bottom: -4px;
		left: 0;
	}
`

const ClaimCardTitle = styled(H2)`
	margin-bottom: 22px;
`

function HomeView() {
	const goToClaim = () => {
		router.push('/claim')
	}

	return (
		<>
			<Header />
			<Section1>
				<Title>Welcome to the Giveth Economy</Title>
				<SubTitle size='large'>
					The Giveth Economy is the collective of projects, donors,
					builders, and community members building the Future of
					Giving.
				</SubTitle>
				<EconomyTitle>The Economy of Giving</EconomyTitle>
				<EconomyDesc size='medium'>
					Giveth is building a future in which giving is effortless
					and people all around the world are rewarded for creating
					positive change.
				</EconomyDesc>
				<Row wrap={1}>
					<GivCard>
						<H3>GIV Token</H3>
						<GivCardSub>DONATE, EARN, GOVERN</GivCardSub>
						<P size='xsmall'>
							GIV fuels and directs the Future of Giving,
							inspiring people to become Givers and participate in
							an ecosystem of collective support, abundance, and
							value-creation.
						</P>
					</GivCard>
					<GivCard>
						<H3>GIVbacks</H3>
						<GivCardSub>GIVE AND RECEIVE</GivCardSub>
						<P size='xsmall'>
							GIVbacks is a revolutionary concept that incentives
							donations to verified projects on Giveth.
						</P>
					</GivCard>
				</Row>
			</Section1>
			<Section2>
				<Section2Title>How to participate</Section2Title>
				<Row wrap={1}>
					<ParticipateCard>
						<ParticipateCardTitle>Earn</ParticipateCardTitle>
						<ParticipateDesc size='xsmall'>
							Participate in GIVmining by adding liquidity and
							generating even more GIV in rewards.
						</ParticipateDesc>
						<ParticipateButton>
							Add Liquidty and Earn
						</ParticipateButton>
						<ParticipateSubDesc>
							Earn GIV by providing liquidity. Up to 140% APR
							waits for you.
						</ParticipateSubDesc>
					</ParticipateCard>
					<ParticipateCard>
						<ParticipateCardTitle>Govern</ParticipateCardTitle>
						<ParticipateDesc size='xsmall'>
							Stake GIV in the GIVgarden to participate in
							governance of the &nbsp;
							<strong>Giving Economy</strong>. Propose and vote to
							help shape the Future of Giving.
						</ParticipateDesc>
						<ParticipateButton>See proposals</ParticipateButton>
						<ParticipateSubDesc>
							Earn GIV by voting on proposals and participating in
							Giveth governance.
						</ParticipateSubDesc>
					</ParticipateCard>
					<ParticipateCard>
						<ParticipateCardTitle>Give</ParticipateCardTitle>
						<ParticipateDesc size='xsmall'>
							Get GIVbacks by donating to verified projects on
							Giveth. Empower change-makers that are working hard
							to make a difference.{' '}
						</ParticipateDesc>
						<ParticipateButton>
							Donate to projects
						</ParticipateButton>
						<ParticipateSubDesc>
							Earn GIV by donating to verified projects on Giveth.{' '}
						</ParticipateSubDesc>
					</ParticipateCard>
				</Row>
			</Section2>
			<Section3>
				<ClaimCard>
					<ClaimCardTitle>Claim your GIV tokens</ClaimCardTitle>
					<P size='small'>
						Connect your wallet or check an ethereum address to see
						your rewards.
					</P>
					<ClaimCardButton secondary onClick={goToClaim}>
						CLAIM YOUR GIV
					</ClaimCardButton>
				</ClaimCard>
			</Section3>
		</>
	)
}

export default HomeView
