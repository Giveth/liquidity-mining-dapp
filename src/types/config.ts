export interface BasicStakingConfig {
	LM_ADDRESS: string;
	GARDEN_ADDRESS?: string;
	BUY_LINK?: string;
}

export enum StakingType {
	UNISWAP = 'Uniswap',
	BALANCER = 'Balancer',
	SUSHISWAP = 'Sushiswap',
	HONEYSWAP = 'Honeyswap',
	GIV_LM = 'Staking',
}

export type PoolStakingConfig =
	| SimplePoolStakingConfig
	| BalancerPoolStakingConfig
	| UniswapV3PoolStakingConfig;

export interface SimplePoolStakingConfig extends BasicStakingConfig {
	POOL_ADDRESS: string;
	type: StakingType;
	title: string;
	description?: string;
	provideLiquidityLink?: string;
	unit: string;
}

export interface UniswapV3PoolStakingConfig extends SimplePoolStakingConfig {
	INCENTIVE_START_TIME: number;
	INCENTIVE_END_TIME: number;
	NFT_POSITIONS_MANAGER_ADDRESS: string;
	UNISWAP_V3_STAKER: string;
	STAKING_REWARDS_CONTRACT: string;
	REWARD_TOKEN: string;
	UNISWAP_V3_LP_POOL: string;
	INCENTIVE_REFUNDEE_ADDRESS: string;
}
export interface BalancerPoolStakingConfig extends SimplePoolStakingConfig {
	VAULT_ADDRESS: string;
	POOL_ID: string;
}
export interface BasicNetworkConfig {
	TOKEN_ADDRESS: string;
	WETH_TOKEN_ADDRESS?: string;
	TOKEN_DISTRO_ADDRESS: string;
	GIV: BasicStakingConfig;
	nodeUrl: string;
	pools: Array<
		| SimplePoolStakingConfig
		| BalancerPoolStakingConfig
		| UniswapV3PoolStakingConfig
	>;
}

interface MainnetNetworkConfig extends BasicNetworkConfig {}
interface XDaiNetworkConfig extends BasicNetworkConfig {
	MERKLE_ADDRESS: string;
}

export interface EthereumChainParameter {
	chainId: string; // A 0x-prefixed hexadecimal string
	chainName: string;
	nativeCurrency: {
		name: string;
		symbol: string; // 2-6 characters long
		decimals: 18;
	};
	rpcUrls: string[];
	blockExplorerUrls?: string[];
	iconUrls?: string[]; // Currently ignored.
}

export interface ExtremeEthereumChainParameter extends EthereumChainParameter {
	blockExplorerName: string[];
	subgraphAddress: string;
}

export interface EnvConfig {
	MAINNET_NETWORK_NUMBER: number;
	XDAI_NETWORK_NUMBER: number;
	MAINNET_NETWORK: ExtremeEthereumChainParameter;
	XDAI_NETWORK: ExtremeEthereumChainParameter;
	MAINNET_CONFIG: MainnetNetworkConfig;
	XDAI_CONFIG: XDaiNetworkConfig;
	GARDEN_LINK: string;
}

export interface GlobalConfig extends EnvConfig {
	TOKEN_NAME: string;
	POLLING_INTERVAL: number;
	TOKEN_PRECISION: number;

	NETWORKS_CONFIG: {
		[key: number]: MainnetNetworkConfig | XDaiNetworkConfig;
	};
	INFURA_API_KEY: string | undefined;
	BLOCKNATIVE_DAPP_ID: string | undefined;
}
