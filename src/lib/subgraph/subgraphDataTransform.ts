import { ISubgraphValue } from '@/context/subgraph.context';
import {
	IBalances,
	ITokenDistroInfo,
	IUnipool,
	IUniswapV3Pool,
	IUniswapV3Position,
	ZeroBalances,
} from '@/types/subgraph';
import { ethers } from 'ethers';
import { StakingType } from '@/types/config';

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
	const givbackLiquidPart = BN(info.givbackLiquidPart || 0);
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
		givbackLiquidPart,
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

const transformTokenDistroInfos = (info: any): ITokenDistroInfo => {
	const _startTime = info.startTime;
	const _cliffTime = info.cliffTime;
	const _duration = info.duration;

	const startTime = new Date(+(_startTime.toString() + '000'));
	const cliffTime = new Date(+(_cliffTime.toString() + '000'));
	const duration = +(_duration.toString() + '000');

	const endTime = new Date(startTime.getTime() + duration);
	const initialAmount = BN(info.initialAmount);
	const lockedAmount = BN(info.lockedAmount);
	const totalTokens = BN(info.totalTokens);

	return {
		initialAmount,
		lockedAmount,
		totalTokens,
		startTime,
		cliffTime,
		endTime,
	};
};

const transformUniswapV3Pool = (info: any): IUniswapV3Pool | undefined => {
	if (!info) return undefined;
	const sqrtPriceX96 = BN(info.sqrtPriceX96);
	const tick = Number(info.tick);
	const liquidity = BN(info.liquidity);
	const stakedLiquidity = BN(info.stakedLiquidity);
	const token0 = info.token0;
	const token1 = info.token1;
	return {
		token0,
		token1,
		sqrtPriceX96,
		tick,
		liquidity,
		stakedLiquidity,
	};
};

const transformUnipoolInfo = (info: any): IUnipool | undefined => {
	if (!info) return undefined;

	const _lastUpdateTime = info?.lastUpdateTime || '0';
	const _periodFinish = info?.periodFinish || '0';

	const totalSupply = BN(info?.totalSupply || 0);
	const rewardPerTokenStored = BN(info?.rewardPerTokenStored || 0);
	const rewardRate = BN(info?.rewardRate || 0);
	const lastUpdateTime = new Date(+(_lastUpdateTime.toString() + '000'));
	const periodFinish = new Date(+(_periodFinish.toString() + '000'));

	return {
		totalSupply,
		rewardPerTokenStored,
		rewardRate,
		lastUpdateTime,
		periodFinish,
	};
};

const transformUniswapPositions = (info: any): any => {
	if (!info) return {};
	const mapper = (info: any): IUniswapV3Position => {
		const tokenId = Number(info?.tokenId || 0);
		const liquidity = BN(info?.liquidity);
		const tickLower = Number(info?.tickLower);
		const tickUpper = Number(info?.tickUpper);
		const staked = Boolean(info?.staked);
		const token0 = info?.token0;
		const token1 = info?.token1;
		return {
			tokenId,
			token0,
			token1,
			liquidity,
			tickLower,
			tickUpper,
			owner: info.owner,
			staked,
			staker: info.staker,
		};
	};

	const { userStakedPositions, allPositions, userNotStakedPositions } = info;
	return {
		userStakedPositions: userStakedPositions
			? userStakedPositions.map(mapper)
			: [],
		userNotStakedPositions: userNotStakedPositions
			? userNotStakedPositions.map(mapper)
			: [],
		allPositions: allPositions ? allPositions.map(mapper) : [],
	};
};

export const transformSubgraphData = async (
	data: any = {},
): Promise<ISubgraphValue> => {
	return {
		balances: transformBalanceInfo(data?.balances),
		tokenDistroInfo: transformTokenDistroInfos(data?.tokenDistroInfos[0]),
		[StakingType.GIV_LM]: transformUnipoolInfo(data[StakingType.GIV_LM]),
		[StakingType.BALANCER]: transformUnipoolInfo(
			data[StakingType.BALANCER],
		),
		[StakingType.HONEYSWAP]: transformUnipoolInfo(
			data[StakingType.HONEYSWAP],
		),
		[StakingType.SUSHISWAP]: transformUnipoolInfo(
			data[StakingType.SUSHISWAP],
		),
		uniswapV3Pool: transformUniswapV3Pool(data?.uniswapV3Pool),
		...transformUniswapPositions(data),
	};
};
