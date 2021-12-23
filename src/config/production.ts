import { EnvConfig, StakingType } from '../types/config';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 1, // ETH
	XDAI_NETWORK_NUMBER: 100, // xDAI

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
			'https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-kovan-develop',
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
		blockExplorerName: ['Blockscout'],
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-xdai-develop',
	},

	MAINNET_CONFIG: {
		TOKEN_ADDRESS: '0x900d7e4985461ef158f04ca2Ef1aBd136c620DA0',
		WETH_TOKEN_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		TOKEN_DISTRO_ADDRESS: '0xA43C366b0360Da3A6021a91991652cc8806423dB',
		GIV: {
			LM_ADDRESS: '0xbDD6F1865E882a412D88d903cDB2817d919B0d36',
			BUY_LINK:
				'https://app.uniswap.org/#/swap?outputCurrency=0x900d7e4985461ef158f04ca2Ef1aBd136c620DA0',
		},

		nodeUrl: 'https://kovan.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				INCENTIVE_START_TIME: 1639683000,
				INCENTIVE_END_TIME: 1655407800,
				INCENTIVE_REWARD_AMOUNT: 10000000,
				NFT_POSITIONS_MANAGER_ADDRESS:
					'0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
				UNISWAP_V3_STAKER: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
				STAKING_REWARDS_CONTRACT:
					'0xfA656B81cEC0deD6Acd5Bb1a60A06914aB21A0B3',
				REWARD_TOKEN: '0x43A440176FDB70aA3730564B0D1e435628f61D3F',
				UNISWAP_V3_LP_POOL:
					'0x05f9c5ccc01bc4658516b664be14fb89121c9d15',
				INCENTIVE_REFUNDEE_ADDRESS:
					'0x5f672d71399d8cDbA64f596394b4f4381247E025',
				POOL_ADDRESS: '0xa48C26fF05F47a2eEd88C09664de1cb604A21b01',
				LM_ADDRESS: '0x1aD46D40648639f84a396Fef32132888038c5aA8',
				type: StakingType.UNISWAP,
				title: 'GIV / ETH',
				description: '0.3% tier only',
				provideLiquidityLink: `https://app.uniswap.org/#/add/ETH/0x900d7e4985461ef158f04ca2Ef1aBd136c620DA0/3000`,
				unit: 'NFT',
			},
			{
				POOL_ADDRESS: '0x81343c08cccd0e13f3c49c8270c93edc5f3d0fc6',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0x81343c08cccd0e13f3c49c8270c93edc5f3d0fc6000200000000000000000518',
				LM_ADDRESS: '0x9aF8e5FF803D64f1e10688413e75C656d883Ca70',
				type: StakingType.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://kovan.app.balancer.fi/#/pool/0x81343c08cccd0e13f3c49c8270c93edc5f3d0fc6000200000000000000000518',
				unit: 'LP',
			},
		],
	},

	XDAI_CONFIG: {
		TOKEN_ADDRESS: '0x7aAde4907a8e2412BEACbE42E51aaeE5B6085f24',
		MERKLE_ADDRESS: '0x243d4d20E2aEA0565F3504505027255f84c1ad06',
		TOKEN_DISTRO_ADDRESS: '0x4be013Ee4Cdda158338EC99e64c8c832147bc4cc',

		nodeUrl: 'https://rpc.xdaichain.com/',
		GIV: {
			LM_ADDRESS: '0x0Aec14Fb84f1bE403E77232E8462106136179f98',
			GARDEN_ADDRESS: '0x0d455538c9b6f9a699272a9bd44f6a36a93adf9b',
			BUY_LINK:
				'https://app.honeyswap.org/#/swap?outputCurrency=0x7aAde4907a8e2412BEACbE42E51aaeE5B6085f24',
		},

		pools: [
			{
				POOL_ADDRESS: '0x42eE83e61d8A497CcCcf668C126234fb67B616Bd',
				LM_ADDRESS: '0x94cce6B7448e69526Da8d9c9d125fBdf94F77D97',
				type: StakingType.HONEYSWAP,
				title: 'GIV / HNY',
				description: '50% GIV, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x7aAde4907a8e2412BEACbE42E51aaeE5B6085f24/0x69F79C9eA174d4659B18c7993c7EFbBbB58cF068',
				unit: 'LP',
			},
			{
				POOL_ADDRESS: '0x633799f6d456ACBb20734ecC185B2Ee94995E456',
				LM_ADDRESS: '0x6EB0bF719FE7ce41AcF82434B226F9d94704A1bA',
				type: StakingType.SUSHISWAP,
				title: 'GIV / ETH',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://app.sushi.com/add/0x7aAde4907a8e2412BEACbE42E51aaeE5B6085f24/0x736a98655049433f79dCcF5e54b887E8890b63D1',
				unit: 'LP',
			},
		],
	},
};

export default config;
