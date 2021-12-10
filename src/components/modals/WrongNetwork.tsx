import config from '@/configuration';
import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useState } from 'react';
import { Button } from '@giveth/ui-design-system';
import { switchNetwork } from '@/lib/metamask';

import { chainName } from '@/utils/constants';
import { Modal } from './Modal';
interface IWrongNetworkInnerModal {
	text: string;
	targetNetworks: number[];
}

export const WrongNetworkInnerModal: FC<IWrongNetworkInnerModal> = ({
	text,
	targetNetworks,
}) => {
	const [showModal, setShowModal] = useState(true);

	return (
		<Modal hiddenClose showModal={showModal} setShowModal={setShowModal}>
			<WrongNetworkInnerModalContainer>
				<Description>
					<P>{text}</P>
					<P>Please switch the network.</P>
				</Description>
				<ButtonsContainer>
					{targetNetworks.map(network => (
						<Button
							label={`SWITCH TO ${chainName(
								network,
							).toUpperCase()}`}
							onClick={() => switchNetwork(network)}
							key={network}
						/>
					))}
				</ButtonsContainer>
			</WrongNetworkInnerModalContainer>
		</Modal>
	);
};

const WrongNetworkInnerModalContainer = styled.div`
	max-width: 450px;
	padding: 40px 24px 24px;
`;

const Description = styled.div`
	padding: 12px;
	margin-bottom: 12px;
	color: ${brandColors.deep[100]};
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;
