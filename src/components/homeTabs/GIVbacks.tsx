import React, { useState, useEffect, useContext } from 'react';
import { Row } from '../styled-components/Grid';
import {
	Container,
	IconExternalLink,
	IconGIVBack,
	P,
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
	const [roundStartime, setRoundStartime] = useState(new Date());
	const [roundEndTime, setRoundEndTime] = useState(new Date());
	const { tokenDistroHelper } = useTokenDistro();
	const { network: walletNetwork } = useContext(OnboardContext);

	useEffect(() => {
		if (tokenDistroHelper) {
			const now = getNowUnixMS();
			const deltaT = now - tokenDistroHelper.startTime.getTime();
			const TwoWeek = 1_209_600_000;
			const _round = Math.floor(deltaT / TwoWeek) + 1;
			setRound(_round);
			const _rounStartTime = new Date();
			_rounStartTime.setDate(
				tokenDistroHelper.startTime.getDate() + (_round - 1) * 14,
			);
			_rounStartTime.setHours(tokenDistroHelper.startTime.getHours());
			_rounStartTime.setMinutes(tokenDistroHelper.startTime.getMinutes());
			setRoundStartime(_rounStartTime);
			const _roundEndTime = new Date();
			_roundEndTime.setDate(_rounStartTime.getDate() + 14);
			_roundEndTime.setHours(tokenDistroHelper.startTime.getHours());
			_roundEndTime.setMinutes(tokenDistroHelper.startTime.getMinutes());
			setRoundEndTime(_roundEndTime);
		}
	}, [tokenDistroHelper]);

	return (
		<GIVbacksBottomContainer>
			<Container>
				<Row wrap={1} justifyContent='space-between'>
					<GbDataBlock
						title='Donor Rewards'
						button={
							<GbButton
								label='DONATE TO EARN GIV'
								linkType='secondary'
								size='large'
								href='https://giveth.io/projects'
								target='_blank'
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
								linkType='secondary'
								size='large'
								href='https://giveth.typeform.com/verification'
								target='_blank'
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
											? formatDate(roundStartime)
											: '-'}
									</P>
								</RoundInfoRow>
								<RoundInfoRow justifyContent='space-between'>
									<P>End Date</P>
									<P>
										{tokenDistroHelper
											? formatDate(roundEndTime)
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
							<InfoReadMore
								target='_blank'
								href='https://docs.giveth.io/giveconomy/givbacks'
							>
								<span>Read More </span>
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
	);
};
