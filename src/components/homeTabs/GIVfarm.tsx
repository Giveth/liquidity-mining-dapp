import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import StakingPoolCard from '../cards/StakingPoolCard';
import config from '../../configuration';
import {
	BasicNetworkConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '@/types/config';
import React, { useContext } from 'react';
import {
	GIVfarmTopContainer,
	Left,
	Right,
	Subtitle,
	Title,
	GIVfarmRewardCard,
	PoolRow,
} from './GIVfarm.sc';
import { Container, IconGIVFarm } from '@giveth/ui-design-system';
import { OnboardContext } from '@/context/onboard.context';
import { NetworkSelector } from '@/components/NetworkSelector';
import StakingPositionCard from '@/components/cards/StakingPositionCard';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { BigNumber } from 'bignumber.js';
import { constants } from 'ethers';

const GIVfarmTabContainer = styled(Container)``;

export const TabGIVfarmTop = () => {
	return (
		<GIVfarmTopContainer>
			<Container>
				<Row justifyContent='space-between'>
					<Left>
						<Row alignItems='baseline' gap='16px'>
							<Title>GIVfarm</Title>
							<IconGIVFarm size={64} />
						</Row>
						<Subtitle size='medium'>
							Stake tokens in the GIVfarm to grow your rewards.
						</Subtitle>
					</Left>
					<Right>
						<GIVfarmRewardCard
							title='Your GIVfarm rewards'
							amount={constants.Zero}
							rate={new BigNumber(0)}
						/>
					</Right>
				</Row>
			</Container>
		</GIVfarmTopContainer>
	);
};

export const TabGIVfarmBottom = () => {
	const { network: walletNetwork } = useContext(OnboardContext);

	return (
		<GIVfarmTabContainer>
			<NetworkSelector />
			{walletNetwork === config.XDAI_NETWORK_NUMBER && (
				<PoolRow justifyContent='center' gap='24px' wrap={1}>
					{config.XDAI_CONFIG.pools.map(
						(poolStakingConfig, index) => {
							return (
								<StakingPoolCard
									key={`staking_pool_card_xdai_${index}`}
									network={config.XDAI_NETWORK_NUMBER}
									poolStakingConfig={poolStakingConfig}
								/>
							);
						},
					)}
					<StakingPoolCard
						network={config.XDAI_NETWORK_NUMBER}
						poolStakingConfig={getGivStakingConfig(
							config.XDAI_CONFIG,
						)}
					/>
				</PoolRow>
			)}
			{walletNetwork === config.MAINNET_NETWORK_NUMBER && (
				<PoolRow justifyContent='center' gap='24px' wrap={1}>
					{config.MAINNET_CONFIG.pools.map(
						(poolStakingConfig, index) => {
							return poolStakingConfig.type ===
								StakingType.UNISWAP ? (
								<StakingPositionCard
									key={`staking_pool_card_mainnet_${index}`}
									network={config.MAINNET_NETWORK_NUMBER}
									poolStakingConfig={poolStakingConfig}
								/>
							) : (
								<StakingPoolCard
									key={`staking_pool_card_mainnet_${index}`}
									network={config.MAINNET_NETWORK_NUMBER}
									poolStakingConfig={poolStakingConfig}
								/>
							);
						},
					)}
					<StakingPoolCard
						network={config.MAINNET_NETWORK_NUMBER}
						poolStakingConfig={getGivStakingConfig(
							config.MAINNET_CONFIG,
						)}
					/>
				</PoolRow>
			)}
		</GIVfarmTabContainer>
	);
};
