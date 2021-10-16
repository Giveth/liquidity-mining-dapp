import React from 'react';
import styled from 'styled-components';
import router from 'next/router';
import { Container } from '@giveth/ui-design-system';

import { Row } from '../styled-components/Grid';
import { GardenTopContainer, GardenBottomContainer } from './GIVgarden.sc';

export const TabGardenTop = () => {
	return (
		<GardenTopContainer>
			<Container>
				<Row justifyContent='space-between'>Salam</Row>
			</Container>
		</GardenTopContainer>
	);
};

export const TabGardenBottom = () => {
	return (
		<GardenBottomContainer>
			<Container></Container>
		</GardenBottomContainer>
	);
};
