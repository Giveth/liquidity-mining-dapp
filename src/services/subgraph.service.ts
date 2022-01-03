import config from '@/configuration';
import { ethers } from 'ethers';
import { Zero } from '@ethersproject/constants';
import {
	ITokenAllocation,
	IUnipool,
	IUniswapV3Pool,
	IUniswapV3Position,
	IUniswapV3Positions,
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