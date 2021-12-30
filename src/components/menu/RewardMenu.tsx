import { OnboardContext } from '@/context/onboard.context';
import {
	Overline,
	P,
	B,
	GLink,
	brandColors,
	Caption,
} from '@giveth/ui-design-system';
import { useContext } from 'react';
import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { RewardMenuContainer } from './RewardMenu.sc';
import Image from 'next/image';
import { switchNetwork } from '@/lib/metamask';
import config from '@/configuration';

export const RewardMenu = () => {
	const { network, connect, address, provider } = useContext(OnboardContext);
	const switchNetworkHandler = () => {
		if (network === config.XDAI_NETWORK_NUMBER) {
			switchNetwork(config.MAINNET_NETWORK_NUMBER);
		} else {
			switchNetwork(config.XDAI_NETWORK_NUMBER);
		}
	};

	return (
		<RewardMenuContainer>
			<Overline styleType='Small'>Network</Overline>
			<NetworkRow>
				<B>{provider?._network?.name}</B>
				<SwithNetwork onClick={switchNetworkHandler}>
					Switch network
				</SwithNetwork>
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
					<Row gap='4px'>
						<PartAmount medium>791.43</PartAmount>
						<PartUnit>GIV</PartUnit>
					</Row>
				</PartInfo>
				<Image
					src='/images/rarrow1.svg'
					height='42'
					width='16'
					alt='Thunder image'
				/>
			</PartRow>
			<PartRow>
				<PartInfo>
					<PartTitle>GIVFarm & Givgarden</PartTitle>
					<Row gap='4px'>
						<PartAmount medium>791.43</PartAmount>
						<PartUnit>GIV</PartUnit>
					</Row>
				</PartInfo>
				<Image
					src='/images/rarrow1.svg'
					height='42'
					width='16'
					alt='Thunder image'
				/>
			</PartRow>
			<PartRow>
				<PartInfo>
					<PartTitle>GIVBacks</PartTitle>
					<Row gap='4px'>
						<PartAmount medium>791.43</PartAmount>
						<PartUnit>GIV</PartUnit>
					</Row>
				</PartInfo>
				<Image
					src='/images/rarrow1.svg'
					height='42'
					width='16'
					alt='Thunder image'
				/>
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
	cursor: pointer;
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
	margin 16px 0;
`;

export const PartInfo = styled.div``;

export const PartTitle = styled(Overline)`
	margin-bottom: 10px;
`;
export const PartAmount = styled(Caption)``;
export const PartUnit = styled(Caption)``;
