export const networksParams: Record<number, any> = {
	1: {
		chainId: '0x1',
		chainName: 'Mainnet',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://etherscan.io'],
	},
	42: {
		chainId: '0x2A',
		chainName: 'Kovan',
		nativeCurrency: {
			name: 'Kovan ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://kovan.etherscan.io'],
	},
	100: {
		chainId: '0x64',
		chainName: 'xDAI Chain',
		iconUrls: [
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
		],
		nativeCurrency: {
			name: 'xDAI',
			symbol: 'xDAI',
			decimals: 18,
		},
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
	},
};

export const chainName = (chainId: number) => {
	switch (chainId) {
		case 31337:
			return 'Hardhat';
		case 1:
			return 'Mainnet';
		case 4:
			return 'Rinkeby';
		case 100:
			return 'xDai';
		case 42:
			return 'Kovan';
		default:
			return 'Unknown';
	}
};

export const DRAWER_WIDTH = 240;

export const NETWORK_MAINNET = chainName(1);
export const NETWORK_RINKEBY = chainName(4);

export const INCENTIVE_START_TIME: Record<number, number> = {
	4: 1633615415,
	42: 1635007800,
	// do not modify until rewards end
	1: 1631811600,
	100: 0,
};

export const INCENTIVE_END_TIME: Record<number, number> = {
	4: 1634825015,
	42: 1646270657,
	// do not modify until rewards end
	1: 1637085600,
	100: 0,
};

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
	4: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
	42: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
	1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
	100: '',
};

export const UNISWAP_V3_STAKER: Record<string, string> = {
	4: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
	42: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
	1: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
	100: '',
};

export const STAKING_REWARDS_CONTRACT: Record<string, string> = {
	42: '0xfA656B81cEC0deD6Acd5Bb1a60A06914aB21A0B3',
	4: '0x8eE36E719529Df01CA9F6098e4c637471F184D6D',
	1: '0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D',
	100: '0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D',
};

export const WETH: Record<string, string> = {
	42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
	4: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
	1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
	100: '',
};

export const HNY: Record<string, string> = {
	4: '',
	1: '',
	100: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
};

export const GIV: Record<string, string> = {
	4: '0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
	42: '0x03472537CB64652Aa1224E4aaF6f33a34e73E877',
	1: '',
	100: '',
};
export const REWARD_TOKEN: Record<string, string> = {
	4: '0x6F45aFf8c1e50DB099DAb43292C28240be2b7485',
	42: '0x6b66368EddB78E61179523cf21049af40f797F4E',
	1: '',
	100: '',
};

export const SUBS: Record<string, string> = {
	4: '',
	1: '',
	100: '',
};

export const HONEYSWAP_LP_POOL: Record<string, string> = {
	4: '',
	1: '',
	100: '0x0907239acfe1d0cfc7f960fc7651e946bb34a7b0',
};

export const UNISWAP_V3_LP_POOL: Record<string, string> = {
	4: '0x949Cd5D4648452687e7491cCE6D2684999Aa679E',
	42: '0x487195072fB88ddE7DDA2Ef1A688C6380b995478',
	1: '',
	100: '',
};

export const UNISWAP_QUOTER: Record<string, string> = {
	4: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
	42: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
	1: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
	100: '',
};

export const INCENTIVE_REFUNDEE_ADDRESS: Record<string, string> = {
	4: '0x5f672d71399d8cDbA64f596394b4f4381247E025',
	42: '0x5f672d71399d8cDbA64f596394b4f4381247E025',
	1: '',
	100: '',
};
