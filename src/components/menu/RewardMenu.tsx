import { OnboardContext } from '@/context/onboard.context';
import { Overline, P, B, GLink, brandColors, Caption } from '@giveth/ui-design-system';
import { useContext } from 'react';
import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { RewardMenuContainer } from './RewardMenu.sc';
import Image from 'next/image';

export const RewardMenu = () => {
	const { network, connect, address, provider } = useContext(OnboardContext);

	return (
		<RewardMenuContainer>
			<Overline styleType='Small'>Network</Overline>
			<NetworkRow>
				<B>{provider?._network?.name}</B>
				<SwithNetwork>Switch network</SwithNetwork>
			</NetworkRow>
			<FlowrateBox>
				<Overline styleType='Small'>GIVStream Flowrate</Overline>
				<FlowrateRow>
					<Image
						src='/images/icons/thunder.svg'
						height='16'
						width='12'
						alt='Thunder image'
					/>
					<FlowrateAmount>{9.588}</FlowrateAmount>
					<FlowrateUnit>GIV/week</FlowrateUnit>
				</FlowrateRow>
			</FlowrateBox>
			<PartRow>
				<PartInfo>
					<PartTitle>From Givstream</PartTitle>
					<PartAmount></PartAmount>
				</PartInfo>
			</PartRow>
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

export const FlowrateBox = styled.div`
	background-color: ${brandColors.giv[500]};
	margin: 16px -16px;
	border-radius: 8px;
	padding: 8px 16px;
`;

export const FlowrateRow = styled(Row)`
	align-items: center;
	margin-top: 12px;
`;

export const FlowrateAmount = styled(P)`
	padding-left: 2px;
`;

export const FlowrateUnit = styled(P)`
	padding-left: 2px;
`;

export const PartRow = styled(Row)`
	justify-content: space-between;
`;

export const PartInfo = styled.div``;

export const PartTitle = styled(Overline)`
	margin-bottom: 10px;
`;
export const PartAmount = styled(Caption)``;
