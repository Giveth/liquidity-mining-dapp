import config from '@/configuration';
import { Zero } from '@/helpers/number';
import { BigNumber } from 'bignumber.js';

export const fetchBalance = async (
	network: number,
	address: string,
): Promise<BigNumber> => {
	const query = `{
		balances(first: 1000, where: {id: "${address.toLowerCase()}"}) {
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
		return Zero;
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		// console.log(`dataaaa`, );
		const balance = new BigNumber(data.data.balances[0]);
		console.log(`balance`, balance);
		return balance;
	} catch (error) {
		console.error('Error in getting data from Subgraph', error);
		return Zero;
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
		// console.log(`dataaaa`, );
		// const balance = new BigNumber(data.data.balances[0]);
		// console.log(`balance`, data);
		return tokenAllocations;
	} catch (error) {
		console.error('Error in getting data from Subgraph', error);
		return [];
	}
};