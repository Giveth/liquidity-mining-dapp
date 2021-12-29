import { OnboardContext } from '@/context/onboard.context';
import { Overline, B, GLink, brandColors } from '@giveth/ui-design-system';
import { useContext } from 'react';
import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { RewardMenuContainer } from './RewardMenu.sc';

export const RewardMenu = () => {
	const { network, connect, address, provider } = useContext(OnboardContext);

	return (
		<RewardMenuContainer>
			<Overline styleType='Small'>Network</Overline>
			<NetworkRow>
				<B>{provider?._network?.name}</B>
				<SwithNetwork>Switch network</SwithNetwork>
			</NetworkRow>
			<div>Item 1</div>
			<div>Item 2</div>
			<div>Item 3</div>
			<div>Item 4</div>
			<div>Item 5</div>
		</RewardMenuContainer>
	);
};

export const NetworkRow = styled(Row)`
	justify-content: space-between;
	align-items: center;
`;

export const SwithNetwork = styled(GLink)`
	color: ${brandColors.pinky[500]};
`;
