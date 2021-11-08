import { FC } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
interface IChangeNetworkModalProps extends IModal {
	targetNetwork: number;
}

export const ChangeNetworkModal: FC<IChangeNetworkModalProps> = ({
	showModal,
	setShowModal,
	targetNetwork,
}) => {
	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<APRModalContainer>Hi</APRModalContainer>
		</Modal>
	);
};

const APRModalContainer = styled.div`
	width: 370px;
`;
