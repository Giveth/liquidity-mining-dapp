import React from 'react';
import Link from 'next/link';
import { Row } from '../styled-components/Grid';
import router from 'next/router';
import { Container, Button } from '@giveth/ui-design-system';
import {
	OverviewTopContainer,
	PreTitle,
	OverviewTitle,
	OverviewBottomContainer,
	ClaimCard,
	ClaimCardButton,
	ClaimCardTitle,
	Section2Title,
	TabDesc,
	TabTitle,
	SubTitle,
	EGDataBlock,
	ParticipateDataBlock,
	ClaimCardQuote,
} from './Overview.sc';
import { IconGIV } from '../Icons/GIV';

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
			<Container>
				<TabTitle weight={700}>The Economy of Giving</TabTitle>
				<TabDesc size='medium'>
					Giveth is building a future in which giving is effortless
					and people all around the world are rewarded for creating
					positive change.
				</TabDesc>
				<Row wrap={1} justifyContent='space-between'>
					<EGDataBlock
						title='GIV Token'
						subtitle='Donate, earn, govern'
						button={
							<Button
								label='CLAIM YOUR GIV'
								buttonType='primary'
							/>
						}
						icon={<IconGIV size={32} />}
					>
						GIV fuels and directs the Future of Giving, inspiring
						people to become Givers and participate in an ecosystem
						of collective support, abundance, and value-creation.
					</EGDataBlock>
					<EGDataBlock title='GIVbacks' subtitle='GIVE AND RECEIVE'>
						Giveth is a donor owned and governed economy. With
						GIVbacks, we reward donors to verified projects on
						Giveth with GIV tokens.
					</EGDataBlock>
					<EGDataBlock title='GIVstream' subtitle='Get more GIV'>
						Welcome to the expanding GIViverse! With the GIVstream,
						our community members become long-term stakeholders in
						the Future of Giving.
					</EGDataBlock>
				</Row>
				<Section2Title>How to participate</Section2Title>
				<Row wrap={1} justifyContent='space-between'>
					<ParticipateDataBlock
						title='Give'
						button={<Button label='Donate to projects' />}
					>
						Donate to empower change-makers that are working hard to
						make a difference. Get GIVbacks when you donate to
						verified projects.
					</ParticipateDataBlock>
					<ParticipateDataBlock
						title='Govern'
						button={<Button label='See proposals' />}
					>
						The GIVeconomy empowers our collective of projects,
						donors, builders and community members to build the
						Future of Giving.
					</ParticipateDataBlock>
					<ParticipateDataBlock
						title='Earn'
						button={<Button label='Add Liquidty and Earn' />}
					>
						Become a liquidity provider and stake tokens in the
						GIVfarm to generate even more GIV in rewards.
					</ParticipateDataBlock>
				</Row>
				<ClaimCard>
					<ClaimCardTitle weight={900}>
						Claim your GIV tokens
					</ClaimCardTitle>
					<ClaimCardQuote size='small'>
						Connect your wallet or check an ethereum address to see
						your rewards.
					</ClaimCardQuote>
					<Link href='/claim' passHref>
						<ClaimCardButton
							label='CLAIM YOUR GIV'
							buttonType='primary'
						></ClaimCardButton>
					</Link>
				</ClaimCard>
			</Container>
		</OverviewBottomContainer>
	);
};
