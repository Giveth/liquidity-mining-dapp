import { EnvConfig, StakingType } from '../types/config';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 42, // Kovan
	XDAI_NETWORK_NUMBER: 100, // xDAI

	MAINNET_NETWORK: {
		chainId: '0x2a', // A 0x-prefixed hexadecimal string
		chainName: 'Kovan',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH', // 2-6 characters long
			decimals: 18,
		},
		rpcUrls: [
			'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
		],
		blockExplorerUrls: ['https://kovan.etherscan.io'],
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
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
	},

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '0x03472537CB64652Aa1224E4aaF6f33a34e73E877',
		WETH_TOKEN_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		TOKEN_DISTRO_ADDRESS: '0x95c76AEaDf98dbD5ef6E2acD8308E563302AF2e3',
		GIV: {
			LM_ADDRESS: '0x61296aEC102bE83Aaa350B408b5F6B9466F86Dd9',
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
				LM_ADDRESS: '0x5dA8196427475C0026B465454156f0D31236C88B',
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
			LM_ADDRESS: '0xcdB04cb27AA12B31F30789731B94712C72080FF0',
			GARDEN_ADDRESS: '0x0bbec1F6bf78955ade32E7A927058aD6044B1Da5',
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
