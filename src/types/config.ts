interface PoolConfig {
	POOL_ADDRESS: string;
	LM_ADDRESS: string;
}
interface BasicNetworkConfig {
	TOKEN_ADDRESS: string;
	WETH_TOKEN_ADDRESS?: string;
	TOKEN_DISTRO_ADDRESS: string;
	GIV?: PoolConfig;
	nodeUrl: string;
}

interface MainnetNetworkConfig extends BasicNetworkConfig {
	UNISWAP?: PoolConfig;
	BALANCER?: PoolConfig;
}
interface XDaiNetworkConfig extends BasicNetworkConfig {
	UNISWAP_ETH_GIV?: PoolConfig;
	UNISWAP_UNI_GIV?: PoolConfig;
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
	NETWORKS_CONFIG: {
		[key: number]: MainnetNetworkConfig | XDaiNetworkConfig;
	};
	INFURA_API_KEY: string | undefined;
	BLOCKNATIVE_DAPP_ID: string | undefined;
}
