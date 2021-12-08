import config from '@/configuration';
import { constants, ethers } from 'ethers';

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

		const initialAmount = BN(info.initialAmount);
		// console.log(`initialAmount`, initialAmount.toString());

		const lockedAmount = BN(info.lockedAmount);
		// console.log(`lockedAmount`, lockedAmount.toString());

		const totalTokens = BN(info.totalTokens);
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
		console.error('Error in getGIVPrice from Subgraph', error);
		return;
	}
};
