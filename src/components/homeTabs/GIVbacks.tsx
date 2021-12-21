import React, { useState, useEffect, useContext } from 'react';
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
import { useTokenDistro } from '@/context/tokenDistro.context';
import { Zero } from '@ethersproject/constants';
import BigNumber from 'bignumber.js';
import { useBalances } from '@/context/balance.context';
import config from '@/configuration';
import { HarvestAllModal } from '../modals/HarvestAll';
import { OnboardContext } from '@/context/onboard.context';
import { getNowUnixMS } from '@/helpers/time';
import { useOnboard } from '@/context';
import { formatDate } from '@/lib/helpers';

export const TabGIVbacksTop = () => {
	const [showModal, setShowModal] = useState(false);
	const [givBackLiquidPart, setGivBackLiquidPart] = useState(Zero);
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	const { tokenDistroHelper } = useTokenDistro();
	const { xDaiBalance } = useBalances();
	const { network: walletNetwork } = useOnboard();

	useEffect(() => {
		setGivBackLiquidPart(
			tokenDistroHelper.getLiquidPart(xDaiBalance.givback),
		);
		setGivBackStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(xDaiBalance.givback),
		);
	}, [xDaiBalance, tokenDistroHelper]);

	return (
		<>
			<GIVbacksTopContainer>
				<Container>
					<Row justifyContent='space-between'>
						<Left>
							<Row alignItems='baseline' gap='16px'>
								<GBTitle>GIVbacks</GBTitle>
								<IconGIVBack size={64} />
							</Row>
							<GBSubtitle size='medium'>
								GIVbacks rewards donors to verified projects
								with GIV, super-charging Giveth as a
								donor-driven force for good.
							</GBSubtitle>
						</Left>
						<Right>
							<GIVbackRewardCard
								title='Your GIVbacks rewards'
								wrongNetworkText='GIVbacks is only available on xDAI.'
								liquidAmount={givBackLiquidPart}
								stream={givBackStream}
								actionLabel='HARVEST'
								actionCb={() => {
									setShowModal(true);
								}}
								network={walletNetwork}
								targetNetworks={[config.XDAI_NETWORK_NUMBER]}
							/>
						</Right>
					</Row>
				</Container>
			</GIVbacksTopContainer>
			{showModal && (
				<HarvestAllModal
					title='GIVbacks Rewards'
					showModal={showModal}
					setShowModal={setShowModal}
					network={config.XDAI_NETWORK_NUMBER}
				/>
			)}
		</>
	);
};

export const TabGIVbacksBottom = () => {
	const [round, setRound] = useState(0);
	const { tokenDistroHelper } = useTokenDistro();
	const { network: walletNetwork } = useContext(OnboardContext);

	useEffect(() => {
		if (tokenDistroHelper) {
			const now = getNowUnixMS();
			const deltaT = now - tokenDistroHelper.startTime.getTime();
			const TwoWeek = 1209600000;
			const _round = Math.floor(deltaT / TwoWeek) + 1;
			setRound(_round);
			tokenDistroHelper.endTime.setDate(
				tokenDistroHelper.startTime.getDate() + 14,
			);
		}
	}, [tokenDistroHelper]);

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
								onClick={() => {
									window.open(
										'https://giveth.io/projects',
										'_blank',
									);
								}}
							/>
						}
					>
						When you donate to verified projects you qualify to
						receive GIV tokens. Through GIVbacks, GIV empowers
						donors with governance rights via the GIVgarden.
					</GbDataBlock>
					<GbDataBlock
						title='Project Verification'
						button={
							<GbButton
								label='VERIFY YOUR PROJECT'
								buttonType='secondary'
								size='large'
								onClick={() => {
									window.open(
										'https://hlfkiwoiwhi.typeform.com/to/pXxk0HO5',
										'_blank',
									);
								}}
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
							<RoundTitle>GIVbacks Round {round}</RoundTitle>
							<RoundInfo>
								<RoundInfoRow justifyContent='space-between'>
									<P>Start Date</P>
									<P>
										{tokenDistroHelper
											? formatDate(
													tokenDistroHelper.startTime,
											  )
											: '-'}
									</P>
								</RoundInfoRow>
								<RoundInfoRow justifyContent='space-between'>
									<P>End Date</P>
									<P>
										{tokenDistroHelper
											? formatDate(
													tokenDistroHelper.endTime,
											  )
											: '-'}
									</P>
								</RoundInfoRow>
								<RoundInfoTallRow
									justifyContent='space-between'
									alignItems='center'
								>
									<P>GIV Allocated to Round</P>
									<GivAllocated>1 Million GIV</GivAllocated>
								</RoundInfoTallRow>
								<RoundButton
									size='small'
									label={'DONATE TO EARN GIV'}
									buttonType='primary'
									onClick={() => {
										window.open(
											'https://giveth.io/projects',
											'_blank',
										);
									}}
								/>
							</RoundInfo>
						</RoundSection>
						<InfoSection>
							<InfoImage src='/images/hands.svg' />
							<InfoTitle weight={700}>
								When you give you get GIV back!
							</InfoTitle>
							<InfoDesc>
								Each GIVbacks round lasts two weeks. After the
								End Date, the GIV Allocated to that round is
								distributed to Givers who donated to verified
								projects during the round. Projects must apply
								for verification at least 1 week prior to the
								Start Date in order to be included in the round.
							</InfoDesc>
							<InfoReadMore>
								<a
									target='_blank'
									href='https://docs.giveth.io/giveconomy/givbacks'
									rel='noreferrer noopener'
								>
									Read More{' '}
								</a>
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
