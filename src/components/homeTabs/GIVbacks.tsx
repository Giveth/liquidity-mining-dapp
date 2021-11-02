import React, { useState } from 'react';
import { Row } from '../styled-components/Grid';
import router from 'next/router';
import {
	Container,
	IconGiveth,
	Button,
	IconGIVFarm,
	IconGIVBack,
} from '@giveth/ui-design-system';
import {
	GIVbacksTopContainer,
	GIVbacksBottomContainer,
	GIVbackRewardCard,
	Left,
	Right,
	Subtitle,
	Title,
	GbDataBlock,
} from './GIVbacks.sc';

export const TabGIVbacksTop = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<GIVbacksTopContainer>
			<Container>
				<Row justifyContent='space-between'>
					<Left>
						<Row alignItems='baseline' gap='16px'>
							<Title>GIVbacks</Title>
							<IconGIVBack size={64} />
						</Row>
						<Subtitle size='medium'>
							GIVbacks is a revolutionary concept that rewards
							donors to verified projects with GIV tokens.
						</Subtitle>
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
							<Button
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
							<Button
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
