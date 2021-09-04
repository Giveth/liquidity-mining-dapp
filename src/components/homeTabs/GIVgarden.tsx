import styled from 'styled-components';
import { TabContainer } from './commons';

import { H2, H3, P } from '../styled-components/Typography';
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

const TabGIVgarden = () => {
	const goToClaim = () => {
		router.push('/claim');
	};

	return (
		<OverviewTabContainer>
			<IntroSection>
				<Container>
					<TabTitle>GIVgarden</TabTitle>
					<TabDesc size='medium'>
						The GIVgarden is the decentralized governance platform
						for the GIVeconomy.
					</TabDesc>
					<Row wrap={1}>
						<GivCard>
							<H3>Vote</H3>
							<P size='xsmall'>
								GIV token holders control the treasury, roadmap
								and mission of the Giveth ecosystem.
							</P>
							<ParticipateButton secondary>
								Govern
							</ParticipateButton>
						</GivCard>
						<GivCard>
							<H3>Earn</H3>
							<P size='xsmall'>
								By voting in the GIVgarden you earn rewards on
								your staked GIV!
							</P>
						</GivCard>
					</Row>
				</Container>
			</IntroSection>
			<ParticipateSection>
				<Container>
					<Section2Title>Three Pillars of Governance</Section2Title>
					<Row wrap={1}>
						<ParticipateCard>
							<ParticipateCardTitle>
								Conviction Voting
							</ParticipateCardTitle>
							<ParticipateDesc size='xsmall'>
								A token-weighted decision making process in
								which voting power is accrued as a function of
								the number of tokens staked and time.
							</ParticipateDesc>
							<ParticipateButton>learn more</ParticipateButton>
						</ParticipateCard>
						<ParticipateCard>
							<ParticipateCardTitle>
								Covenant
							</ParticipateCardTitle>
							<ParticipateDesc size='xsmall'>
								A decentralized social contract that outlines
								standards for on-chain and off-chain community
								behaviour.
							</ParticipateDesc>
							<ParticipateButton>read covenant</ParticipateButton>
						</ParticipateCard>
						<ParticipateCard>
							<ParticipateCardTitle>Celeste</ParticipateCardTitle>
							<ParticipateDesc size='xsmall'>
								A decentralized dispute resolution court that
								judges proposals challenged for not being in
								line with community values.
							</ParticipateDesc>
							<ParticipateButton>
								explore celeste
							</ParticipateButton>
						</ParticipateCard>
					</Row>
				</Container>
			</ParticipateSection>
			<Container>
				<Section3>
					<ClaimCard>
						<ClaimCardTitle>Vote in the GIVgarden</ClaimCardTitle>
						<P size='small'>
							The GIVgarden empowers the Giveth community to
							coordinate around shared resources from the bottom
							up.
						</P>
						<ClaimCardButton secondary onClick={goToClaim}>
							govern
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
	padding-right: 32px;
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

export default TabGIVgarden;
