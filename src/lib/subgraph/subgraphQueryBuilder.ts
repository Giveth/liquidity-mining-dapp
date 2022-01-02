import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import config from '@/configuration';

export class SubgraphQueryBuilder {
	static getBalanceQuery = (address: string): string => {
		return `balance(id: "${address.toLowerCase()}") {
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

	private static getTokenDistroInfoQuery = (): string => {
		return `tokenDistroContractInfos(first:10){
		  id
		  initialAmount
		  duration
		  startTime
		  cliffTime
		  lockedAmount
		  totalTokens
		}
		`;
	};

	private static getUnipoolInfoQuery = (address: string): string => {
		return `unipoolContractInfo(id: "${address.toLowerCase()}"){
			totalSupply
			lastUpdateTime
			periodFinish
			rewardPerTokenStored
			rewardRate
		}
		`;
	};

	private static generateUnipoolInfoQueries = (
		configs: SimplePoolStakingConfig[],
	): string => {
		return configs
			.map(
				c =>
					`${c.type}: ${SubgraphQueryBuilder.getUnipoolInfoQuery(
						c.LM_ADDRESS,
					)}`,
			)
			.join();
	};

	static getMainnetQuery = (address: string): string => {
		return `
		{
			balances: ${SubgraphQueryBuilder.getBalanceQuery(address)}
			tokenDistroInfos: ${SubgraphQueryBuilder.getTokenDistroInfoQuery()}
			${SubgraphQueryBuilder.generateUnipoolInfoQueries([
				getGivStakingConfig(config.MAINNET_CONFIG),
				...config.MAINNET_CONFIG.pools.filter(
					c => c.type !== StakingType.UNISWAP,
				),
			])}
		}
		`;
	};

	static getXDaiQuery = (address: string): string => {
		return `
		{
			balances: ${SubgraphQueryBuilder.getBalanceQuery(address)}
			tokenDistroInfos: ${SubgraphQueryBuilder.getTokenDistroInfoQuery()}
			
			${SubgraphQueryBuilder.generateUnipoolInfoQueries([
				getGivStakingConfig(config.XDAI_CONFIG),
				...config.XDAI_CONFIG.pools,
			])}
		}
		`;
	};
}
