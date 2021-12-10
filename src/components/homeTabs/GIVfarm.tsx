import styled from 'styled-components';
import { Row } from '@/components/styled-components/Grid';
import StakingPoolCard from '@/components/cards/StakingPoolCard';
import config from '@/configuration';
import { StakingType } from '@/types/config';
import React, { useContext, useEffect, useState } from 'react';
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
import { useTokenDistro } from '@/context/tokenDistro.context';
import { useFarms } from '@/context/farm.context';

const GIVfarmTabContainer = styled(Container)``;

export const TabGIVfarmTop = () => {
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { tokenDistroHelper } = useTokenDistro();
	const { totalEarned } = useFarms();
	const { network: walletNetwork } = useContext(OnboardContext);

	useEffect(() => {
		setRewardLiquidPart(tokenDistroHelper.getLiquidPart(totalEarned));
		setRewardStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(totalEarned),
		);
	}, [totalEarned, tokenDistroHelper]);

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
							liquidAmount={rewardLiquidPart}
							stream={rewardStream}
							network={walletNetwork}
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
