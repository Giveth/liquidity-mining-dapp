import config from '@/configuration';
import { networksParams } from '@/utils/constants';

declare let window: any;

const { MAINNET_CONFIG, XDAI_CONFIG } = config;

const tokenImage =
	'https://giveth.io/_next/image?url=%2Fimages%2Fgiveth-logo-blue.svg&w=128&q=75';

const { MAINNET_NETWORK_NUMBER, XDAI_NETWORK_NUMBER } = config;

const tokenOptions = {
	[MAINNET_NETWORK_NUMBER]: {
		address: MAINNET_CONFIG.TOKEN_ADDRESS,
		symbol: config.TOKEN_NAME,
		decimals: 18,
		image: tokenImage,
	},
	[XDAI_NETWORK_NUMBER]: {
		address: XDAI_CONFIG.TOKEN_ADDRESS,
		symbol: config.TOKEN_NAME,
		decimals: 18,
		image: tokenImage,
	},
};

export async function addNodeToken(network: number): Promise<void> {
	const { ethereum } = window;

	await ethereum.request({
		method: 'wallet_watchAsset',
		params: {
			type: 'ERC20',
			options: tokenOptions[network],
		},
	});
}

export async function addNetwork(network: number): Promise<void> {
	const { ethereum } = window;

	await ethereum.request({
		method: 'wallet_addEthereumChain',
		params: [{ ...networksParams[network] }],
	});
}

export async function switchNetwork(network: number): Promise<void> {
	const { ethereum } = window;
	const { chainId } = networksParams[network];

	try {
		await ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId }],
		});
	} catch (switchError: any) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError.code === 4902) {
			addNetwork(network);
		}
	}
}
