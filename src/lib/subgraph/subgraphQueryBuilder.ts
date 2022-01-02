import { address } from 'bnc-onboard/dist/src/stores';

export class SubgraphQueryBuilder {
	static getBalanceQuery = (address: string): string => {
		return `
		balance(id: "${address.toLowerCase()}") {
			balance
			allocatedTokens
			claimed
			rewardPerTokenPaidGivLm
			rewardsGivLm
			rewardPerTokenPaidSushiSwap
			rewardsSushiSwap
			rewardPerTokenPaidHoneyswap
			rewardsHoneyswap
			rewardPerTokenPaidUniswap
			rewardsUniswap
			rewardPerTokenPaidBalancer
			rewardsBalancer
			givback
			balancerLp
			balancerLpStaked
			sushiswapLp
			sushiSwapLpStaked
			honeyswapLp 
			honeyswapLpStaked 
			givStaked
			allocationCount
			givDropClaimed
		}`;
	};

	static getGeneralQuery = (address: string): string => {
		return `
		{
			balances: ${SubgraphQueryBuilder.getBalanceQuery(address)}
		}
		`;
	};

	static getMainnetQuery = (address: string): string => {
		return SubgraphQueryBuilder.getGeneralQuery(address);
	};

	static getXDaiQuery = (address: string): string => {
		return SubgraphQueryBuilder.getGeneralQuery(address);
	};
}
