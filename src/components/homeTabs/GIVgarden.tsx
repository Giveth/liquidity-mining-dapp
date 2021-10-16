import React from 'react';
import Image from 'next/image';
import {
	Container,
	D1,
	IconGIVGarden,
	QuoteText,
} from '@giveth/ui-design-system';

import { Row } from '../styled-components/Grid';
import {
	GardenTopContainer,
	GardenBottomContainer,
	Left,
	Title,
	Subtitle,
	Right,
	GardenRewardCard,
} from './GIVgarden.sc';

export const TabGardenTop = () => {
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
							amount={257.9055}
							actionLabel='HARVEST'
							actionCb={() => {}}
						/>
					</Right>
				</Row>
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
