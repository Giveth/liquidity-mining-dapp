import {
	EWallets,
	torusConnector,
	walletconnectConnector,
} from '@/lib/wallet/walletTypes';
import { switchNetwork as metamaskSwitchNetwork } from '@/lib/metamask';

// @DEV it's not tested yet! didn't have a multi-chain wallet to test
const switchWalletConnectNetwork = async (chainId: number) => {
	try {
		await walletconnectConnector.walletConnectProvider.connector.updateSession(
			{
				chainId,
				accounts: [],
			},
		);
	} catch (switchError: any) {
		console.error(switchError);
	}
};
export const switchNetwork = async (chainId: number) => {
	const selectedWallet = window.localStorage.getItem('selectedWallet');

	switch (selectedWallet) {
		case EWallets.METAMASK:
			await metamaskSwitchNetwork(chainId);
			break;

		case EWallets.TORUS:
			await torusConnector.changeChainId(chainId);
			break;

		case EWallets.WALLETCONNECT:
			await switchWalletConnectNetwork(chainId);
			break;

		default:
			console.log(
				'network change is not supported for wallet ',
				selectedWallet,
			);
	}
};
