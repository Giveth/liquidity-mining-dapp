export interface BasicStakingConfig {
	LM_ADDRESS: string;
}

export interface GIVStakingConfig extends BasicStakingConfig {
	GARDEN_ADDRESS?: string;
}

export enum StakingType {
	UNISWAP = 'UNISWAP',
	BALANCER = 'BALANCER',
	HONEYSWAP = 'HONEY SWAP',
	GIV_STREAM = 'GIV STREAM',
}

export enum Currencies {
	GIV,
	ETH,
	UNI,
}

export type PoolStakingConfig =
	| SimplePoolStakingConfig
	| BalancerPoolStakingConfig;

export interface SimplePoolStakingConfig extends BasicStakingConfig {
	POOL_ADDRESS: string;
	type: StakingType;
	title: string;
	description: string;
	provideLiquidityLink?: string;
}

export interface BalancerPoolStakingConfig extends SimplePoolStakingConfig {
	VAULT_ADDRESS: string;
	POOL_ID: string;
}
export interface BasicNetworkConfig {
	TOKEN_ADDRESS: string;
	WETH_TOKEN_ADDRESS?: string;
	TOKEN_DISTRO_ADDRESS: string;
	GIV: GIVStakingConfig;
	nodeUrl: string;
	pools: Array<SimplePoolStakingConfig | BalancerPoolStakingConfig>;
}

interface MainnetNetworkConfig extends BasicNetworkConfig {}
interface XDaiNetworkConfig extends BasicNetworkConfig {
	MERKLE_ADDRESS: string;
}

export interface EnvConfig {
	MAINNET_NETWORK_NUMBER: number;
	XDAI_NETWORK_NUMBER: number;
	MAINNET_CONFIG: MainnetNetworkConfig;
	XDAI_CONFIG: XDaiNetworkConfig;
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
