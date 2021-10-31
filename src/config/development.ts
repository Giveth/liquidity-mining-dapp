import { EnvConfig, StakingType } from '../types/config';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 42, // Kovan
	XDAI_NETWORK_NUMBER: 100, // xDAI

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '0x03472537CB64652Aa1224E4aaF6f33a34e73E877',
		WETH_TOKEN_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		TOKEN_DISTRO_ADDRESS: '0x60A936F085403160864653B7d0d2c3bc133d18D0',
		GIV: {
			LM_ADDRESS: '0x8d74ee0C611fA62210B66e051f31A0c103b6eDD6',
		},

		nodeUrl: 'https://kovan.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			// {
			// 	POOL_ADDRESS: '0xa48C26fF05F47a2eEd88C09664de1cb604A21b01',
			// 	LM_ADDRESS: '0x1aD46D40648639f84a396Fef32132888038c5aA8',
			// 	type: StakingType.UNISWAP,
			// 	title: 'GIV / ETH',
			// 	description: '50% GIV, 50% ETH',
			// 	provideLiquidityLink:
			// 		'https://app.uniswap.org/#/add/v2/0x46e37D6E86022a1A2b9E6380960130f8e3EB1246/ETH',
			// },
			{
				POOL_ADDRESS: '0x1ee71e1ed744ae6d4058f5c7797c2e583dbfb095',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0x1ee71e1ed744ae6d4058f5c7797c2e583dbfb095000200000000000000000260',
				LM_ADDRESS: '0x087Cbc387b8746A73E3EbA9A31782F5ee7B6cC45',
				type: StakingType.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://kovan.app.balancer.fi/#/pool/0x1ee71e1ed744ae6d4058f5c7797c2e583dbfb095000200000000000000000260',
			},
		],
	},

	XDAI_CONFIG: {
		TOKEN_ADDRESS: '0x5d32A9BaF31A793dBA7275F77856A47A0F5d09b3',
		MERKLE_ADDRESS: '0x8ECebE69d45d357e5aa2719999B69d7c65003932',
		TOKEN_DISTRO_ADDRESS: '0xf11aC05c97F8845f6b974e9e327129d36683cC90',

		nodeUrl: 'https://rpc.xdaichain.com/',
		GIV: {
			LM_ADDRESS: '0x4358c99abFe7A9983B6c96785b8870b5412C5B4B',
		},

		pools: [
			{
				POOL_ADDRESS: '0xc81c327f43eC566E14C64AedE5DCf5d9c120D5eb',
				LM_ADDRESS: '0x491f1Cc76d619061b833287F493136A2D52BB18e',
				type: StakingType.HONEYSWAP,
				title: 'GIV / HNY',
				description: '50% GIV, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x5d32A9BaF31A793dBA7275F77856A47A0F5d09b3/0x69F79C9eA174d4659B18c7993c7EFbBbB58cF068',
			},
			{
				POOL_ADDRESS: '0x9Eb16810488760580232fBdd8D3f41994AB0e51D',
				LM_ADDRESS: '0x00e97BCf2E9A5F6ECF006f89B094255263B16686',
				type: StakingType.HONEYSWAP,
				title: 'ETH / GIV',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x5d32A9BaF31A793dBA7275F77856A47A0F5d09b3/0x736a98655049433f79dCcF5e54b887E8890b63D1',
			},
		],
	},
};

export default config;
