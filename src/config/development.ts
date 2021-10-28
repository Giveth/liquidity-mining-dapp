import { EnvConfig, StakingType } from '../types/config';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 42, // Kovan
	XDAI_NETWORK_NUMBER: 4, // Rinkeby

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '0x03472537CB64652Aa1224E4aaF6f33a34e73E877',
		WETH_TOKEN_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		TOKEN_DISTRO_ADDRESS: '0xa984579A44372a350965843B5F227a2c5A6dBf03',
		GIV: {
			LM_ADDRESS: '0xdE6D00f5Fbf44EfE5935CDD738BC3B57bB398bdc',
		},

		nodeUrl: 'https://kovan.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				POOL_ADDRESS: '0xa48C26fF05F47a2eEd88C09664de1cb604A21b01',
				LM_ADDRESS: '0x1aD46D40648639f84a396Fef32132888038c5aA8',
				type: StakingType.UNISWAP,
				title: 'GIV / ETH',
				description: '50% GIV, 50% ETH',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0x46e37D6E86022a1A2b9E6380960130f8e3EB1246/ETH',
			},
			{
				POOL_ADDRESS: '0xe805c864992e6a6cBf46E7E81C7154B78155D0ac',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0xe805c864992e6a6cbf46e7e81c7154b78155d0ac0002000000000000000001a3',
				LM_ADDRESS: '0x5703cD29e9216711b1114F53e94577A7207DBFBb',
				type: StakingType.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://kovan.app.balancer.fi/#/pool/0xe805c864992e6a6cbf46e7e81c7154b78155d0ac0002000000000000000001a3',
			},
		],
	},

	XDAI_CONFIG: {
		TOKEN_ADDRESS: '0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
		MERKLE_ADDRESS: '0x2fce044d590552b0aaae13b73981ed9b2C6a2eF4',
		TOKEN_DISTRO_ADDRESS: '0x11f46f4dC9e3d2Ca7179bAEa2418e0ef8cCB5736',

		nodeUrl: 'https://rinkeby.infura.io/v3/' + INFURA_API_KEY,
		GIV: {
			LM_ADDRESS: '0xdF6e8a7A6A8F8861E44234fFBC42C1A2d1B1B0ec',
		},

		pools: [
			{
				POOL_ADDRESS: '0xb3c4538b9413522c25e18ba1095f43ca780813f2',
				LM_ADDRESS: '0x3dFAF139203e890Ed79fE7f8cc1AC14951270e40',
				type: StakingType.UNISWAP,
				title: 'GIV / UNI',
				description: '50% GIV, 50% UNI',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
			},
			{
				POOL_ADDRESS: '0x8fb2d187eba62970c13d0037304260b9fef721c5',
				LM_ADDRESS: '0x9c2A4b85e5b6CC72d112E2707844eB68DE616ee1',
				type: StakingType.UNISWAP,
				title: 'ETH / GIV',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/ETH/0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
			},
		],
	},
};

export default config;
