import config from '@/configuration';
import { constants, ethers } from 'ethers';
import { getNowUnixMS } from '@/helpers/time';
import { Zero } from '@ethersproject/constants';
import { any } from 'prop-types';

const BN = ethers.BigNumber.from;

export interface IBalances {
	balance: ethers.BigNumber;
	allocatedTokens: ethers.BigNumber;
	claimed: ethers.BigNumber;
	rewardPerTokenPaidGivLm: ethers.BigNumber;
	rewardsGivLm: ethers.BigNumber;
	rewardPerTokenPaidSushiSwap: ethers.BigNumber;
	rewardsSushiSwap: ethers.BigNumber;
	rewardPerTokenPaidHoneyswap: ethers.BigNumber;
	rewardsHoneyswap: ethers.BigNumber;
	rewardPerTokenPaidUniswap: ethers.BigNumber;
	rewardsUniswap: ethers.BigNumber;
	rewardPerTokenPaidBalancer: ethers.BigNumber;
	rewardsBalancer: ethers.BigNumber;
	givback: ethers.BigNumber;
	balancerLp: ethers.BigNumber;
	balancerLpStaked: ethers.BigNumber;
	sushiswapLp: ethers.BigNumber;
	sushiSwapLpStaked: ethers.BigNumber;
	honeyswapLp: ethers.BigNumber;
	honeyswapLpStaked: ethers.BigNumber;
	givStaked: ethers.BigNumber;
	allocationCount: number;
	givDropClaimed: boolean;
}
export const zeroBalances: IBalances = {
	balance: constants.Zero,
	allocatedTokens: constants.Zero,
	claimed: constants.Zero,
	rewardPerTokenPaidGivLm: constants.Zero,
	rewardsGivLm: constants.Zero,
	rewardPerTokenPaidSushiSwap: constants.Zero,
	rewardsSushiSwap: constants.Zero,
	rewardPerTokenPaidHoneyswap: constants.Zero,
	rewardsHoneyswap: constants.Zero,
	rewardPerTokenPaidUniswap: constants.Zero,
	rewardsUniswap: constants.Zero,
	rewardPerTokenPaidBalancer: constants.Zero,
	rewardsBalancer: constants.Zero,
	givback: constants.Zero,
	balancerLp: constants.Zero,
	balancerLpStaked: constants.Zero,
	sushiswapLp: constants.Zero,
	sushiSwapLpStaked: constants.Zero,
	honeyswapLp: constants.Zero,
	honeyswapLpStaked: constants.Zero,
	givStaked: constants.Zero,
	allocationCount: 0,
	givDropClaimed: false,
};

export const fetchBalances = async (
	network: number,
	address: string,
): Promise<IBalances> => {
	const query = `{
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
		}
	}`;
	const reqBody = { query };
	const uri = config.NETWORKS_CONFIG[network]?.subgraphAddress;
	if (!uri) {
		console.error('Network is not Defined!');
		return zeroBalances;
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(reqBody),
		});
		const data = await res.json();
		const info = data.data.balance;

		if (!info) return zeroBalances;

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
		const rewardPerTokenPaidUniswap = BN(
			info.rewardPerTokenPaidUniswap || 0,
		);
		const rewardsUniswap = BN(info.rewardsUniswap || 0);
		const rewardPerTokenPaidBalancer = BN(
			info.rewardPerTokenPaidBalancer || 0,
		);
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
	} catch (error) {
		console.error('Error in fetching Balances', error);
		return zeroBalances;
	}
};

export interface ITokenAllocation {
	amount: ethers.BigNumber;
	distributor: string;
	recipient: string;
	timestamp: string;
	txHash: string;
}

export const getHistory = async (
	network: number,
	address: string,
	from?: number,
	count?: number,
): Promise<ITokenAllocation[]> => {
	const query = `{
		tokenAllocations(skip: ${from}, first:${count} ,orderBy: timestamp, orderDirection: desc, , where: { recipient: "${address.toLowerCase()}"  }) {
		recipient
		amount
		timestamp
		txHash
		distributor
	  }
	}`;
	const body = { query };
	const uri = config.NETWORKS_CONFIG[network]?.subgraphAddress;
	if (!uri) {
		console.error('Network is not Defined!');
		return [];
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		const { tokenAllocations } = data.data;
		return tokenAllocations;
	} catch (error) {
		console.error('Error in getting History from Subgraph', error);
		return [];
	}
};

export const getGIVPrice = async (network: number): Promise<number> => {
	return 1;
	// const query = `{
	// 	prices{
	// 	  value
	// 	}
	//   }`;
	// const body = { query };
	// let uri;
	// if (network === config.MAINNET_NETWORK_NUMBER) {
	// 	uri = config.MAINNET_CONFIG.subgraphAddress;
	// } else if (network === config.XDAI_NETWORK_NUMBER) {
	// 	uri = config.XDAI_CONFIG.subgraphAddress;
	// } else {
	// 	console.error('Network is not Defined!');
	// 	return 0;
	// }
	// try {
	// 	const res = await fetch(uri, {
	// 		method: 'POST',
	// 		body: JSON.stringify(body),
	// 	});
	// 	const res1 = await fetch(
	// 		'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
	// 	);
	// 	const data = await res.json();
	// 	const data1 = await res1.json();
	// 	const _ethToGIV = +data.data.prices[0].value;
	// 	const _ethToUSD = data1.USD;
	// 	const _rate = _ethToUSD / _ethToGIV;
	// 	return _rate;
	// } catch (error) {
	// 	console.error('Error in getGIVPrice from Subgraph', error);
	// 	return 0;
	// }
};

export interface ITokenDistroInfo {
	initialAmount: ethers.BigNumber;
	lockedAmount: ethers.BigNumber;
	totalTokens: ethers.BigNumber;
	startTime: Date;
	cliffTime: Date;
	endTime: Date;
}

export const getTokenDistroInfo = async (
	network: number,
): Promise<ITokenDistroInfo | undefined> => {
	const query = `{
		tokenDistroContractInfos(first:10){
		  id
		  initialAmount
		  duration
		  startTime
		  cliffTime
		  lockedAmount
		  totalTokens
		}
	  }`;
	const body = { query };
	const uri = config.NETWORKS_CONFIG[network]?.subgraphAddress;
	if (!uri) {
		console.error('Network is not Defined!');
		return;
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		const info = data.data.tokenDistroContractInfos[0];

		const _startTime = info.startTime;
		const _cliffTime = info.cliffTime;
		const _duration = await info.duration;

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
	} catch (error) {
		console.error('Error in getTokenDistroInfo from Subgraph', error);
		return;
	}
};

export interface IUnipool {
	totalSupply: ethers.BigNumber;
	lastUpdateTime: Date;
	periodFinish: Date;
	rewardPerTokenStored: ethers.BigNumber;
	rewardRate: ethers.BigNumber;
}
export const getUnipoolInfo = async (
	network: number,
	unipoolAddress: string,
): Promise<IUnipool | undefined> => {
	const query = `{
		 unipoolContractInfo(id: "${unipoolAddress.toLowerCase()}"){
			totalSupply
			lastUpdateTime
			periodFinish
			rewardPerTokenStored
			rewardRate
		}
	  }`;
	const body = { query };
	const uri = config.NETWORKS_CONFIG[network]?.subgraphAddress;
	if (!uri) {
		console.error('Network is not Defined!');
		return;
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		const info = data?.data?.unipoolContractInfo;

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
	} catch (error) {
		console.error('Error in getUnipoolInfo from Subgraph', error);
		return;
	}
};

export interface IUniswapV3Position {
	tokenId: number;
	token0: string;
	token1: string;
	liquidity: ethers.BigNumber;
	tickLower: number;
	tickUpper: number;
	owner: string;
	staker: string | null;
	staked: boolean;
}
export interface IUserPositions {
	staked: IUniswapV3Position[];
	notStaked: IUniswapV3Position[];
	allStaked: IUniswapV3Position[];
}
export const getUserPositions = async (
	account: string,
): Promise<IUserPositions> => {
	// TODO: fetching all staked only gets 100 staked positions
	const query = `{
		notStaked: uniswapPositions(where:{owner: "${account.toLowerCase()}", closed: false}){
			tokenId
			token0
			token1
			liquidity
			tickLower
			tickUpper
			staked
			staker
		}
		staked: uniswapPositions(where:{staker: "${account.toLowerCase()}"}){
			tokenId
			token0
			token1
			liquidity
			tickLower
			tickUpper
			staked
			staker
		}
		allStaked: uniswapPositions(first: 1000){
			tokenId
			token0
			token1
			liquidity
			tickLower
			tickUpper
			staked
			staker
		}
	  }`;
	const body = { query };
	try {
		const res = await fetch(config.MAINNET_CONFIG.subgraphAddress, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		const stakedPositionsInfo = data?.data?.staked || [];
		const notStakedPositionsInfo = data?.data?.notStaked || [];
		const allStakedPositionsInfo = data?.data?.allStaked || [];
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
		return {
			staked: stakedPositionsInfo.map(mapper),
			notStaked: notStakedPositionsInfo.map(mapper),
			allStaked: allStakedPositionsInfo.map(mapper),
		};
	} catch (e) {
		console.error('Error in fetching user positions', e);
		return {
			staked: [],
			notStaked: [],
			allStaked: [],
		};
	}
};

export const getUniswapV3TokenURI = async (
	tokenId: string | number,
): Promise<string> => {
	const query = `{
		uniswapPosition(id: "${tokenId}"){
			tokenURI
		}
	  }`;
	const body = { query };

	const res = await fetch(config.MAINNET_CONFIG.subgraphAddress, {
		method: 'POST',
		body: JSON.stringify(body),
	});
	const data = await res.json();
	return data?.data?.uniswapPosition?.tokenURI || '';
};

export interface IUniswapV3Pool {
	token0: string;
	token1: string;
	sqrtPriceX96: ethers.BigNumber;
	tick: number;
	liquidity: ethers.BigNumber;
	stakedLiquidity: ethers.BigNumber;
}

export const getUniswapV3Pool = async (
	address: string,
): Promise<IUniswapV3Pool> => {
	const query = `{
		uniswapV3Pool(id: "${address.toLowerCase()}"){
			token0
			token1
			sqrtPriceX96
			tick
			liquidity
			stakedLiquidity
		}
	  }`;
	const body = { query };
	try {
		const res = await fetch(config.MAINNET_CONFIG.subgraphAddress, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		const poolInfo = data?.data?.uniswapV3Pool || {};
		const sqrtPriceX96 = BN(poolInfo.sqrtPriceX96);
		const tick = Number(poolInfo.tick);
		const liquidity = BN(poolInfo.liquidity);
		const stakedLiquidity = BN(poolInfo.stakedLiquidity);
		const token0 = poolInfo.token0;
		const token1 = poolInfo.token1;
		return {
			token0,
			token1,
			sqrtPriceX96,
			tick,
			liquidity,
			stakedLiquidity,
		};
	} catch (e) {
		console.error('Error in fetching user positions', e);
		return {
			token0: config.MAINNET_CONFIG.TOKEN_ADDRESS,
			token1: config.MAINNET_CONFIG.WETH_TOKEN_ADDRESS,
			stakedLiquidity: Zero,
			liquidity: Zero,
			sqrtPriceX96: Zero,
			tick: 0,
		};
	}
};
