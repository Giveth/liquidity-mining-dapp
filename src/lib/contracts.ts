import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { abi as UniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { abi as NonfungiblePositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';

import UNISWAP_V3_STAKER_ABI from '@/artifacts/uniswap_v3_staker.json';
import STAKING_REWARDS_ABI from '@/artifacts/staking_rewards.json';
import { UniswapV3PoolStakingConfig } from '@/types/config';
import config from '@/configuration';

const mainnetConfig = config.MAINNET_CONFIG;
const uniswapConfig = mainnetConfig.pools[0] as UniswapV3PoolStakingConfig;

const {
	NFT_POSITIONS_MANAGER_ADDRESS,
	UNISWAP_V3_STAKER,
	STAKING_REWARDS_CONTRACT,
	UNISWAP_V3_LP_POOL,
} = uniswapConfig;

export const getNftManagerPositionsContract = (
	provider: Web3Provider | null,
) => {
	const signer = provider?.getSigner();

	if (!signer) {
		throw new Error('Signer not found!');
	}

	return new Contract(
		NFT_POSITIONS_MANAGER_ADDRESS,
		NonfungiblePositionManagerABI,
		signer,
	);
};

export const getUniswapV3StakerContract = (provider: Web3Provider | null) => {
	const signer = provider?.getSigner();

	if (!signer) {
		throw new Error('Signer not found!');
	}

	return new Contract(UNISWAP_V3_STAKER, UNISWAP_V3_STAKER_ABI, signer);
};

export const getStakingRewardsContract = (provider: Web3Provider | null) => {
	const signer = provider?.getSigner();

	if (!signer) {
		throw new Error('Signer not found!');
	}

	return new Contract(STAKING_REWARDS_CONTRACT, STAKING_REWARDS_ABI, signer);
};

export const getGivethV3PoolContract = (provider: Web3Provider | null) => {
	const signer = provider?.getSigner();

	if (!signer) {
		throw new Error('Signer not found!');
	}

	return new Contract(UNISWAP_V3_LP_POOL, UniswapV3PoolABI, signer);
};
