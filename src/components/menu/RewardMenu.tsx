import { OnboardContext, useOnboard } from '@/context/onboard.context';
import {
	Overline,
	P,
	B,
	GLink,
	brandColors,
	Caption,
} from '@giveth/ui-design-system';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { RewardMenuContainer } from './RewardMenu.sc';
import Image from 'next/image';
import { switchNetwork } from '@/lib/metamask';
import config from '@/configuration';
import BigNumber from 'bignumber.js';
import { useBalances } from '@/context';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { Zero } from '@ethersproject/constants';
import { formatWeiHelper } from '@/helpers/number';
import { useFarms } from '@/context/farm.context';

export const RewardMenu = () => {
	const [farmsLiquidPart, setFarmsLiquidPart] = useState(Zero);
	const [givBackLiquidPart, setGivBackLiquidPart] = useState(Zero);
	const [givStreamLiquidPart, setGIVstreamLiquidPart] = useState(Zero);
	const [flowrateow, setFlowrate] = useState<BigNumber.Value>(0);
	const { tokenDistroHelper } = useTokenDistro();
	const { currentBalance } = useBalances();
	const { totalEarned } = useFarms();
	const { network, connect, address, provider } = useContext(OnboardContext);
	const { allocatedTokens, claimed, givback } = currentBalance;

	useEffect(() => {
		setFarmsLiquidPart(tokenDistroHelper.getLiquidPart(totalEarned));
	}, [totalEarned, tokenDistroHelper]);

	useEffect(() => {
		setGivBackLiquidPart(tokenDistroHelper.getLiquidPart(givback));
	}, [givback, tokenDistroHelper]);

	const switchNetworkHandler = () => {
		if (network === config.XDAI_NETWORK_NUMBER) {
			switchNetwork(config.MAINNET_NETWORK_NUMBER);
		} else {
			switchNetwork(config.XDAI_NETWORK_NUMBER);
		}
	};

	useEffect(() => {
		setGIVstreamLiquidPart(
			tokenDistroHelper
				.getLiquidPart(allocatedTokens.sub(givback))
				.sub(claimed),
		);
		setFlowrate(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				allocatedTokens.sub(givback),
			),
		);
	}, [allocatedTokens, claimed, givback, tokenDistroHelper]);

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
					<FlowrateAmount>
						{formatWeiHelper(flowrateow)}
					</FlowrateAmount>
					<FlowrateUnit>GIV/week</FlowrateUnit>
				</FlowrateRow>
			</FlowrateBox>
			<PartRow>
				<PartInfo>
					<PartTitle>From Givstream</PartTitle>
					<Row gap='4px'>
						<PartAmount medium>
							{formatWeiHelper(givStreamLiquidPart)}
						</PartAmount>
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
						<PartAmount medium>
							{formatWeiHelper(farmsLiquidPart)}
						</PartAmount>
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
						<PartAmount medium>
							{formatWeiHelper(givBackLiquidPart)}
						</PartAmount>
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
