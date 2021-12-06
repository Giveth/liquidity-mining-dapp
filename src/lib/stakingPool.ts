import { Contract, ethers } from 'ethers';

import { abi as LM_ABI } from '../artifacts/UnipoolTokenDistributor.json';
import { abi as UNI_ABI } from '../artifacts/UNI.json';
import { abi as BAL_WEIGHTED_POOL_ABI } from '../artifacts/BalancerWeightedPool.json';
import { abi as BAL_VAULT_ABI } from '../artifacts/BalancerVault.json';
import { abi as TOKEN_MANAGER_ABI } from '../artifacts/HookedTokenManager.json';
import { abi as ERC20_ABI } from '../artifacts/ERC20.json';

import { StakePoolInfo } from '../types/poolInfo';
import { networkProviders } from '../helpers/networkProvider';
import BigNumber from 'bignumber.js';
import config from '../configuration';
import {
	BalancerPoolStakingConfig,
	BasicStakingConfig,
	PoolStakingConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '../types/config';
import * as withdrawToast from './notifications/withdraw';

import { Zero } from '@ethersproject/constants';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { getUnipoolInfo, IBalances, IUnipool } from '@/services/subgraph';
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';

const toBigNumber = (eb: ethers.BigNumber): BigNumber =>
	new BigNumber(eb.toString());

export const fetchGivStakingInfo = async (
	lmAddress: string,
	network: number,
): Promise<StakePoolInfo> => {
	let apr: BigNumber | null;
	let totalSupply: BigNumber;
	let rewardRate;

	const subGraphInfo = await getUnipoolInfo(network, lmAddress);
	if (subGraphInfo) {
		totalSupply = new BigNumber(subGraphInfo.totalSupply.toString());
		rewardRate = subGraphInfo.rewardRate;
	} else {
		console.log(`subGraph info was ${subGraphInfo}!`);
		const provider = networkProviders[network];
		const lmContract = new Contract(lmAddress, LM_ABI, provider);

		const [_totalSupply, _rewardRate]: [
			ethers.BigNumber,
			ethers.BigNumber,
		] = await Promise.all([
			lmContract.totalSupply(),
			lmContract.rewardRate(),
		]);

		totalSupply = new BigNumber(_totalSupply.toString());
		rewardRate = _rewardRate;
	}

	const rewardRatePerToken = toBigNumber(rewardRate).div(
		totalSupply.toString(),
	);

	apr = totalSupply.isZero()
		? null
		: rewardRatePerToken.times('31536000').times('100');

	return {
		tokensInPool: totalSupply,
		apr,
		rewardRatePerToken: rewardRatePerToken,
	};
};

export const fetchLPStakingInfo = async (
	poolStakingConfig: PoolStakingConfig,
	network: number,
): Promise<StakePoolInfo> => {
	if (poolStakingConfig.type === StakingType.BALANCER) {
		return fetchBalancerPoolStakingInfo(
			poolStakingConfig as BalancerPoolStakingConfig,
			network,
		);
	} else {
		return fetchSimplePoolStakingInfo(poolStakingConfig, network);
	}
};

const fetchBalancerPoolStakingInfo = async (
	balancerPoolStakingConfig: BalancerPoolStakingConfig,
	network: number,
): Promise<StakePoolInfo> => {
	const { LM_ADDRESS, POOL_ADDRESS, VAULT_ADDRESS, POOL_ID } =
		balancerPoolStakingConfig;
	const provider = networkProviders[network];
	const tokenAddress = config.NETWORKS_CONFIG[network].TOKEN_ADDRESS;

	const lmContract = new Contract(LM_ADDRESS, LM_ABI, provider);
	const poolContract = new Contract(
		POOL_ADDRESS,
		BAL_WEIGHTED_POOL_ABI,
		provider,
	);
	const vaultContract = new Contract(VAULT_ADDRESS, BAL_VAULT_ABI, provider);

	interface PoolTokens {
		balances: Array<ethers.BigNumber>;
		tokens: Array<string>;
	}

	const [_poolTokens, _poolTotalSupply, _poolNormalizedWeights, lmInfo]: [
		PoolTokens,
		ethers.BigNumber,
		Array<ethers.BigNumber>,
		IUnipool | undefined,
	] = await Promise.all([
		vaultContract.getPoolTokens(POOL_ID),
		poolContract.totalSupply(),
		poolContract.getNormalizedWeights(),
		getUnipoolInfo(network, LM_ADDRESS),
	]);

	let totalSupply: ethers.BigNumber;
	let rewardRate: ethers.BigNumber;

	if (lmInfo) {
		totalSupply = lmInfo.totalSupply;
		rewardRate = lmInfo.rewardRate;
	} else {
		[totalSupply, rewardRate] = await Promise.all([
			lmContract.totalSupply(),
			lmContract.rewardRate(),
		]);
	}

	const weights = _poolNormalizedWeights.map(toBigNumber);
	const balances = _poolTokens.balances.map(toBigNumber);

	if (_poolTokens.tokens[0].toLowerCase() !== tokenAddress.toLowerCase()) {
		balances.reverse();
		weights.reverse();
	}

	const lp = toBigNumber(_poolTotalSupply)
		.div(BigNumber.sum(...weights).div(weights[0]))
		.div(balances[0]);

	const rewardRatePerToken = toBigNumber(rewardRate).div(
		totalSupply.toString(),
	);

	const apr = totalSupply.isZero()
		? null
		: rewardRatePerToken.times('31536000').times('100').times(lp);

	return {
		apr,
		rewardRatePerToken,
	};
};
const fetchSimplePoolStakingInfo = async (
	simplePoolStakingConfig: SimplePoolStakingConfig,
	network: number,
): Promise<StakePoolInfo> => {
	const { LM_ADDRESS, POOL_ADDRESS } = simplePoolStakingConfig;
	const tokenAddress = config.NETWORKS_CONFIG[network].TOKEN_ADDRESS;
	const provider = networkProviders[network];
	const lmContract = new Contract(LM_ADDRESS, LM_ABI, provider);

	let reserves;
	let totalSupply: ethers.BigNumber;
	let rewardRate: ethers.BigNumber;

	const poolContract = new Contract(POOL_ADDRESS, UNI_ABI, provider);
	const [_reserves, _token0, _poolTotalSupply, lmInfo]: [
		Array<ethers.BigNumber>,
		string,
		ethers.BigNumber,
		IUnipool | undefined,
	] = await Promise.all([
		poolContract.getReserves(),
		poolContract.token0(),
		poolContract.totalSupply(),
		getUnipoolInfo(network, LM_ADDRESS),
	]);
	if (lmInfo) {
		totalSupply = lmInfo.totalSupply;
		rewardRate = lmInfo.rewardRate;
	} else {
		[totalSupply, rewardRate] = await Promise.all([
			lmContract.totalSupply(),
			lmContract.rewardRate(),
		]);
	}
	reserves = _reserves.map(toBigNumber);
	if (_token0.toLowerCase() !== tokenAddress.toLowerCase())
		reserves.reverse();
	const lp = toBigNumber(_poolTotalSupply)
		.times(10 ** 18)
		.div(2)
		.div(reserves[0]);
	const rewardRatePerToken = toBigNumber(rewardRate).div(
		totalSupply.toString(),
	);
	const apr = totalSupply.isZero()
		? null
		: rewardRatePerToken
				.times('31536000')
				.times('100')
				.times(lp)
				.div(10 ** 18);
	return {
		apr,
		rewardRatePerToken,
	};
};

export const getUserStakeInfo = (
	type: StakingType,
	balance: IBalances,
	unipoolHelper: UnipoolHelper | undefined,
): {
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
	earned: ethers.BigNumber;
} => {
	let rewards = Zero;
	let rewardPerTokenPaid = Zero;
	let lpAmount = Zero;
	let stakedAmount = Zero;
	let notStakedAmount = Zero;
	let earned = Zero;

	switch (type) {
		case StakingType.SUSHISWAP:
			console.log("it's sushi");
			rewards = balance.rewardsSushiSwap;
			rewardPerTokenPaid = balance.rewardPerTokenPaidSushiSwap;
			stakedAmount = balance.sushiSwapLpStaked;
			notStakedAmount = balance.sushiswapLp;
			break;
		case StakingType.HONEYSWAP:
			console.log("it's honeyswap");
			rewards = balance.rewardsHoneyswap;
			rewardPerTokenPaid = balance.rewardPerTokenPaidHoneyswap;
			stakedAmount = balance.honeyswapLpStaked;
			notStakedAmount = balance.honeyswapLp;
			break;
		case StakingType.BALANCER:
			console.log("it's balancer");
			rewards = balance.rewardsBalancer;
			rewardPerTokenPaid = balance.rewardPerTokenPaidBalancer;
			stakedAmount = balance.balancerLpStaked;
			notStakedAmount = balance.balancerLp;
			break;
		case StakingType.GIV_LM:
			console.log("it's uniswap");
			rewards = balance.rewardsGivLm;
			rewardPerTokenPaid = balance.rewardPerTokenPaidGivLm;
			stakedAmount = balance.balance;
			notStakedAmount = balance.givStaked;
			break;
		default:
	}

	if (unipoolHelper) {
		earned = unipoolHelper.earned(
			rewards,
			rewardPerTokenPaid,
			notStakedAmount,
		);
	}

	return {
		stakedAmount,
		notStakedAmount,
		earned,
	};
};

const permitTokens = async (
	provider: Web3Provider,
	poolAddress: string,
	lmAddress: string,
	amount: string,
) => {
	const signer = provider.getSigner();
	const signerAddress = await signer.getAddress();

	const poolContract = new Contract(poolAddress, UNI_ABI, signer);

	const domain = {
		name: await poolContract.name(),
		version: '1',
		chainId: provider.network.chainId,
		verifyingContract: poolAddress,
	};

	// The named list of all type definitions
	const types = {
		Permit: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' },
		],
	};

	// The data to sign
	const value = {
		owner: signerAddress,
		spender: lmAddress,
		value: amount,
		nonce: await poolContract.nonces(signerAddress),
		deadline: ethers.constants.MaxUint256,
	};

	// eslint-disable-next-line no-underscore-dangle
	const rawSignature = await signer._signTypedData(domain, types, value);
	const signature = ethers.utils.splitSignature(rawSignature);

	return await poolContract.populateTransaction.permit(
		signerAddress,
		lmAddress,
		amount,
		ethers.constants.MaxUint256,
		signature.v,
		signature.r,
		signature.s,
	);
};

export const approveERC20tokenTransfer = async (
	amount: string,
	owenerAddress: string,
	spenderAddress: string,
	poolAddress: string,
	provider: Web3Provider | null,
): Promise<boolean> => {
	if (amount === '0') return false;
	if (!provider) {
		console.error('Provider is null');
		return false;
	}

	const signer = provider.getSigner();

	const tokenContract = new Contract(poolAddress, ERC20_ABI, signer);
	const allowance: BigNumber = await tokenContract.allowance(
		owenerAddress,
		spenderAddress,
	);

	const amountNumber = ethers.BigNumber.from(amount);
	const allowanceNumber = ethers.BigNumber.from(allowance.toString());

	console.log('amountNumber', amountNumber.toString());
	console.log('allowanceNumber', allowanceNumber.toString());

	if (amountNumber.lte(allowanceNumber)) {
		console.log('Allowance is GT Amount');
		return true;
	}

	if (!allowance.isZero()) {
		console.log('Lets Zero Aprove');
		try {
			const approveZero: TransactionResponse = await tokenContract
				.connect(signer.connectUnchecked())
				.approve(spenderAddress, Zero);

			const { status } = await approveZero.wait();
		} catch (error) {
			console.log('Error on Zero Approve', error);
			return false;
		}
	}

	try {
		const approve = await tokenContract
			.connect(signer.connectUnchecked())
			.approve(spenderAddress, amountNumber);

		const { status } = await approve.wait();
		console.log('approve', approve);
	} catch (error) {
		console.log('Error on Amount Approve', error);
		return false;
	}
	return true;
};

export const wrapToken = async (
	amount: string,
	poolAddress: string,
	gardenAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (amount === '0') return;
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const gardenContract = new Contract(
		gardenAddress,
		TOKEN_MANAGER_ABI,
		signer,
	);
	const txResponse: TransactionResponse = await gardenContract
		.connect(signer.connectUnchecked())
		.wrap(amount);

	return txResponse;
};

export const unwrapToken = async (
	amount: string,
	gardenAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (amount === '0') return;
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const gardenContract = new Contract(
		gardenAddress,
		TOKEN_MANAGER_ABI,
		signer,
	);
	const txResponse: TransactionResponse = await gardenContract
		.connect(signer.connectUnchecked())
		.unwrap(amount);

	const { status } = await txResponse.wait();

	return txResponse;
};

export const stakeTokens = async (
	amount: string,
	poolAddress: string,
	lmAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (amount === '0') return;
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const lmContract = new Contract(lmAddress, LM_ABI, signer);

	const rawPermitCall = await permitTokens(
		provider,
		poolAddress,
		lmAddress,
		amount,
	);

	try {
		const txResponse: TransactionResponse = await lmContract
			.connect(signer.connectUnchecked())
			.stakeWithPermit(
				ethers.BigNumber.from(amount),
				rawPermitCall.data,
				{
					gasLimit: 300_000,
				},
			);

		// const { status } = await txResponse.wait();
		return txResponse;
	} catch (e) {
		console.error('Error on staking:', e);
		return;
	}
};

export const harvestTokens = async (
	lmAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();
	const lmContract = new Contract(
		lmAddress,
		LM_ABI,
		signer.connectUnchecked(),
	);

	const txResponse = await lmContract.getReward();

	return txResponse;
};

export const withdrawTokens = async (
	amount: string,
	lmAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const lmContract = new Contract(
		lmAddress,
		LM_ABI,
		signer.connectUnchecked(),
	);

	try {
		const tx = await lmContract.withdraw(ethers.BigNumber.from(amount));
		const network = provider.network.chainId;

		withdrawToast.showPendingWithdraw(network, tx.hash);

		const { status } = await tx.wait();

		if (status) {
			withdrawToast.showConfirmedWithdraw(network, tx.hash);
			return tx;
		} else {
			withdrawToast.showFailedWithdraw(network, tx.hash);
			return;
		}
	} catch (e) {
		console.error('Error on withdrawing:', e);
	}
};
