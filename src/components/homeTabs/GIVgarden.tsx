import React, { useState } from 'react';
import { H1, Container, IconGIVGarden } from '@giveth/ui-design-system';

import { Row } from '../styled-components/Grid';
import {
	GardenTopContainer,
	GardenBottomContainer,
	Left,
	Title,
	Subtitle,
	Right,
	GardenRewardCard,
	GovernanceBtn,
	GovernanceDB,
	OpenGardenButton,
	Section1Subtitle,
	Section1Title,
	Section2Title,
	GovernanceRaw,
	VoteCard,
	VoteCardDesc,
	VoteCardButton,
} from './GIVgarden.sc';
import { HarvestModal } from '../modals/Harvest';
import config from '@/configuration';
import { useStakingPool } from '@/hooks/useStakingPool';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { BigNumber } from 'bignumber.js';

const poolStakingConfig = getGivStakingConfig(config.XDAI_CONFIG);

export const TabGardenTop = () => {
	const [showModal, setShowModal] = useState(false);

	const { userStakeInfo, rewardRatePerToken } = useStakingPool(
		poolStakingConfig,
		config.XDAI_NETWORK_NUMBER,
	);

	const { earned } = userStakeInfo;
	return (
		<GardenTopContainer>
			<Container>
				<Row justifyContent='space-between'>
					<Left>
						<Row alignItems='baseline' gap='16px'>
							<Title>GIVgarden</Title>
							<IconGIVGarden size={64} />
						</Row>
						<Subtitle size='medium'>
							The Giveth Economy is the collective of projects,
							donors, builders, and community members building the
							Future of Giving.
						</Subtitle>
					</Left>
					<Right>
						<GardenRewardCard
							title='Your GIVgarden rewards'
							amount={new BigNumber(earned.toString())}
							rate={
								rewardRatePerToken
									? new BigNumber(
											rewardRatePerToken
												.times('604800')
												.toString(),
									  )
									: undefined
							}
							actionLabel='HARVEST'
							actionCb={() => {
								setShowModal(true);
							}}
						/>
					</Right>
				</Row>
			</Container>
			<HarvestModal showModal={showModal} setShowModal={setShowModal} />
		</GardenTopContainer>
	);
};

export const TabGardenBottom = () => {
	const goToGarden = () => {
		const url =
			'https://honey-pot-o49n5fgrn-1hive.vercel.app/#/garden/0x79c52e1a74d01cf030f3cbbbbf84b01476c9ac93';
		window.open(url, '_blank');
	};

	return (
		<GardenBottomContainer>
			<Container>
				<Section1Title weight={700}>Vote & Earn</Section1Title>
				<Row justifyContent='space-between' alignItems='flex-start'>
					<Section1Subtitle size='small'>
						GIV token holders control the treasury, roadmap and
						mission of the Giveth ecosystem. By voting in the
						GIVgarden you earn rewards on your staked GIV!
					</Section1Subtitle>
					<OpenGardenButton
						buttonType='primary'
						label='OPEN GIVGARDEN'
						size='large'
						onClick={goToGarden}
					/>
				</Row>
				<Section2Title weight={500}>
					Three Pillars of Governance
				</Section2Title>
				<GovernanceRaw justifyContent='space-between'>
					<GovernanceDB
						title='Covenant'
						button={
							<GovernanceBtn
								label='LEARN MORE'
								buttonType='texty'
							/>
						}
					>
						A decentralized social contract that outlines standards
						for on-chain and off-chain community behaviour.
					</GovernanceDB>
					<GovernanceDB
						title='Conviction Voting'
						button={
							<GovernanceBtn
								label='LEARN MORE'
								buttonType='texty'
							/>
						}
					>
						A token-weighted decision making tool, used for funds
						allocation, in which voting power is accrued as a
						function of tokens staked and time.
					</GovernanceDB>
					<GovernanceDB
						title='Tao Voting'
						button={
							<GovernanceBtn
								label='LEARN MORE'
								buttonType='texty'
							/>
						}
					>
						A token-weighted YES/NO decision making tool, with the
						option of delegation, that is used to make non-financial
						decisions in the GIVgarden.
					</GovernanceDB>
				</GovernanceRaw>
				<VoteCard>
					<H1>Vote in the GIVgarden</H1>
					<VoteCardDesc size='small'>
						The GIVgarden empowers the Giveth community to
						coordinate around shared resources from the bottom up.
					</VoteCardDesc>
					<VoteCardButton
						label='OPEN GIVGARDEN'
						buttonType='primary'
						onClick={goToGarden}
					/>
				</VoteCard>
			</Container>
		</GardenBottomContainer>
	);
};
