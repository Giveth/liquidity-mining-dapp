import config from '@/configuration';
import { constants, ethers } from 'ethers';
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
}
export const zeroBalances = {
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
		}
	}`;
	const reqBody = { query };
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
			body: JSON.stringify(reqBody),
		});
		const resJson = await res.json();
		const data = resJson.data.balance;
		console.log('balance response data:', data);
		const balance = ethers.BigNumber.from(data.balance || 0);
		const allocatedTokens = ethers.BigNumber.from(
			data.allocatedTokens || 0,
		);
		const claimed = ethers.BigNumber.from(data.claimed || 0);
		const rewardPerTokenPaidGivLm = ethers.BigNumber.from(
			data.rewardPerTokenPaidGivLm || 0,
		);
		const rewardsGivLm = ethers.BigNumber.from(data.rewardsGivLm || 0);
		const rewardPerTokenPaidSushiSwap = ethers.BigNumber.from(
			data.rewardPerTokenPaidSushiSwap || 0,
		);
		const rewardsSushiSwap = ethers.BigNumber.from(
			data.rewardsSushiSwap || 0,
		);
		const rewardPerTokenPaidHoneyswap = ethers.BigNumber.from(
			data.rewardPerTokenPaidHoneyswap || 0,
		);
		const rewardsHoneyswap = ethers.BigNumber.from(
			data.rewardsHoneyswap || 0,
		);
		const rewardPerTokenPaidUniswap = ethers.BigNumber.from(
			data.rewardPerTokenPaidUniswap || 0,
		);
		const rewardsUniswap = ethers.BigNumber.from(data.rewardsUniswap || 0);
		const rewardPerTokenPaidBalancer = ethers.BigNumber.from(
			data.rewardPerTokenPaidBalancer || 0,
		);
		const rewardsBalancer = ethers.BigNumber.from(
			data.rewardsBalancer || 0,
		);
		const givback = ethers.BigNumber.from(data.givback || 0);
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
