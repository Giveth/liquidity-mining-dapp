import config from '@/configuration';
import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useContext, useState } from 'react';
import { Button } from '@giveth/ui-design-system';
import { switchNetwork } from '@/lib/metamask';

import { chainName } from '@/utils/constants';
import { OnboardContext } from '@/context/onboard.context';
interface IWrongNetworkInnerModal {
	text: string;
	targetNetworks: number[];
}

export const WrongNetworkInnerModal: FC<IWrongNetworkInnerModal> = ({
	text,
	targetNetworks,
}) => {
	const { connect, address } = useContext(OnboardContext);
	const checkWalletAndSwitchNetwork = async (network: number) => {
		console.log(`address`, address);
		if (!address) {
			await connect();
		}
		if (address) {
			await switchNetwork(network);
		}
	};

	return (
		<WrongNetworkInnerModalContainer>
			<Description>
				<P>{text}</P>
				<P>Please switch the network.</P>
			</Description>
			<ButtonsContainer>
				{targetNetworks.map(network => (
					<Button
						label={`SWITCH TO ${chainName(network).toUpperCase()}`}
						onClick={() => checkWalletAndSwitchNetwork(network)}
						buttonType='primary'
						key={network}
					/>
				))}
			</ButtonsContainer>
		</WrongNetworkInnerModalContainer>
	);
};

const WrongNetworkInnerModalContainer = styled.div`
	max-width: 450px;
	padding: 6px 24px;
`;

const Description = styled.div`
	padding: 12px;
	margin-bottom: 12px;
	text-align: center;
	color: ${brandColors.deep[100]};
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;
