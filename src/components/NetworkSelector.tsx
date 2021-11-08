import { useContext } from 'react';
import styled from 'styled-components';
import { OnboardContext } from '../context/onboard.context';
import config from '../configuration';
import { B, brandColors, IconETH } from '@giveth/ui-design-system';
import { Row } from './styled-components/Grid';

const NetworkSelectorContainer = styled(Row)`
	width: 270px;
	height: 48px;
	border-radius: 88px;
	border: 1px solid ${brandColors.giv[600]};
	overflow: hidden;
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
	const { network: walletNetwork, provider } = useContext(OnboardContext);

	return (
		<NetworkSelectorContainer>
			{/* {walletNetwork === config.XDAI_NETWORK_NUMBER &&} */}
			<XDaiSelecor
				isSelected={walletNetwork === config.XDAI_NETWORK_NUMBER}
			>
				<B>xDAI</B>
			</XDaiSelecor>
			<EthSelector
				isSelected={walletNetwork === config.MAINNET_NETWORK_NUMBER}
			>
				<IconETH size={24} />
				<B>Ethereum</B>
			</EthSelector>
		</NetworkSelectorContainer>
	);
};
