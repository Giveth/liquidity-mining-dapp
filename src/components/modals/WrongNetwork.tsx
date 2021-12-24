import config from '@/configuration';
import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useContext, useState } from 'react';
import { Button } from '@giveth/ui-design-system';
import { switchNetwork } from '@/lib/metamask';

import { chainName } from '@/utils/constants';
import { Modal, IModal } from './Modal';

import { OnboardContext } from '@/context/onboard.context';
interface IWrongNetworkInnerModal {
	text?: string;
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

interface IWrongNetworkModal extends IModal, IWrongNetworkInnerModal {}

export const WrongNetworkModal: FC<IWrongNetworkModal> = ({
	text,
	targetNetworks,
	showModal,
	setShowModal,
}) => {
	return (
		<Modal showModal={showModal} setShowModal={setShowModal} hiddenClose>
			<WrongNetworkModalContainer>
				<WrongNetworkModalTitle>
					You&apos;re connected to the wrong network!
				</WrongNetworkModalTitle>
				<WrongNetworkInnerModal
					text={text}
					targetNetworks={targetNetworks}
				/>
			</WrongNetworkModalContainer>
		</Modal>
	);
};

const WrongNetworkModalContainer = styled.div`
	padding: 20px 30px;
`;

const WrongNetworkModalTitle = styled.span`
	font-family: 'Red Hat Text';
	font-size: 24px;
	font-bold;
`;
