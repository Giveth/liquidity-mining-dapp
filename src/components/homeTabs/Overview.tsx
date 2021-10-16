import React from 'react';
import { Row } from '../styled-components/Grid';
import router from 'next/router';
import { Container, H3, P } from '@giveth/ui-design-system';
import {
	OverviewTopContainer,
	PreTitle,
	OverviewTitle,
	OverviewBottomContainer,
	IntroSection,
	ClaimCard,
	ClaimCardButton,
	ClaimCardTitle,
	GivCard,
	GivCardSub,
	ParticipateButton,
	ParticipateCard,
	ParticipateCardTitle,
	ParticipateDesc,
	ParticipateSection,
	ParticipateSubDesc,
	Section2Title,
	Section3,
	TabDesc,
	TabTitle,
	SubTitle,
} from './Overview.sc';

export const TabOverviewTop = () => {
	return (
		<OverviewTopContainer>
			<Container>
				<PreTitle as='span'>Welcome to the</PreTitle>
				<OverviewTitle>Giveth Economy</OverviewTitle>
				<SubTitle size='medium'>
					The Giveth Economy is the collective of projects, donors,
					builders, and community members building the Future of
					Giving.
				</SubTitle>
			</Container>
		</OverviewTopContainer>
	);
};

export const TabOverviewBottom = () => {
	const goToClaim = () => {
		router.push('/claim');
	};

	return (
		<OverviewBottomContainer>
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
							<P>
								GIV fuels and directs the Future of Giving,
								inspiring people to become Givers and
								participate in an ecosystem of collective
								support, abundance, and value-creation.
							</P>
						</GivCard>
						<GivCard>
							<H3>GIVbacks</H3>
							<GivCardSub>GIVE AND RECEIVE</GivCardSub>
							<P>
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
							<ParticipateButton label='Add Liquidty and Earn' />
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
							<ParticipateButton label='See proposals' />
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
							<ParticipateButton label='Donate to projects' />
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
						<P>
							Connect your wallet or check an ethereum address to
							see your rewards.
						</P>
						<ClaimCardButton label='CLAIM YOUR GIV'></ClaimCardButton>
					</ClaimCard>
				</Section3>
			</Container>
		</OverviewBottomContainer>
	);
};
