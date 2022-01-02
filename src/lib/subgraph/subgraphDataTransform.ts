import { ISubgraphValue } from '@/context/subgraph.context';
import { IBalances, ZeroBalances } from '@/types/subgraph';
import { ethers } from 'ethers';
const BN = ethers.BigNumber.from;

const transformBalanceInfo = (info: any): IBalances => {
	if (!info) return ZeroBalances;

	const balance = BN(info.balance || 0);
	const allocatedTokens = BN(info.allocatedTokens || 0);
	const claimed = BN(info.claimed || 0);
	const rewardPerTokenPaidGivLm = BN(info.rewardPerTokenPaidGivLm || 0);
	const rewardsGivLm = BN(info.rewardsGivLm || 0);
	const rewardPerTokenPaidSushiSwap = BN(
		info.rewardPerTokenPaidSushiSwap || 0,
	);
	const rewardsSushiSwap = BN(info.rewardsSushiSwap || 0);
	const rewardPerTokenPaidHoneyswap = BN(
		info.rewardPerTokenPaidHoneyswap || 0,
	);
	const rewardsHoneyswap = BN(info.rewardsHoneyswap || 0);
	const rewardPerTokenPaidUniswap = BN(info.rewardPerTokenPaidUniswap || 0);
	const rewardsUniswap = BN(info.rewardsUniswap || 0);
	const rewardPerTokenPaidBalancer = BN(info.rewardPerTokenPaidBalancer || 0);
	const rewardsBalancer = BN(info.rewardsBalancer || 0);
	const givback = BN(info.givback || 0);
	const balancerLp = BN(info.balancerLp || 0);
	const balancerLpStaked = BN(info.balancerLpStaked || 0);
	const sushiswapLp = BN(info.sushiswapLp || 0);
	const sushiSwapLpStaked = BN(info.sushiSwapLpStaked || 0);
	const honeyswapLp = BN(info.honeyswapLp || 0);
	const honeyswapLpStaked = BN(info.honeyswapLpStaked || 0);
	const givStaked = BN(info.givStaked || 0);
	const allocationCount = Number(info.allocationCount || 0);
	const givDropClaimed = Boolean(info.givDropClaimed);

	return {
		balance,
		allocatedTokens,
		claimed,
		rewardPerTokenPaidGivLm,
		rewardsGivLm,
		rewardPerTokenPaidSushiSwap,
		rewardsSushiSwap,
		rewardPerTokenPaidHoneyswap,
		rewardsHoneyswap,
		rewardPerTokenPaidUniswap,
		rewardsUniswap,
		rewardPerTokenPaidBalancer,
		rewardsBalancer,
		givback,
		balancerLp,
		balancerLpStaked,
		sushiswapLp,
		sushiSwapLpStaked,
		honeyswapLp,
		honeyswapLpStaked,
		givStaked,
		allocationCount,
		givDropClaimed,
	};
};

export const transformSubgraphData = async (
	data: any,
): Promise<ISubgraphValue> => {
	return {
		balances: transformBalanceInfo(data?.balances),
	};
};
