import { EnvConfig } from '../types/config'

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 1,
	XDAI_NETWORK_NUMBER: 100,

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '',
		WETH_TOKEN_ADDRESS: '',
		TOKEN_DISTRO_ADDRESS: '',

		UNISWAP: {
			POOL_ADDRESS: '',
			LM_ADDRESS: '',
		},
		BALANCER: {
			POOL_ADDRESS: '',
			LM_ADDRESS: '',
		},
		GIV: {
			POOL_ADDRESS: '',
			LM_ADDRESS: '',
		},
	},

	XDAI_CONFIG: {
		TOKEN_ADDRESS: '',
		MERKLE_ADDRESS: '',
		TOKEN_DISTRO_ADDRESS: '',

		UNISWAP_ETH_GIV: {
			POOL_ADDRESS: '',
			LM_ADDRESS: '',
		},
		UNISWAP_UNI_GIV: {
			POOL_ADDRESS: '',
			LM_ADDRESS: '',
		},

		GIV: {
			POOL_ADDRESS: '0xc60e38C6352875c051B481Cbe79Dd0383AdB7817',
			LM_ADDRESS: '0xF66823fdc33B9F4C66dB4C3394FF139872C12f16',
		},
	},
}

export default config
