import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { TabContainer } from './commons';
import StakingPoolCard from '../cards/StakingPoolCard';
import config from '../../configuration';
import {
	BasicNetworkConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '../../types/config';
import React, { useContext } from 'react';
import {
	GIVfarmTopContainer,
	Left,
	Right,
	Subtitle,
	Title,
	GIVfarmRewardCard,
} from './GIVfarm.sc';
import { Container, IconGIVFarm } from '@giveth/ui-design-system';
import { OnboardContext } from '../../context/onboard.context';

const GIVfarmTabContainer = styled(TabContainer)``;

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
						<GIVfarmRewardCard amount={257.9055} />
					</Right>
				</Row>
			</Container>
		</GIVfarmTopContainer>
	);
};

export const TabGIVfarmBottom = () => {
	const getGivStakingConfig = (
		networkConfig: BasicNetworkConfig,
	): SimplePoolStakingConfig => {
		return {
			...networkConfig.GIV,
			POOL_ADDRESS: networkConfig.TOKEN_ADDRESS,
			type: StakingType.GIV_STREAM,
			title: 'GIV',
			description: '100% GIV',
		};
	};
	const { network: walletNetwork } = useContext(OnboardContext);

	return (
		<GIVfarmTabContainer>
			{(walletNetwork === 42 || walletNetwork === 100) && (
				<Row justifyContent='center' gap='24px' wrap={1}>
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
				</Row>
			)}
			{(walletNetwork === 1 || walletNetwork === 4) && (
				<Row justifyContent='center' gap='24px' wrap={1}>
					{config.MAINNET_CONFIG.pools.map(
						(poolStakingConfig, index) => {
							return (
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
				</Row>
			)}
		</GIVfarmTabContainer>
	);
};
