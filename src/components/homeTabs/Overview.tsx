import styled from 'styled-components';
import { TabContainer } from './commons';

import { H1, H2, H3, P, H4 } from '../styled-components/Typography';
import { Row } from '../styled-components/Grid';
import { Button } from '../styled-components/Button';
import router from 'next/router';
import { Container } from '../styled-components/Grid';

const OverviewTabContainer = styled(TabContainer)`
	position: relative;
	::after {
		content: url('/images/homebg2.png');
		position: absolute;
		top: 0;
		right: 0;
	}
`;


export const TabOverviewTop = () => {
	return (
		<WelcomeSection>
			<Container>
				<PreTitle as="span">Welcome to the</PreTitle>
				<Title>Giveth Economy</Title>
				<SubTitle size='medium'>
					The Giveth Economy is the collective of projects, donors, builders,
					 and community members building the Future of Giving.
				</SubTitle>
			</Container>
		</WelcomeSection>
	);
}

const WelcomeSection = styled.div`
	background-image: url('/images/Giv.png');
	background-size: cover;
	// background-repeat: no-repeat;
	// min-height: calc(100vh - 228px);
`;

const Title = styled(H1)`
	font-size: 107px;
	padding-bottom: 42px;
	max-width: 989px;
`;

const PreTitle = styled(H1)`
	color: #A3B0F6;
	font-size: 88px;
	padding-top: 66px;
	padding-bottom: 42px;
	max-width: 798px;
`;

const SubTitle = styled(P)`
	max-width: 828px;
	padding-bottom: 156px;
`;

export const TabOverviewBottom = () => {
	const goToClaim = () => {
		router.push('/claim');
	};

	return (
		<OverviewTabContainer>
			<IntroSection>
				<Container>
					<TabTitle>The Economy of Giving</TabTitle>
					<TabDesc size='medium'>
						Giveth is building a future in which giving is
						effortless and people all around the world are rewarded
						for creating positive change.
					</TabDesc>
					<Row wrap={1}>
						<GivCard>
							<H3>GIV Token</H3>
							<GivCardSub>DONATE, EARN, GOVERN</GivCardSub>
							<P size='xsmall'>
								GIV fuels and directs the Future of Giving,
								inspiring people to become Givers and
								participate in an ecosystem of collective
								support, abundance, and value-creation.
							</P>
						</GivCard>
						<GivCard>
							<H3>GIVbacks</H3>
							<GivCardSub>GIVE AND RECEIVE</GivCardSub>
							<P size='xsmall'>
								GIVbacks is a revolutionary concept that
								incentives donations to verified projects on
								Giveth.
							</P>
						</GivCard>
					</Row>
				</Container>
			</IntroSection>
			<ParticipateSection>
				<Container>
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
								<strong>Giving Economy</strong>. Propose and
								vote to help shape the Future of Giving.
							</ParticipateDesc>
							<ParticipateButton>See proposals</ParticipateButton>
							<ParticipateSubDesc>
								Earn GIV by voting on proposals and
								participating in Giveth governance.
							</ParticipateSubDesc>
						</ParticipateCard>
						<ParticipateCard>
							<ParticipateCardTitle>Give</ParticipateCardTitle>
							<ParticipateDesc size='xsmall'>
								Get GIVbacks by donating to verified projects on
								Giveth. Empower change-makers that are working
								hard to make a difference.{' '}
							</ParticipateDesc>
							<ParticipateButton>
								Donate to projects
							</ParticipateButton>
							<ParticipateSubDesc>
								Earn GIV by donating to verified projects on
								Giveth.{' '}
							</ParticipateSubDesc>
						</ParticipateCard>
					</Row>
				</Container>
			</ParticipateSection>
			<Container>
				<Section3>
					<ClaimCard>
						<ClaimCardTitle>Claim your GIV tokens</ClaimCardTitle>
						<P size='small'>
							Connect your wallet or check an ethereum address to
							see your rewards.
						</P>
						<ClaimCardButton secondary onClick={goToClaim}>
							CLAIM YOUR GIV
						</ClaimCardButton>
					</ClaimCard>
				</Section3>
			</Container>
		</OverviewTabContainer>
	);
};

const IntroSection = styled.section`
	padding-top: 80px;
`;

const GivCard = styled.div`
	padding-right: 180px;
	flex: 1;
`;

const ParticipateCard = styled.div`
	flex: 1;
	padding-right: 76px;
`;

const ParticipateButton = styled(Button)`
	width: 280px;
`;

const ParticipateDesc = styled(P)`
	height: 198px;
	width: 322px;
`;

const ParticipateSubDesc = styled.p`
	font-size: 15px;
	font-style: normal;
	font-weight: 400;
	line-height: 22px;
	letter-spacing: 0em;
	text-align: left;
	color: #c4b2ff;
	width: 280px;
`;

const ClaimCardButton = styled(Button)`
	width: 300px;
	margin-top: 36px;
	margin-bottom: 36px;
`;

const TabTitle = styled(H2)`
	margin-bottom: 30px;
`;

const TabDesc = styled(P)`
	margin-bottom: 132px;
	width: 812px;
`;

const GivCardSub = styled(P)`
	margin-bottom: 32px;
`;

const ParticipateSection = styled.div`
	background-image: url('/images/homebg3.png');
	background-size: cover;
	background-repeat: no-repeat;
	padding-top: 280px;
	padding-bottom: 180px;
`;

const Section2Title = styled(H2)`
	margin-bottom: 60px;
`;

const ParticipateCardTitle = styled(H3)`
	margin-bottom: 32px;
`;

const Section3 = styled.div`
	padding-top: 180px;
	min-height: 100vh;
`;

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
`;
const ClaimCardTitle = styled(H2)`
	margin-bottom: 22px;
`;
