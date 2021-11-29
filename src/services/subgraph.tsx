import config from '@/configuration';
import { Zero } from '@/helpers/number';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';

export const fetchBalance = async (
	network: number,
	address: string,
): Promise<ethers.BigNumber> => {
	const query = `{
		balances(where: {id: "${address.toLowerCase()}"}) {
		id
		balance
		}
	}`;
	const body = { query };
	let uri;
	if (network === config.MAINNET_NETWORK_NUMBER) {
		uri = config.MAINNET_NETWORK.subgraphAddress;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		uri = config.XDAI_NETWORK.subgraphAddress;
	} else {
		console.error('Network is not Defined!');
		return ethers.BigNumber.from(0);
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		const balance = ethers.BigNumber.from(data.data.balances[0].balance);
		return balance;
	} catch (error) {
		console.error('Error in getting data from Subgraph', error);
		return ethers.BigNumber.from(0);
	}
};

export interface ITokenAllocation {
	amount: BigNumber;
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
		tokenAllocations(skip: ${from}, first:${count} ,firstorderBy: timestamp, orderDirection: desc, , where: { recipient: "${address.toLowerCase()}"  }) {
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
		uri = config.MAINNET_NETWORK.subgraphAddress;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		uri = config.XDAI_NETWORK.subgraphAddress;
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
		console.error('Error in getting data from Subgraph', error);
		return [];
	}
};

export const getGIVPrice = async (network: number): Promise<number> => {
	const query = `{
		prices{
		  value
		}
	  }`;
	const body = { query };
	let uri;
	if (network === config.MAINNET_NETWORK_NUMBER) {
		uri = config.MAINNET_NETWORK.subgraphAddress;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		uri = config.XDAI_NETWORK.subgraphAddress;
	} else {
		console.error('Network is not Defined!');
		return 0;
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const res1 = await fetch(
			'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
		);
		const data = await res.json();
		const data1 = await res1.json();
		const _ethToGIV = +data.data.prices[0].value;
		const _ethToUSD = data1.USD;
		const _rate = _ethToUSD / _ethToGIV;
		return _rate;
	} catch (error) {
		console.error('Error in getGIVPrice from Subgraph', error);
		return 0;
	}
};
