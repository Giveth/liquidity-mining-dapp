import { useContext, useState } from 'react';
import styled from 'styled-components';
import { OnboardContext } from '../context/onboard.context';
import config from '../configuration';
import { B, brandColors, IconETH } from '@giveth/ui-design-system';
import { Row } from './styled-components/Grid';

declare global {
	interface Window {
		ethereum: any;
	}
}

const NetworkSelectorContainer = styled(Row)`
	width: 270px;
	height: 48px;
	border-radius: 88px;
	border: 1px solid ${brandColors.giv[600]};
	overflow: hidden;
	cursor: pointer;
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
	const { network: walletNetwork, provider } = useContext(OnboardContext);

	const handleChangeNetwork = async (network: number) => {
		if (walletNetwork !== network) {
			if (typeof window.ethereum !== 'undefined') {
				const { ethereum } = window;
				try {
					await ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: '0x' + network.toString(16) }],
					});
				} catch (switchError: any) {
					// This error code indicates that the chain has not been added to MetaMask.
					if (switchError.code === 4902) {
						console.log('chain has not been added to MetaMask');
						// try {
						// 	await ethereum.request({
						// 		method: 'wallet_addEthereumChain',
						// 		params: [
						// 			{
						// 				chainId: '0xf00',
						// 				rpcUrl: 'https://...' /* ... */,
						// 			},
						// 		],
						// 	});
						// } catch (addError) {
						// 	// handle "add" error
						// }
					}
					// handle other "switch" errors
				}
			}
		}
	};

	return (
		<NetworkSelectorContainer>
			<XDaiSelecor
				isSelected={walletNetwork === config.XDAI_NETWORK_NUMBER}
				onClick={() => {
					handleChangeNetwork(config.XDAI_NETWORK_NUMBER);
				}}
			>
				<B>xDAI</B>
			</XDaiSelecor>
			<EthSelector
				isSelected={walletNetwork === config.MAINNET_NETWORK_NUMBER}
				onClick={() => {
					handleChangeNetwork(config.MAINNET_NETWORK_NUMBER);
				}}
			>
				<IconETH size={24} />
				<B>Ethereum</B>
			</EthSelector>
		</NetworkSelectorContainer>
	);
};
