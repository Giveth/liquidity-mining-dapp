import React, { useRef, useEffect, useCallback, FC } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { B, brandColors, IconX } from '@giveth/ui-design-system';

const Background = styled.div`
	width: 100%;
	height: 100%;
	background: ${brandColors.giv[900]}b3;
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	z-index: 1110;
`;

const ModalWrapper = styled.div<IModalWrapper>`
	background: ${brandColors.giv[600]};
	box-shadow: 0px 3px 20px #21203c;
	border-radius: 8px;
	color: ${brandColors.deep[100]};
	position: relative;
	// padding: 24px;
	z-index: 10;
	text-align: center;
`;

const CloseModalButton = styled.div`
	position: absolute;
	top: 16px;
	right: 16px;
	cursor: pointer;
`;

const ModalTitle = styled(B)`
	color: ${brandColors.deep[100]};
	text-align: center;
	user-select: none;
`;

interface IModalWrapper {
	showModal: boolean;
}

export interface IModal {
	showModal: boolean;
	hiddenClose?: boolean;
	setShowModal: (value: boolean) => void;
	children?: React.ReactNode;
	// title?: string;
}

export const Modal: FC<IModal> = ({
	showModal,
	setShowModal,
	hiddenClose = false,
	children,
}) => {
	const modalRef = useRef(null);

	const animation = useSpring({
		config: {
			duration: 250,
		},
		opacity: (showModal ? 1 : 0) as any,
		transform: showModal ? `translateY(0%)` : `translateY(-100%)`,
	});

	const closeModal: React.MouseEventHandler<HTMLDivElement> = e => {
		if (modalRef.current === e.target) {
			// setShowModal(false); //disable close on click outside
		}
	};

	const keyPress = useCallback(
		e => {
			if (e.key === 'Escape' && showModal) {
				setShowModal(false);
				console.log('I pressed');
			}
		},
		[setShowModal, showModal],
	);

	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	return (
		<>
			{showModal ? (
				<Background onClick={closeModal} ref={modalRef}>
					<animated.div style={animation}>
						<ModalWrapper showModal={showModal}>
							{!hiddenClose && (
								<CloseModalButton
									onClick={() => {
										setShowModal(false);
									}}
								>
									<IconX size={24} />
								</CloseModalButton>
							)}
							{/* <ModalTitle>{title}</ModalTitle> */}
							{children}
						</ModalWrapper>
					</animated.div>
				</Background>
			) : null}
		</>
	);
};
