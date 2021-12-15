import config from '@/configuration';
import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useState } from 'react';
import { Button } from '@giveth/ui-design-system';
import { switchNetwork } from '@/lib/metamask';

import { chainName } from '@/utils/constants';
import { Modal, IModal } from './Modal';

interface IWrongNetworkInnerModal {
	text: string;
	targetNetworks: number[];
}

export const WrongNetworkInnerModal: FC<IWrongNetworkInnerModal> = ({
	text,
	targetNetworks,
}) => {
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
						onClick={() => switchNetwork(network)}
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
			<div>
				<span>You&apos;re connect to the wrong network!</span>
				<WrongNetworkInnerModal
					text={text}
					targetNetworks={targetNetworks}
				/>
			</div>
		</Modal>
	);
};
