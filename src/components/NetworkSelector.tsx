import { useContext, useState } from 'react';
import styled from 'styled-components';
import { OnboardContext } from '../context/onboard.context';
import config from '../configuration';
import { B, brandColors } from '@giveth/ui-design-system';
import { Row } from './styled-components/Grid';
import { IconXDAI } from './Icons/XDAI';
import { IconEthereum } from './Icons/Eth';
import { EthereumChainParameter } from '../types/config';
import { ChangeNetworkModal } from './modals/ChangeNetwork';

interface NetworkSelectorProps {
	disabled?: boolean;
}

const NetworkSelectorContainer = styled(Row)<NetworkSelectorProps>`
	width: 270px;
	height: 48px;
	border-radius: 88px;
	border: 1px solid ${brandColors.giv[600]};
	overflow: hidden;
	cursor: pointer;
	opacity: ${props => (props.disabled ? '0.2' : '1')};
	pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

interface ISelecetor {
	isSelected: boolean;
}

const Selector = styled(Row)<ISelecetor>`
	align-items: center;
	padding: 12px 24px;
	gap: 8px;
	${props => (props.isSelected ? `background: ${brandColors.giv[600]}` : '')}
`;

const XDaiSelecor = styled(Selector)`
	width: 116px;
`;

const EthSelector = styled(Selector)`
	width: 154px;
`;

export const NetworkSelector = () => {
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [targetNetwork, setTargetNetwork] = useState(1);
	const { network: walletNetwork, provider } = useContext(OnboardContext);
	const supportedNetworks = [
		config.MAINNET_NETWORK_NUMBER,
		config.XDAI_NETWORK_NUMBER,
	];

	const handleChangeNetwork = async (
		networkNumber: number,
		network: EthereumChainParameter,
	) => {
		setTargetNetwork(networkNumber);
		if (walletNetwork !== networkNumber) {
			if (typeof (window as any).ethereum !== 'undefined') {
				const { ethereum } = window as any;
				try {
					await ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: network.chainId }],
					});
				} catch (switchError: any) {
					// This error code indicates that the chain has not been added to MetaMask.
					if (switchError.code === 4902) {
						try {
							await ethereum.request({
								method: 'wallet_addEthereumChain',
								params: [network],
							});
						} catch (addError) {
							// handle "add" error
						}
					}
					// handle other "switch" errors
				}
			} else {
				setShowChangeNetworkModal(true);
			}
		}
	};

	return (
		<>
			<NetworkSelectorContainer
				disabled={!supportedNetworks.includes(walletNetwork)}
			>
				<XDaiSelecor
					isSelected={walletNetwork === config.XDAI_NETWORK_NUMBER}
					onClick={() => {
						handleChangeNetwork(
							config.XDAI_NETWORK_NUMBER,
							config.XDAI_NETWORK,
						);
					}}
				>
					<IconXDAI size={24} />
					<B>xDai</B>
				</XDaiSelecor>
				<EthSelector
					isSelected={
						walletNetwork === config.MAINNET_NETWORK_NUMBER ||
						!supportedNetworks.includes(walletNetwork)
					}
					onClick={() => {
						handleChangeNetwork(
							config.MAINNET_NETWORK_NUMBER,
							config.MAINNET_NETWORK,
						);
					}}
				>
					<IconEthereum size={24} />
					<B>Ethereum</B>
				</EthSelector>
			</NetworkSelectorContainer>
			{showChangeNetworkModal && (
				<ChangeNetworkModal
					showModal={showChangeNetworkModal}
					setShowModal={setShowChangeNetworkModal}
					targetNetwork={targetNetwork}
				/>
			)}
		</>
	);
};
