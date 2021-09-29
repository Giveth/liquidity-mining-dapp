import { EnvConfig, StakingType } from '../types/config';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 42, // Kovan
	XDAI_NETWORK_NUMBER: 4, // Rinkeby

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '0x46e37D6E86022a1A2b9E6380960130f8e3EB1246',
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
		MERKLE_ADDRESS: '0x93C057F95C51dfa3b2A536d97691E855B00D0178',
		TOKEN_DISTRO_ADDRESS: '0xE77D387b4be1076891868060c32E81BC3b89C730',

		nodeUrl: 'https://rinkeby.infura.io/v3/' + INFURA_API_KEY,
		GIV: {
			LM_ADDRESS: '0x3c44b1E8b93efb496D0946Aa132E7b4C190d28fB',
		},

		pools: [
			{
				POOL_ADDRESS: '0xb3c4538b9413522c25e18ba1095f43ca780813f2',
				LM_ADDRESS: '0xC3B9d4FC4A9CdD6a410A09Bae11d5619286254cE',
				type: StakingType.UNISWAP,
				title: 'GIV / UNI',
				description: '50% GIV, 50% UNI',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
			},
			{
				POOL_ADDRESS: '0x8fb2d187eba62970c13d0037304260b9fef721c5',
				LM_ADDRESS: '0xa194A63a0F5B362C0958DC9FB2D01B2d5e2F9DB7',
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
