import { FC } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
import {
	H6,
	GLink,
	IconCalculator,
	neutralColors,
	brandColors,
	SublineBold,
	Subline,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';

interface IMobileModalProps extends IModal {}

export const MobileModal: FC<IMobileModalProps> = ({
	showModal,
	setShowModal,
}) => {
	return (
		<>
			<Modal showModal={showModal} setShowModal={setShowModal}>
				<ModalContainer>
					<Row gap='8px' alignItems='center' />
					<DescContainer>
						The GIVeconomy dApp is currently desktop only.
					</DescContainer>
				</ModalContainer>
			</Modal>
		</>
	);
};

const ModalContainer = styled.div`
	width: 420px;
	padding: 16px 24px;
	text-align: center;
`;

const DescContainer = styled.div`
	color: ${neutralColors.gray[100]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.mustard[800]};
	border-radius: 8px;
	padding: 18px;
	margin: 32px auto;
`;