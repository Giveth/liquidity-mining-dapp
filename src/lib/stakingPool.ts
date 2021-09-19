import { Contract, ethers } from 'ethers';

import { abi as LM_ABI } from '../artifacts/UnipoolTokenDistributor.json';
import { abi as UNI_ABI } from '../artifacts/UNI.json';
import { abi as BAL_WEIGHTED_POOL_ABI } from '../artifacts/BalancerWeightedPool.json';
import { abi as BAL_VAULT_ABI } from '../artifacts/BalancerVault.json';

import { StakePoolInfo, StakeUserInfo } from '../types/poolInfo';
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
import * as stakeToast from './notifications/stake';

import { Zero } from '@ethersproject/constants';
import { isAddress } from 'ethers/lib/utils';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';

const toBigNumber = (eb: ethers.BigNumber): BigNumber =>
	new BigNumber(eb.toString());

export const fetchGivStakingInfo = async (
	lmAddress: string,
	network: number,
): Promise<StakePoolInfo> => {
	const provider = networkProviders[network];
	const lmContract = new Contract(lmAddress, LM_ABI, provider);

	let apr: BigNumber | null;
	let totalSupply;

	const [_totalSupply, _rewardRate]: [ethers.BigNumber, ethers.BigNumber] =
		await Promise.all([lmContract.totalSupply(), lmContract.rewardRate()]);
	totalSupply = new BigNumber(_totalSupply.toString());
	apr = totalSupply.isZero()
		? null
		: new BigNumber(_rewardRate.toString())
				.times('31536000')
				.times('100')
				.div(_totalSupply.toString());

	return {
		tokensInPool: totalSupply,
		apr,
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

	const [
		_poolTokens,
		_poolTotalSupply,
		_poolNormalizedWeights,
		_totalSupply,
		_rewardRate,
	]: [
		PoolTokens,
		ethers.BigNumber,
		Array<ethers.BigNumber>,
		ethers.BigNumber,
		ethers.BigNumber,
	] = await Promise.all([
		vaultContract.getPoolTokens(POOL_ID),
		poolContract.totalSupply(),
		poolContract.getNormalizedWeights(),
		lmContract.totalSupply(),
		lmContract.rewardRate(),
	]);

	const weights = _poolNormalizedWeights.map(toBigNumber);
	const balances = _poolTokens.balances.map(toBigNumber);

	if (_poolTokens.tokens[0].toLowerCase() !== tokenAddress.toLowerCase()) {
		balances.reverse();
		weights.reverse();
	}

	const lp = toBigNumber(_poolTotalSupply)
		.div(BigNumber.sum(...weights).div(weights[0]))
		.div(balances[0]);

	const apr = _totalSupply.isZero()
		? null
		: toBigNumber(_rewardRate)
				.times('31536000')
				.times('100')
				.div(toBigNumber(_totalSupply))
				.times(lp);
	return {
		apr,
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

	const poolContract = new Contract(POOL_ADDRESS, UNI_ABI, provider);
	const [_reserves, _token0, _poolTotalSupply, _totalSupply, _rewardRate]: [
		Array<ethers.BigNumber>,
		string,
		ethers.BigNumber,
		ethers.BigNumber,
		ethers.BigNumber,
	] = await Promise.all([
		poolContract.getReserves(),
		poolContract.token0(),
		poolContract.totalSupply(),
		lmContract.totalSupply(),
		lmContract.rewardRate(),
	]);
	reserves = _reserves.map(toBigNumber);
	if (_token0.toLowerCase() !== tokenAddress.toLowerCase())
		reserves.reverse();
	const lp = toBigNumber(_poolTotalSupply)
		.times(10 ** 18)
		.div(2)
		.div(reserves[0]);
	const apr = _totalSupply.isZero()
		? null
		: toBigNumber(_rewardRate)
				.times('31536000')
				.times('100')
				.div(toBigNumber(_totalSupply))
				.times(lp)
				.div(10 ** 18);

	return {
		apr,
	};
};

export const fetchUserStakeInfo = async (
	address: string,
	stakingConfig: BasicStakingConfig,
	network: number,
): Promise<StakeUserInfo> => {
	const provider = networkProviders[network];
	if (isAddress(address) && provider) {
		const { LM_ADDRESS } = stakingConfig;

		const lmContract = new Contract(LM_ADDRESS, LM_ABI, provider);

		const [stakedLpAmount, earned] = await Promise.all([
			lmContract.balanceOf(address),
			lmContract.earned(address),
		]);

		return {
			stakedLpAmount,
			earned,
		};
	}
	return {
		earned: Zero,
		stakedLpAmount: Zero,
	};
};

export const fetchUserNotStakedToken = async (
	address: string,
	stakingConfig: PoolStakingConfig,
	network: number,
): Promise<ethers.BigNumber> => {
	const provider = networkProviders[network];
	if (isAddress(address) && provider) {
		const { POOL_ADDRESS } = stakingConfig;
		const poolContract = new Contract(POOL_ADDRESS, UNI_ABI, provider);

		return poolContract.balanceOf(address);
	}
	return Zero;
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

export const stakeTokens = async (
	amount: string,
	poolAddress: string,
	lmAddress: string,
	provider: Web3Provider,
): Promise<TransactionResponse | undefined> => {
	if (amount === '0') return;

	const signer = provider.getSigner();

	const lmContract = new Contract(lmAddress, LM_ABI, signer);

	const rawPermitCall = await permitTokens(
		provider,
		poolAddress,
		lmAddress,
		amount,
	);

	const txResponse: TransactionResponse = await lmContract
		.connect(signer.connectUnchecked())
		.stakeWithPermit(
			ethers.BigNumber.from(amount.toString()),
			rawPermitCall.data,
			{
				gasLimit: 300_000,
			},
		);

	stakeToast.showPendingStake(
		ethers.utils.formatEther(amount),
		provider.network.chainId,
		txResponse.hash,
	);

	const { status } = await txResponse.wait();

	if (status) {
		stakeToast.showConfirmedStake(
			provider.network.chainId,
			txResponse.hash,
		);
	} else {
		stakeToast.showFailedStake(provider.network.chainId, txResponse.hash);
	}
};

//export const harvestTokens = async (
//	lmAddress: string,
//	network: number,
//	signer,
//) => {
//	const lmContract = new Contract(
//		lmAddress,
//		LM_ABI,
//		signer.connectUnchecked(),
//	);
//
//	const tx = await lmContract.getReward();
//
//	harvestToast.showPendingHarvest(network, tx.hash);
//
//	const { status } = await tx.wait();
//
//	if (status) {
//		harvestToast.showConfirmedHarvest(network, tx.hash);
//	} else {
//		harvestToast.showFailedHarvest(network, tx.hash);
//	}
//};

// export const withdrawTokens = async (
// 	amount: number,
// 	lmAddress: string,
// 	network: number,
// 	signer,
// ) => {
// 	const lmContract = new Contract(
// 		lmAddress,
// 		LM_ABI,
// 		signer.connectUnchecked(),
// 	);
//
// 	const tx = await lmContract.withdraw(ethers.BigNumber.from(amount));
//
// 	withdrawToast.showPendingWithdraw(network, tx.hash);
//
// 	const { status } = await tx.wait();
//
// 	if (status) {
// 		withdrawToast.showConfirmedWithdraw(network, tx.hash);
// 	} else {
// 		withdrawToast.showFailedWithdraw(network, tx.hash);
// 	}
// };
