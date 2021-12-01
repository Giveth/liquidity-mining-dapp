import config from '@/configuration';
import { ethers } from 'ethers';
export interface IBalances {
	balance: ethers.BigNumber;
	allocatedTokens: ethers.BigNumber;
	claimed: ethers.BigNumber;
	rewardPerTokenStoredGivLm: ethers.BigNumber;
	rewardsGivLm: ethers.BigNumber;
	rewardPerTokenStoredUniswap: ethers.BigNumber;
	rewardsUniswap: ethers.BigNumber;
	givback: ethers.BigNumber;
}
export const zeroBalances = {
	balance: ethers.BigNumber.from(0),
	allocatedTokens: ethers.BigNumber.from(0),
	claimed: ethers.BigNumber.from(0),
	rewardPerTokenStoredGivLm: ethers.BigNumber.from(0),
	rewardsGivLm: ethers.BigNumber.from(0),
	rewardPerTokenStoredUniswap: ethers.BigNumber.from(0),
	rewardsUniswap: ethers.BigNumber.from(0),
	givback: ethers.BigNumber.from(0),
};

export const fetchBalances = async (
	network: number,
	address: string,
): Promise<IBalances> => {
	const query = `{
		balances(where: {id: "${address.toLowerCase()}"}) {
			id
			balance
			allocatedTokens
			claimed
			rewardPerTokenStoredGivLm
			rewardsGivLm
			rewardPerTokenStoredUniswap
			rewardsUniswap
			givback
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
		return zeroBalances;
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		const balance = ethers.BigNumber.from(data.data.balances[0].balance);
		const allocatedTokens = ethers.BigNumber.from(
			data.data.balances[0].allocatedTokens,
		);
		const claimed = ethers.BigNumber.from(data.data.balances[0].claimed);
		const rewardPerTokenStoredGivLm = ethers.BigNumber.from(
			data.data.balances[0].rewardPerTokenStoredGivLm,
		);
		const rewardsGivLm = ethers.BigNumber.from(
			data.data.balances[0].rewardsGivLm,
		);
		const rewardPerTokenStoredUniswap = ethers.BigNumber.from(
			data.data.balances[0].rewardPerTokenStoredUniswap,
		);
		const rewardsUniswap = ethers.BigNumber.from(
			data.data.balances[0].rewardsUniswap,
		);
		const givback = ethers.BigNumber.from(data.data.balances[0].givback);
		return {
			balance,
			allocatedTokens,
			claimed,
			rewardPerTokenStoredGivLm,
			rewardsGivLm,
			rewardPerTokenStoredUniswap,
			rewardsUniswap,
			givback,
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
		console.error('Error in getting History from Subgraph', error);
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

export interface ITokenDistroInfo {
	initialAmount: ethers.BigNumber;
	lockedAmount: ethers.BigNumber;
	totalTokens: ethers.BigNumber;
	startTime: Date;
	cliffTime: Date;
	endTime: Date;
	duration: number;
	progress: number;
	remain: number;
	percent: number;
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
	let uri;
	if (network === config.MAINNET_NETWORK_NUMBER) {
		uri = config.MAINNET_NETWORK.subgraphAddress;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		uri = config.XDAI_NETWORK.subgraphAddress;
	} else {
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

		const progress = Date.now() - startTime.getTime();
		// console.log(`progress`, convertMSToHRD(progress));

		const endTime = new Date(startTime.getTime() + duration);
		// console.log(`endTime`, endTime);

		const remain = endTime.getTime() - Date.now();
		// console.log(`remain`, convertMSToHRD(remain));

		const percent = Math.floor((progress / duration) * 100);
		// console.log(`percent`, percent);

		const initialAmount = ethers.BigNumber.from(info.initialAmount);
		// console.log(`initialAmount`, initialAmount.toString());

		const lockedAmount = ethers.BigNumber.from(info.lockedAmount);
		// console.log(`lockedAmount`, lockedAmount.toString());

		const totalTokens = ethers.BigNumber.from(info.totalTokens);
		// console.log(`totalTokens`, totalTokens.toString());

		return {
			initialAmount,
			lockedAmount,
			totalTokens,
			startTime,
			cliffTime,
			endTime,
			duration,
			progress,
			remain,
			percent,
		};
	} catch (error) {
		console.error('Error in getGIVPrice from Subgraph', error);
		return;
	}
};
