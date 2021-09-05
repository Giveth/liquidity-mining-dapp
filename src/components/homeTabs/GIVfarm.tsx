import { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { Container, Row } from '../styled-components/Grid';
import { TabContainer } from './commons';
import StakingPoolCard from '../cards/StakingPoolCard';

const GIVfarmTabContainer = styled(TabContainer)``;

const TabGIVfarm = () => {
	return (
		<GIVfarmTabContainer>
			<Container>
				<Row>
					<StakingPoolCard />
					<StakingPoolCard />
					<StakingPoolCard />
				</Row>
				<Row>
					<StakingPoolCard wrongNetwork={true} />
					<StakingPoolCard wrongNetwork={true} />
					<StakingPoolCard wrongNetwork={true} />
				</Row>
			</Container>
		</GIVfarmTabContainer>
	);
};

export default TabGIVfarm;
