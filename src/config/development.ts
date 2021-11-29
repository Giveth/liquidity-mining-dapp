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
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-xdai',
	},

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '0x03472537CB64652Aa1224E4aaF6f33a34e73E877',
		WETH_TOKEN_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		TOKEN_DISTRO_ADDRESS: '0x35f8414Ca6d5629887b9049cE99C7B592E583dd3',
		GIV: {
			LM_ADDRESS: '0x1aAA619b066360C22EBD8c597c975CACff146317',
		},

		nodeUrl: 'https://kovan.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				INCENTIVE_START_TIME: 1635007800,
				INCENTIVE_END_TIME: 1646270657,
				NFT_POSITIONS_MANAGER_ADDRESS:
					'0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
				UNISWAP_V3_STAKER: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
				STAKING_REWARDS_CONTRACT:
					'0xfA656B81cEC0deD6Acd5Bb1a60A06914aB21A0B3',
				REWARD_TOKEN: '0x6F0ACC66600e8FD1b7eD2B3eC1208D56A53Da4ac',
				UNISWAP_V3_LP_POOL:
					'0x487195072fB88ddE7DDA2Ef1A688C6380b995478',
				INCENTIVE_REFUNDEE_ADDRESS:
					'0x5f672d71399d8cDbA64f596394b4f4381247E025',
				POOL_ADDRESS: '0xa48C26fF05F47a2eEd88C09664de1cb604A21b01',
				LM_ADDRESS: '0x1aD46D40648639f84a396Fef32132888038c5aA8',
				type: StakingType.UNISWAP,
				title: 'GIV / ETH',
				provideLiquidityLink: `https://app.uniswap.org/#/add/ETH/0x03472537CB64652Aa1224E4aaF6f33a34e73E877/3000`,
			},
			{
				POOL_ADDRESS: '0x1ee71e1ed744ae6d4058f5c7797c2e583dbfb095',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0x1ee71e1ed744ae6d4058f5c7797c2e583dbfb095000200000000000000000260',
				LM_ADDRESS: '0xA14149623488A79ecfd79E63Bb7F5EF2F661A624',
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
		TOKEN_DISTRO_ADDRESS: '0x1aD46D40648639f84a396Fef32132888038c5aA8',

		nodeUrl: 'https://rpc.xdaichain.com/',
		GIV: {
			LM_ADDRESS: '0x26F033515ce926658def0939A8D9a0592D0F5cc9',
			GARDEN_ADDRESS: '0xF07eaBb35aFFB171D13435a12dbDCE728915D8A1',
		},

		pools: [
			{
				POOL_ADDRESS: '0xc81c327f43eC566E14C64AedE5DCf5d9c120D5eb',
				LM_ADDRESS: '0x523e671E6922B10c6157b265195e24e687224Fd1',
				type: StakingType.HONEYSWAP,
				title: 'GIV / HNY',
				description: '50% GIV, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x5d32A9BaF31A793dBA7275F77856A47A0F5d09b3/0x69F79C9eA174d4659B18c7993c7EFbBbB58cF068',
			},
			{
				POOL_ADDRESS: '0x8c77ba1d90c57d584aeed57bc9b55258b8be3438',
				LM_ADDRESS: '0x2C4a1620B29D551B950e48eba3813e5B5b012A2f',
				type: StakingType.HONEYSWAP,
				title: 'ETH / GIV',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://app.sushi.com/add/0x736a98655049433f79dCcF5e54b887E8890b63D1/0x5d32A9BaF31A793dBA7275F77856A47A0F5d09b3',
			},
		],
	},
};

export default config;
