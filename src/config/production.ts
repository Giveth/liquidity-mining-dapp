import { EnvConfig } from '../types/config';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 1,
	XDAI_NETWORK_NUMBER: 100,

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '',
		WETH_TOKEN_ADDRESS: '',
		TOKEN_DISTRO_ADDRESS: '',

		nodeUrl: 'https://mainnet.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				POOL_ADDRESS: '',
				LM_ADDRESS: '',
				type: '',
				title: '',
				description: '',
			},
			{
				POOL_ADDRESS: '',
				LM_ADDRESS: '',
				type: '',
				title: '',
				description: '',
			},
		],

		GIV: {
			LM_ADDRESS: '',
		},
	},

	XDAI_CONFIG: {
		TOKEN_ADDRESS: '',
		MERKLE_ADDRESS: '',
		TOKEN_DISTRO_ADDRESS: '',

		nodeUrl: 'https://rpc.xdaichain.com/',

		pools: [
			{
				POOL_ADDRESS: '',
				LM_ADDRESS: '',
				type: '',
				title: '',
				description: '',
			},
			{
				POOL_ADDRESS: '',
				LM_ADDRESS: '',
				type: '',
				title: '',
				description: '',
			},
		],

		GIV: {
			LM_ADDRESS: '0xF66823fdc33B9F4C66dB4C3394FF139872C12f16',
		},
	},
};

export default config;
