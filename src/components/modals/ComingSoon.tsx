import { brandColors, Title } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useEffect } from 'react';
import { IModal } from './Modal';

export const ComingSoon: FC<IModal> = ({ showModal, setShowModal }) => {
	useEffect(() => {
		const modalRoot = document.querySelector('body') as HTMLElement;
		modalRoot.style.overflow = 'hidden';
		return () => {
			modalRoot.style.overflow = 'unset';
		};
	}, []);
	return (
		<ComingSoonontainer>
			<Logo src='/images/logo/logo.svg' />
			<Text>Coming Soon</Text>
			<ByPass onClick={() => setShowModal(false)} />
		</ComingSoonontainer>
	);
};

const ComingSoonontainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: ${brandColors.giv[700]};
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 32px;
`;

const Logo = styled.img`
	width: 180px;
`;

const Text = styled(Title)``;

const ByPass = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 20px;
	height: 20px;
`;
