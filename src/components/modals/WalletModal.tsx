import React from 'react';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';

import {
	useWalletName,
	EWallets,
	walletsArray,
	TWalletConnector,
} from '@/lib/wallet/walletTypes';
import {
	brandColors,
	H5,
	Lead,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import { IModal, Modal } from '@/components/modals/Modal';
import styled from 'styled-components';

interface IWalletModal extends IModal {
	closeParentModal?: () => void;
}

const WalletModal = ({
	showModal,
	setShowModal,
	closeParentModal,
}: IWalletModal) => {
	const context = useWeb3React();
	const { activate } = context;
	const selectedWallet = useWalletName(context);

	const handleSelect = (selected: {
		connector: TWalletConnector;
		value: EWallets;
	}) => {
		if (selectedWallet !== selected.value) {
			activate(selected.connector)
				.then(() => {
					window.localStorage.setItem(
						'selectedWallet',
						selected.value,
					);
					closeParentModal ? closeParentModal() : undefined;
				})
				.catch(e => {
					// toast to inform error
					console.log(e);
				});
		}
		setShowModal(false);
	};

	if (!showModal) return null;

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<IconsContainer>
				{walletsArray.map(i => (
					<WalletItem
						onClick={() => handleSelect(i)}
						key={i.value}
						className={selectedWallet === i.value ? 'active' : ''}
					>
						{selectedWallet === i.value && (
							<Badge styleType={'Small'}>SELECTED</Badge>
						)}
						<Image
							src={i.image}
							alt={i.name}
							height={64}
							width={64}
						/>
						<H5>{i.name}</H5>
						<Lead color={neutralColors.gray['600']}>
							Connect with your {i.name}
						</Lead>
					</WalletItem>
				))}
			</IconsContainer>
		</Modal>
	);
};

const CloseButton = styled.div`
	position: absolute;
	right: 24px;
	top: 24px;
	cursor: pointer;
`;

const IconsContainer = styled.div`
	display: grid;
	grid-gap: 1px;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	background-color: ${neutralColors.gray['600']};
	max-height: 420px;
`;

const WalletItem = styled.div`
	background-color: white;
	flex-direction: column;
	gap: 2px;
	min-width: 355px;
	min-height: 190px;
	padding: 20px 40px;
	cursor: pointer;

	&:hover {
		background: radial-gradient(#fff, ${neutralColors.gray['200']});
	}

	&.active {
		border-color: ${brandColors.giv['500']};
	}
`;

const Badge = styled(Overline)`
	position: relative;
	height: 0px;
	top: 15px;
	transform: rotate(-45deg);
	left: -120px;
	background: white;
	font-weight: 700;
	color: ${brandColors.giv['500']};
`;

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		backgroundColor: 'white',
		minWidth: '330px',
		boxShadow: '0 5px 16px rgba(0, 0, 0, 0.15)',
		color: brandColors.deep['900'],
		padding: '0px',
	},
	overlay: {
		backgroundColor: 'rgb(9 4 70 / 70%)',
		zIndex: 1070,
	},
};

export default WalletModal;
