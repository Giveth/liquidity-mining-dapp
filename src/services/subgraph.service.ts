import config from '@/configuration';
import { ethers } from 'ethers';
import { Zero } from '@ethersproject/constants';
import {
	ITokenAllocation,
	IUnipool,
	IUniswapV3Pool,
	IUniswapV3Position,
	IUserPositions,
} from '@/types/subgraph';

const BN = ethers.BigNumber.from;

export const fetchSubgraph = async (
	query: string,
	network: number,
): Promise<any> => {
	const reqBody = { query };
	let uri;
	if (network === config.MAINNET_NETWORK_NUMBER) {
		uri = config.MAINNET_CONFIG.subgraphAddress;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		uri = config.XDAI_CONFIG.subgraphAddress;
	} else {
		console.error('Network is not Defined!');
		return {};
	}
	const res = await fetch(uri, {
		method: 'POST',
		body: JSON.stringify(reqBody),
	});
	const { data } = await res.json();
	return data;
};

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
	let uri;
	if (network === config.MAINNET_NETWORK_NUMBER) {
		uri = config.MAINNET_CONFIG.subgraphAddress;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		uri = config.XDAI_CONFIG.subgraphAddress;
	} else {
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

export const getUserPositions = async (
	account: string,
): Promise<IUserPositions> => {
	// TODO: fetching all staked only gets 100 staked positions
	const query = `{
		notStaked: uniswapPositions(where:{owner: "${account.toLowerCase()}"}){
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
		allStaked: uniswapPositions(first: 1000, where:{staked: true}){
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
