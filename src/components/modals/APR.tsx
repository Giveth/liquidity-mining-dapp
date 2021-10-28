import { FC } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
interface IHarvesModalProps extends IModal {}

export const APRModal: FC<IHarvesModalProps> = ({
	showModal,
	setShowModal,
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
