import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { abi as UniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { abi as NonfungiblePositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';

import {
	NFT_POSITIONS_MANAGER_ADDRESS,
	UNISWAP_V3_STAKER,
	STAKING_REWARDS_CONTRACT,
	UNISWAP_V3_LP_POOL,
} from '../utils/constants';

import UNISWAP_V3_STAKER_ABI from '@/artifacts/uniswap_v3_staker.json';
import STAKING_REWARDS_ABI from '@/artifacts/staking_rewards.json';
import config from '@/configuration';

const network = config.MAINNET_NETWORK_NUMBER;

const nftManagerPositionsAddress = NFT_POSITIONS_MANAGER_ADDRESS[network];

const uniswapV3StakerAddress = UNISWAP_V3_STAKER[network];

const stakingRewardsAddress = STAKING_REWARDS_CONTRACT[network];

const givethV3PoolAddress = UNISWAP_V3_LP_POOL[network];

export const getNftManagerPositionsContract = (
	provider: Web3Provider | null,
) => {
	const signer = provider?.getSigner();

	if (!signer) {
		throw new Error('Signer not found!');
	}

	return new Contract(
		nftManagerPositionsAddress,
		NonfungiblePositionManagerABI,
		signer,
	);
};

export const getUniswapV3StakerContract = (provider: Web3Provider | null) => {
	const signer = provider?.getSigner();

	if (!signer) {
		throw new Error('Signer not found!');
	}

	return new Contract(uniswapV3StakerAddress, UNISWAP_V3_STAKER_ABI, signer);
};

export const getStakingRewardsContract = (provider: Web3Provider | null) => {
	const signer = provider?.getSigner();

	if (!signer) {
		throw new Error('Signer not found!');
	}

	return new Contract(stakingRewardsAddress, STAKING_REWARDS_ABI, signer);
};

export const getGivethV3PoolContract = (provider: Web3Provider | null) => {
	const signer = provider?.getSigner();

	if (!signer) {
		throw new Error('Signer not found!');
	}

	return new Contract(givethV3PoolAddress, UniswapV3PoolABI, signer);
};
