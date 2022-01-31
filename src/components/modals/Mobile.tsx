import { FC } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
import { GLink, neutralColors, brandColors, P } from '@giveth/ui-design-system';
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
						The GIVeconomy DApp is optimized for desktop. Switch to
						desktop for the best experience or close this box to
						explore anyway.
						<GLink
							href='https://docs.giveth.io/giveconomy/'
							target='_blank'
						>
							Read about the GIVeconomy here.
						</GLink>
					</DescContainer>
				</ModalContainer>
			</Modal>
		</>
	);
};

const ModalContainer = styled.div`
	width: 100%;
	max-width: 420px;
	padding: 16px 24px;
	text-align: center;
`;

const DescContainer = styled(P)`
	color: ${neutralColors.gray[100]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.mustard[800]};
	border-radius: 8px;
	padding: 18px;
	margin: 32px auto;
	& > a {
		display: block;
		margin-top: 8px;
		color: yellow;
	}
`;
