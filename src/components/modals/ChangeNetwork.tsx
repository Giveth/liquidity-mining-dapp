import { FC, useContext, useEffect } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
import config from '../../configuration';
import { IconEthereum } from '../Icons/Eth';
import { IconXDAI } from '../Icons/XDAI';
import { H4, B, neutralColors } from '@giveth/ui-design-system';
import { OnboardContext } from '../../context/onboard.context';
interface IChangeNetworkModalProps extends IModal {
	targetNetwork: number;
}

export const ChangeNetworkModal: FC<IChangeNetworkModalProps> = ({
	showModal,
	setShowModal,
	targetNetwork,
}) => {
	const { network: walletNetwork } = useContext(OnboardContext);

	useEffect(() => {
		if (walletNetwork === targetNetwork) {
			setShowModal(false);
		}
	}, [walletNetwork, setShowModal, targetNetwork]);

	const NetworkName =
		targetNetwork === config.MAINNET_NETWORK_NUMBER ? 'Ethereum' : 'xDAI';

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<ChangeNetworkModalContainer>
				{targetNetwork === config.MAINNET_NETWORK_NUMBER ? (
					<IconEthereum size={64} />
				) : (
					<IconXDAI size={64} />
				)}
				<Title>Switch to {NetworkName}</Title>
				<Desc>Please switch your wallet network to {NetworkName}.</Desc>
			</ChangeNetworkModalContainer>
		</Modal>
	);
};

const ChangeNetworkModalContainer = styled.div`
	width: 500px;
	padding: 62px 60px;
	color: ${neutralColors.gray[100]};
`;

const Title = styled(H4)`
	margin: 18px 0 24px;
`;

const Desc = styled(B)``;
