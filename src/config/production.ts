import { EnvConfig } from '../types/config';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 1,
	XDAI_NETWORK_NUMBER: 100,

	GARDEN_LINK: '',

	MAINNET_NETWORK: {
		chainId: '0x1', // A 0x-prefixed hexadecimal string
		chainName: 'Ethereum Mainnet',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH', // 2-6 characters long
			decimals: 18,
		},
		rpcUrls: [],
		blockExplorerName: ['etherscan'],
		blockExplorerUrls: ['https://etherscan.io/'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-kovan',
	},

	XDAI_NETWORK: {
		chainId: '0x64',
		chainName: 'xDai',
		nativeCurrency: {
			name: 'XDAI',
			symbol: 'XDAI',
			decimals: 18,
		},
		rpcUrls: ['https://rpc.xdaichain.com'],
		blockExplorerName: ['blockscout'],
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-xdai',
	},

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '',
		WETH_TOKEN_ADDRESS: '',
		TOKEN_DISTRO_ADDRESS: '',

		nodeUrl: 'https://mainnet.infura.io/v3/' + INFURA_API_KEY,

		pools: [],

		GIV: {
			LM_ADDRESS: '',
		},
	},

	XDAI_CONFIG: {
		TOKEN_ADDRESS: '',
		MERKLE_ADDRESS: '',
		TOKEN_DISTRO_ADDRESS: '',

		nodeUrl: 'https://rpc.xdaichain.com/',

		pools: [],

		GIV: {
			LM_ADDRESS: '0xF66823fdc33B9F4C66dB4C3394FF139872C12f16',
		},
	},
};

export default config;
