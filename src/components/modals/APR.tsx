import { FC, useState } from 'react';
import { Modal, IModal } from './Modal';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import CheckAnimation from '../../animations/check.json';
import {
	brandColors,
	neutralColors,
	Button,
	Caption,
	IconGiveth,
	IconGIVStream,
	IconHelp,
	Lead,
	P,
	Title,
	H6,
	GLink,
	OulineButton,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
interface IHarvesModalProps extends IModal {}

export const APRModal: FC<IHarvesModalProps> = ({
	showModal,
	setShowModal,
}) => {
	return (
		<Modal showModal={showModal} setShowModal={setShowModal} title='APR'>
			<APRModalContainer>Hi</APRModalContainer>
		</Modal>
	);
};

const APRModalContainer = styled.div`
	width: 370px;
`;
