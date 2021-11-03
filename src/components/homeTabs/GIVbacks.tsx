import React, { useState } from 'react';
import { Row } from '../styled-components/Grid';
import router from 'next/router';
import {
	Button,
	Container,
	IconExternalLink,
	IconGIVBack,
	P,
	Title,
	brandColors,
} from '@giveth/ui-design-system';
import {
	GIVbacksTopContainer,
	GIVbacksBottomContainer,
	GIVbackRewardCard,
	Left,
	Right,
	GBSubtitle,
	GBTitle,
	GbDataBlock,
	GbButton,
	GIVBackCard,
	RoundSection,
	RoundTitle,
	RoundInfo,
	RoundInfoRow,
	RoundInfoTallRow,
	RoundButton,
	InfoSection,
	InfoImage,
	InfoTitle,
	InfoDesc,
	GivAllocated,
	InfoReadMore,
} from './GIVbacks.sc';

export const TabGIVbacksTop = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<GIVbacksTopContainer>
			<Container>
				<Row justifyContent='space-between'>
					<Left>
						<Row alignItems='baseline' gap='16px'>
							<GBTitle>GIVbacks</GBTitle>
							<IconGIVBack size={64} />
						</Row>
						<GBSubtitle size='medium'>
							GIVbacks is a revolutionary concept that rewards
							donors to verified projects with GIV tokens.
						</GBSubtitle>
					</Left>
					<Right>
						<GIVbackRewardCard
							amount={257.9055}
							actionLabel='HARVEST'
							actionCb={() => {
								setShowModal(true);
							}}
						/>
					</Right>
				</Row>
			</Container>
		</GIVbacksTopContainer>
	);
};

export const TabGIVbacksBottom = () => {
	const goToClaim = () => {
		router.push('/claim');
	};

	return (
		<GIVbacksBottomContainer>
			<Container>
				<Row wrap={1} justifyContent='space-between'>
					<GbDataBlock
						title='Donor Rewards'
						button={
							<GbButton
								label='DONATE TO EARN GIV'
								buttonType='secondary'
								size='large'
							/>
						}
					>
						Empower change-makers and get rewarded for making a
						difference! When you donate to verified projects, you
						become eligible to receive GIV from GIVbacks.
					</GbDataBlock>
					<GbDataBlock
						title='Project Verification'
						button={
							<GbButton
								label='VERIFY YOUR PROJECT'
								buttonType='secondary'
								size='large'
							/>
						}
					>
						Great projects make the GIVeconomy thrive! As a project
						owner, when you get your project verified, your donors
						become eligible to receive GIVbacks.
					</GbDataBlock>
				</Row>
				<GIVBackCard>
					<Row justifyContent='space-between' alignItems='center'>
						<RoundSection>
							<RoundTitle>GIVback Round 8</RoundTitle>
							<RoundInfo>
								<RoundInfoRow justifyContent='space-between'>
									<P>Start Date</P>
									<P>October 31, 2021</P>
								</RoundInfoRow>
								<RoundInfoRow justifyContent='space-between'>
									<P>End Date</P>
									<P>November 14, 2021 </P>
								</RoundInfoRow>
								<RoundInfoTallRow
									justifyContent='space-between'
									alignItems='center'
								>
									<P>GIV Allocated to Round</P>
									<GivAllocated>133,291</GivAllocated>
								</RoundInfoTallRow>
								<RoundButton
									size='small'
									label={'DONATE TO EARN GIV'}
									buttonType='primary'
								/>
							</RoundInfo>
						</RoundSection>
						<InfoSection>
							<InfoImage src='/images/hands.svg' />
							<InfoTitle weight={700}>
								When you give you get GIV back!
							</InfoTitle>
							<InfoDesc>
								GIVbacks rounds last two weeks. After the End
								Date, the GIV Allocated to Round will be
								distributed to Givers who donated to verified
								project during the round. Projects must apply
								for verification at least 1 week prior to the
								Start Date in order to be included in the round.
							</InfoDesc>
							<InfoReadMore>
								Read More{' '}
								<IconExternalLink
									size={16}
									color={brandColors.cyan[500]}
								/>
							</InfoReadMore>
						</InfoSection>
					</Row>
				</GIVBackCard>
			</Container>
		</GIVbacksBottomContainer>
		// 	<Container>
		// 		<TabTitle weight={700}>The Economy of Giving</TabTitle>
		// 		<TabDesc size='medium'>
		// 			Giveth is building a future in which giving is effortless
		// 			and people all around the world are rewarded for creating
		// 			positive change.
		// 		</TabDesc>
		// 		<Row wrap={1} justifyContent='space-between'>
		// 			<EGDataBlock
		// 				title='GIV Token'
		// 				subtitle='Donate, earn, govern'
		// 				button={
		// 					<Button
		// 						label='CLAIM YOUR GIV'
		// 						buttonType='primary'
		// 					/>
		// 				}
		// 				icon={<IconGiveth size={32} />}
		// 			>
		// 				GIV fuels and directs the Future of Giving, inspiring
		// 				people to become Givers and participate in an ecosystem
		// 				of collective support, abundance, and value-creation.
		// 			</EGDataBlock>
		// 			<EGDataBlock title='GIVbacks' subtitle='GIVE AND RECEIVE'>
		// 				Giveth is a donor owned and governed economy. With
		// 				GIVbacks, we reward donors to verified projects on
		// 				Giveth with GIV tokens.
		// 			</EGDataBlock>
		// 			<EGDataBlock title='GIVstream' subtitle='Get more GIV'>
		// 				Welcome to the expanding GIViverse! With the GIVstream,
		// 				our community members become long-term stakeholders in
		// 				the Future of Giving.
		// 			</EGDataBlock>
		// 		</Row>
		// 		<Section2Title>How to participate</Section2Title>
		// 		<Row wrap={1} justifyContent='space-between'>
		// 			<ParticipateDataBlock
		// 				title='Give'
		// 				button={<Button label='Donate to projects' />}
		// 			>
		// 				Donate to empower change-makers that are working hard to
		// 				make a difference. Get GIVbacks when you donate to
		// 				verified projects.
		// 			</ParticipateDataBlock>
		// 			<ParticipateDataBlock
		// 				title='Govern'
		// 				button={<Button label='See proposals' />}
		// 			>
		// 				The GIVeconomy empowers our collective of projects,
		// 				donors, builders and community members to build the
		// 				Future of Giving.
		// 			</ParticipateDataBlock>
		// 			<ParticipateDataBlock
		// 				title='Earn'
		// 				button={<Button label='Add Liquidty and Earn' />}
		// 			>
		// 				Become a liquidity provider and stake tokens in the
		// 				GIVfarm to generate even more GIV in rewards.
		// 			</ParticipateDataBlock>
		// 		</Row>
		// 		<ClaimCard>
		// 			<ClaimCardTitle weight={900}>
		// 				Claim your GIV tokens
		// 			</ClaimCardTitle>
		// 			<ClaimCardQuote size='small'>
		// 				Connect your wallet or check an ethereum address to see
		// 				your rewards.
		// 			</ClaimCardQuote>
		// 			<ClaimCardButton
		// 				label='CLAIM YOUR GIV'
		// 				buttonType='primary'
		// 			></ClaimCardButton>
		// 		</ClaimCard>
		// 	</Container>
	);
};
