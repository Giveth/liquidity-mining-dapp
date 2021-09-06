import styled from 'styled-components';
import { Container, Row } from '../styled-components/Grid';
import { TabContainer } from './commons';
import StakingPoolCard from '../cards/StakingPoolCard';
import config from '../../configuration';
import { BasicNetworkConfig, PoolStakingConfig } from '../../types/config';

const GIVfarmTabContainer = styled(TabContainer)``;

const TabGIVfarm = () => {
	const getGivStakingConfig = (
		networkConfig: BasicNetworkConfig,
	): PoolStakingConfig => {
		return {
			...networkConfig.GIV,
			POOL_ADDRESS: networkConfig.TOKEN_ADDRESS,
			type: 'GIV Stream',
			title: 'GIV',
			description: '100% GIV',
		};
	};

	return (
		<GIVfarmTabContainer>
			<Container>
				<Row>
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
				<Row>
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
			</Container>
		</GIVfarmTabContainer>
	);
};

export default TabGIVfarm;
