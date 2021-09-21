import { EnvConfig, StakingType } from '../types/config';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 42, // Kovan
	XDAI_NETWORK_NUMBER: 4, // Rinkeby

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '0x86B94D365c94De153d6023f243c2b6e6c6c7626C',
		WETH_TOKEN_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		TOKEN_DISTRO_ADDRESS: '0x3087Aa93143f23BB0da42c9FAD6C1D5993bE6Fe6',
		GIV: {
			LM_ADDRESS: '0x9cA5A8c67677A6341D147978c2661Dc6abc82E2c',
		},

		nodeUrl: 'https://kovan.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				POOL_ADDRESS: '0x8A094453df88D5D6B27162F949898e2d95462f80',
				LM_ADDRESS: '0x51F3E5C39a11fe189585FA2FD61A6b60E4Bc723a',
				type: StakingType.UNISWAP,
				title: 'GIV / ETH',
				description: '50% GIV, 50% ETH',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0x86B94D365c94De153d6023f243c2b6e6c6c7626C/ETH',
			},
			{
				POOL_ADDRESS: '0x632045A9CFa9d232d0dd46702033C850D0E06f0F',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0x632045a9cfa9d232d0dd46702033c850d0e06f0f000200000000000000000128',
				LM_ADDRESS: '0x3A2F69aC62888DbBa4fb36e18a76435E8357465E',
				type: StakingType.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://kovan.balancer.fi/#/pool/0x632045a9cfa9d232d0dd46702033c850d0e06f0f000200000000000000000128',
			},
		],
	},

	XDAI_CONFIG: {
		TOKEN_ADDRESS: '0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
		MERKLE_ADDRESS: '0x4d6630e5c3C4f00D0B9737784e15bB0F493A23A7',
		TOKEN_DISTRO_ADDRESS: '0xc35D99F05C7e340eB78E850696DbF3dbb51C4160',

		nodeUrl: 'https://rinkeby.infura.io/v3/' + INFURA_API_KEY,
		GIV: {
			LM_ADDRESS: '0xD97DfF18cCd1e0cA32d5E27245C783E195735c00',
		},

		pools: [
			{
				POOL_ADDRESS: '0xb3c4538b9413522c25e18ba1095f43ca780813f2',
				LM_ADDRESS: '0xe22d49ef8384599920D2915D7cF3f79B72c5683E',
				type: StakingType.UNISWAP,
				title: 'GIV / UNI',
				description: '50% GIV, 50% UNI',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
			},
			{
				POOL_ADDRESS: '0x8fb2d187eba62970c13d0037304260b9fef721c5',
				LM_ADDRESS: '0xD2c2b6EC1c1C5Be0b5a722d00Bb085cAE7Dead0e',
				type: StakingType.UNISWAP,
				title: 'ETH / UNI',
				description: '50% ETH, 50% UNI',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/ETH/0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
			},
		],
	},
};

export default config;
