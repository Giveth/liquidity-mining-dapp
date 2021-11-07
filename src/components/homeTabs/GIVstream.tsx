import React, { FC, useState } from 'react';
import { Row } from '../styled-components/Grid';
import router from 'next/router';
import {
	Button,
	Container,
	IconExternalLink,
	IconGIVBack,
	P,
	B,
	Title,
	brandColors,
	IconGIVStream,
	H3,
	H1,
	H4,
	IconHelp,
	H6,
	IconSpark,
} from '@giveth/ui-design-system';
import {
	GIVstreamTopContainer,
	GIVstreamTopInnerContainer,
	GIVbacksBottomContainer,
	GIVstreamRewardCard,
	Left,
	Right,
	GSSubtitle,
	GSTitle,
	GsDataBlock,
	GsButton,
	FlowRateRow,
	FlowRateUnit,
	GIVstreamProgressContainer,
	GsPTitleRow,
	GsPTitle,
	Bar,
	PercentageRow,
	IncreaseSection,
	IncreaseSectionTitle,
	IGsDataBox,
} from './GIVstream.sc';

export const TabGIVstreamTop = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<GIVstreamTopContainer>
			<GIVstreamTopInnerContainer>
				<Row justifyContent='space-between'>
					<Left>
						<Row alignItems='baseline' gap='16px'>
							<GSTitle>GIVstream</GSTitle>
							<IconGIVStream size={64} />
						</Row>
						<GSSubtitle size='medium'>
							Welcome to the expanding GIViverse! The GIVstream
							aligns community members with the long term success
							of Giveth and the GIVeconomy.
						</GSSubtitle>
					</Left>
					<Right>
						<GIVstreamRewardCard
							amount={257.9055}
							actionLabel='HARVEST'
							actionCb={() => {
								setShowModal(true);
							}}
						/>
					</Right>
				</Row>
			</GIVstreamTopInnerContainer>
		</GIVstreamTopContainer>
	);
};

export const TabGIVstreamBottom = () => {
	const goToClaim = () => {
		router.push('/claim');
	};

	return (
		<GIVbacksBottomContainer>
			<Container>
				<FlowRateRow alignItems='baseline' gap='8px'>
					<H3 weight={700}>Your Flowrate:</H3>
					<IconGIVStream size={64} />
					<H1>{16.06}</H1>
					<FlowRateUnit>GIV/week</FlowRateUnit>
					<IconHelp size={16} />
				</FlowRateRow>
				<GIVstreamProgress
					percentage={20}
					remainTime='Time remaining: 4 y 23 d 16h'
				/>
				<Row wrap={1} justifyContent='space-between'>
					<GsDataBlock
						title='GIVstream'
						button={
							<GsButton
								label='DONATE TO EARN GIV'
								buttonType='secondary'
								size='large'
							/>
						}
					>
						At launch, 10% of the total supply of GIV is liquid. The
						rest is released via the GIVstream, becoming liquid
						gradually until November 23, 2026.
					</GsDataBlock>
					<GsDataBlock
						title='Expanding GIViverse'
						button={
							<GsButton
								label='VERIFY YOUR PROJECT'
								buttonType='secondary'
								size='large'
							/>
						}
					>
						Anyone who adds value to the Giveth ecosystem recieves a
						GIVstream. As the GIVeconomy grows, more GIV becomes
						liquid & flows to our community.
					</GsDataBlock>
				</Row>
			</Container>
			<IncreaseSection>
				<Container>
					<IncreaseSectionTitle>
						Increase your GIVstream
						<IconSpark size={32} color={brandColors.mustard[500]} />
					</IncreaseSectionTitle>
					<Row wrap={1} justifyContent='space-between'>
						<IGsDataBox
							title='GIVbacks'
							button={
								<GsButton
									label='GIVE AND EARN'
									buttonType='primary'
									size='medium'
								/>
							}
						>
							Donate to verified projects on Giveth. Earn GIV and
							increase your GIVstream with GIVbacks.
						</IGsDataBox>
						<IGsDataBox
							title='GIVgarden'
							button={
								<GsButton
									label='SEE OPEN PROPOSALS'
									buttonType='primary'
									size='medium'
								/>
							}
						>
							The GIVgarden is the decentralized governance
							platform for the GIVeconomy. Earn GIV and increase
							your GIVstream when you vote.
						</IGsDataBox>
						<IGsDataBox
							title='GIVfarm'
							button={
								<GsButton
									label='STAKE AND EARN'
									buttonType='primary'
									size='medium'
								/>
							}
						>
							Stake GIV, or become a liquidity provider and stake
							LP tokens in the GIVfarm. Earn GIV rewards and
							increase your GIVstream.
						</IGsDataBox>
					</Row>
				</Container>
			</IncreaseSection>
		</GIVbacksBottomContainer>
	);
};

interface IGIVstreamProgressProps {
	percentage: number;
	remainTime: string;
}

export const GIVstreamProgress: FC<IGIVstreamProgressProps> = ({
	percentage,
	remainTime,
}) => {
	return (
		<GIVstreamProgressContainer>
			<GsPTitleRow justifyContent='space-between'>
				<GsPTitle alignItems='center' gap='8px'>
					<H6>GIVstream progress</H6>
					<IconHelp size={16} />
				</GsPTitle>
				<P>{remainTime}</P>
			</GsPTitleRow>
			<Bar percentage={percentage} />
			<PercentageRow justifyContent='space-between'>
				<B>{percentage}%</B>
				<B>100%</B>
			</PercentageRow>
		</GIVstreamProgressContainer>
	);
};
