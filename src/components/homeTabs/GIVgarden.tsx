import React, { useState, useEffect } from 'react';
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
	GovernanceLink,
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
import { HarvestAllModal } from '../modals/HarvestAll';
import config from '@/configuration';
import { useStakingPool } from '@/hooks/useStakingPool';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import BigNumber from 'bignumber.js';
import { Zero } from '@ethersproject/constants';
import { useOnboard } from '@/context';
import { ethers } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';

const poolStakingConfig = getGivStakingConfig(config.XDAI_CONFIG);

export const TabGardenTop = () => {
	const { network: walletNetwork } = useOnboard();
	const { tokenDistroHelper } = useTokenDistro();

	const [showModal, setShowModal] = useState(false);
	const [earnedLiquidPart, setEarnedLiquidPart] =
		useState<ethers.BigNumber>(Zero);
	const [earnedStream, setEarnedStream] = useState<BigNumber>(
		new BigNumber(0),
	);

	const { earned } = useStakingPool(
		poolStakingConfig,
		config.XDAI_NETWORK_NUMBER,
	);

	useEffect(() => {
		setEarnedLiquidPart(tokenDistroHelper.getLiquidPart(earned));
		setEarnedStream(tokenDistroHelper.getStreamPartTokenPerWeek(earned));
	}, [earned]);

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
							The GIVgarden is the decentralized governance
							platform for the GIVeconomy.
						</Subtitle>
					</Left>
					<Right>
						<GardenRewardCard
							title='Your GIVgarden rewards'
							wrongNetworkText='GIVgarden is only available on xDAI.'
							liquidAmount={earnedLiquidPart}
							stream={earnedStream}
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
			{showModal && (
				<HarvestAllModal
					title='GIVgarden Rewards'
					showModal={showModal}
					setShowModal={setShowModal}
					poolStakingConfig={poolStakingConfig}
					claimable={earned}
					network={config.XDAI_NETWORK_NUMBER}
				/>
			)}
		</GardenTopContainer>
	);
};

export const TabGardenBottom = () => {
	const goToGarden = () => {
		const url = config.GARDEN_LINK;
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
							<GovernanceLink
								size='Medium'
								target='_blank'
								rel='noreferrer'
								href='https://docs.giveth.io/whatisgiveth/covenant'
							>
								LEARN MORE
							</GovernanceLink>
						}
					>
						A decentralized social contract that outlines standards
						for on-chain and off-chain community behaviour.
					</GovernanceDB>
					<GovernanceDB
						title='Conviction Voting'
						button={
							<GovernanceLink
								size='Medium'
								target='_blank'
								rel='noreferrer'
								href='https://forum.giveth.io/t/conviction-voting/154'
							>
								LEARN MORE
							</GovernanceLink>
						}
					>
						A token-weighted decision making tool, used for funds
						allocation, in which voting power is accrued as a
						function of tokens staked and time.
					</GovernanceDB>
					<GovernanceDB
						title='Tao Voting'
						button={
							<GovernanceLink
								size='Medium'
								target='_blank'
								rel='noreferrer'
								href='https://forum.giveth.io/t/tao-voting-explained/155'
							>
								LEARN MORE
							</GovernanceLink>
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
