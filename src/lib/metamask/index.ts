import config from '@/configuration';
import { networksParams } from '@/utils/constants';

declare let window: any;

const { MAINNET_CONFIG, XDAI_CONFIG } = config;

const tokenImage =
	'https://raw.githubusercontent.com/Giveth/giveth-design-assets/master/02-logos/GIV%20Token/GIVToken_200x200.png';

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

export async function addGIVToken(network: number): Promise<void> {
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

export async function addToken(
	tokenAddress: string,
	tokenSymbol: string,
	tokenDecimals: number,
	tokenImage: string,
) {
	const { ethereum } = window;
	try {
		// wasAdded is a boolean. Like any RPC method, an error may be thrown.
		const wasAdded = await ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20', // Initially only supports ERC20, but eventually more!
				options: {
					address: tokenAddress, // The address that the token is at.
					symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
					decimals: tokenDecimals, // The number of decimals in the token
					image: tokenImage, // A string url of the token logo
				},
			},
		});

		if (wasAdded) {
			console.log('Thanks for your interest!');
		} else {
			console.log('Your loss!');
		}
	} catch (error) {
		console.log(error);
	}
}
