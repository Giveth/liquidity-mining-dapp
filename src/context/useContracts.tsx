import { FC, useContext, useMemo, createContext, ReactNode } from 'react';
import { Contract } from 'ethers';
import { abi as UniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { abi as NonfungiblePositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';

import {
	NFT_POSITIONS_MANAGER_ADDRESS,
	UNISWAP_V3_STAKER,
	STAKING_REWARDS_CONTRACT,
	UNISWAP_V3_LP_POOL,
	UNISWAP_QUOTER,
} from '../utils/constants';
import { OnboardContext } from './onboard.context';
import UNISWAP_V3_STAKER_ABI from '../artifacts/uniswap_v3_staker.json';
import STAKING_REWARDS_ABI from '../artifacts/staking_rewards.json';

interface IContractsContext {
	uniswapV3StakerContract: Contract | null;
	stakingRewardsContract: Contract | null;
	nftManagerPositionsContract: Contract | null;
	brightV3PoolContract: Contract | null;
	quoterContract: Contract | null;
}

const ContractsContext = createContext<IContractsContext | null>(null);

export const ContractsProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { network, provider } = useContext(OnboardContext);
	const signer = provider?.getSigner();

	const nftManagerPositionsAddress = !network
		? null
		: NFT_POSITIONS_MANAGER_ADDRESS[network];

	const uniswapV3StakerAddress = !network ? null : UNISWAP_V3_STAKER[network];

	const stakingRewardsAddress = !network
		? null
		: STAKING_REWARDS_CONTRACT[network];

	const brightV3PoolAddress = !network ? null : UNISWAP_V3_LP_POOL[network];

	const quoterAddress = !network ? null : UNISWAP_QUOTER[network];

	const nftManagerPositionsContract = useMemo(
		() =>
			!(nftManagerPositionsAddress && signer)
				? null
				: new Contract(
						nftManagerPositionsAddress,
						NonfungiblePositionManagerABI,
						signer,
				  ),
		[nftManagerPositionsAddress, signer],
	);

	const uniswapV3StakerContract = useMemo(
		() =>
			!(uniswapV3StakerAddress && signer)
				? null
				: new Contract(
						uniswapV3StakerAddress,
						UNISWAP_V3_STAKER_ABI,
						signer,
				  ),
		[uniswapV3StakerAddress, signer],
	);

	const stakingRewardsContract = useMemo(
		() =>
			!(stakingRewardsAddress && signer)
				? null
				: new Contract(
						stakingRewardsAddress,
						STAKING_REWARDS_ABI,
						signer,
				  ),
		[stakingRewardsAddress, signer],
	);

	const brightV3PoolContract = useMemo(
		() =>
			!(brightV3PoolAddress && signer)
				? null
				: new Contract(brightV3PoolAddress, UniswapV3PoolABI, signer),
		[brightV3PoolAddress, signer],
	);

	const quoterContract = useMemo(
		() =>
			!(quoterAddress && signer)
				? null
				: new Contract(quoterAddress, QuoterABI, signer),
		[quoterAddress, signer],
	);

	return (
		<ContractsContext.Provider
			value={{
				uniswapV3StakerContract,
				nftManagerPositionsContract,
				stakingRewardsContract,
				brightV3PoolContract,
				quoterContract,
			}}
		>
			{children}
		</ContractsContext.Provider>
	);
};

export function useContracts() {
	const context = useContext(ContractsContext);

	if (!context) {
		throw new Error('Contracts context not found!');
	}

	return context;
}
