import { Contract, ethers } from 'ethers';

import { abi as LM_ABI } from '../artifacts/UnipoolTokenDistributor.json';
import { abi as UNI_ABI } from '../artifacts/UNI.json';
import { abi as BAL_WEIGHTED_POOL_ABI } from '../artifacts/BalancerWeightedPool.json';
import { abi as BAL_VAULT_ABI } from '../artifacts/BalancerVault.json';

import { StakePoolInfo } from '../types/poolInfo';
import { networkProviders } from '../helpers/networkProvider';
import BigNumber from 'bignumber.js';
import config from '../configuration';
import {
	BalancerPoolStakingConfig,
	PoolStakingConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '../types/config';

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

	console.log('balancer lp:', lp.toString());
	console.log('rewardRate:', _rewardRate.toString());

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

// export const fetchUserInfo = async (
// 	address: string,
// 	poolAddress: string,
// 	lmAddress: string,
// 	network: number,
// ): Promise<StakeUserInfo> => {
// 	const provider = networkProviders[network];
//
// 	let validAddress = '';
// 	try {
// 		validAddress = ethers.utils.getAddress(address);
// 	} catch (_) {
// 		return {
// 			earned: {
// 				amount: new BigNumber(0),
// 				token: config.TOKEN_NAME,
// 				displayToken: config.TOKEN_NAME,
// 			},
// 			stakedLpTokens: 0,
// 		};
// 	}
//
// 	const lmContract = new Contract(lmAddress, LM_ABI, provider);
// 	const poolContract = new Contract(poolAddress, UNI_ABI, provider);
//
// 	const [stakedLpTokens, earned, notStakedLpTokensWei] = await Promise.all([
// 		lmContract.balanceOf(validAddress),
// 		lmContract.earned(validAddress),
// 		poolContract.balanceOf(validAddress),
// 	]);
//
// 	return {
// 		stakedLpTokens: new BigNumber(ethers.utils.formatEther(stakedLpTokens)),
// 		earned: {
// 			amount: new BigNumber(ethers.utils.formatEther(earned)),
// 			token: config.TOKEN_NAME,
// 			displayToken: isMainnet(network) ? 'NODE' : 'xNODE',
// 		},
// 		notStakedLpTokensWei: notStakedLpTokensWei.toString(),
// 	};
// };
//
// async function permitTokensMainnet(provider, poolAddress, lmAddress, amount) {
// 	const signer = provider.getSigner();
// 	const signerAddress = await signer.getAddress();
//
// 	const poolContract = new Contract(poolAddress, UNI_ABI, signer);
//
// 	const domain = {
// 		name: await poolContract.name(),
// 		version: '1',
// 		chainId: provider.network.chainId,
// 		verifyingContract: poolAddress,
// 	};
//
// 	// The named list of all type definitions
// 	const types = {
// 		Permit: [
// 			{ name: 'owner', type: 'address' },
// 			{ name: 'spender', type: 'address' },
// 			{ name: 'value', type: 'uint256' },
// 			{ name: 'nonce', type: 'uint256' },
// 			{ name: 'deadline', type: 'uint256' },
// 		],
// 	};
//
// 	// The data to sign
// 	const value = {
// 		owner: signerAddress,
// 		spender: lmAddress,
// 		value: amount,
// 		nonce: await poolContract.nonces(signerAddress),
// 		deadline: ethers.constants.MaxUint256,
// 	};
//
// 	// eslint-disable-next-line no-underscore-dangle
// 	const rawSignature = await signer._signTypedData(domain, types, value);
// 	const signature = ethers.utils.splitSignature(rawSignature);
//
// 	const rawPermitCall = await poolContract.populateTransaction.permit(
// 		signerAddress,
// 		lmAddress,
// 		amount,
// 		ethers.constants.MaxUint256,
// 		signature.v,
// 		signature.r,
// 		signature.s,
// 	);
//
// 	return rawPermitCall;
// }

// async function permitTokensXDai(provider, poolAddress, lmAddress) {
// 	const signer = provider.getSigner();
// 	const signerAddress = await signer.getAddress();

// const poolContract = new Contract(poolAddress, BRIDGE_ABI, signer);

// const domain = {
// 	name: await poolContract.name(),
// 	version: '1',
// 	chainId: provider.network.chainId,
// 	verifyingContract: poolContract.address,
// };

// // The named list of all type definitions
// const types = {
// 	Permit: [
// 		{ name: 'holder', type: 'address' },
// 		{ name: 'spender', type: 'address' },
// 		{ name: 'nonce', type: 'uint256' },
// 		{ name: 'expiry', type: 'uint256' },
// 		{ name: 'allowed', type: 'bool' },
// 	],
// };

// const nonce = await poolContract.nonces(signerAddress);
// const expiry = Math.floor(Date.now() / 1000) + 3600;
// const value = {
// 	holder: signerAddress,
// 	spender: lmAddress,
// 	nonce,
// 	expiry,
// 	allowed: true,
// };

// // eslint-disable-next-line no-underscore-dangle
// const rawSignature = await signer._signTypedData(domain, types, value);
// const sign = ethers.utils.splitSignature(rawSignature);

// console.log([
// 	signerAddress,
// 	lmAddress,
// 	nonce.toString(),
// 	expiry,
// 	true,
// 	sign.v,
// 	sign.r,
// 	sign.s,
// ]);

// const rawPermitCall = await poolContract.populateTransaction.permit(
// 	signerAddress,
// 	lmAddress,
// 	nonce,
// 	expiry,
// 	true,
// 	sign.v,
// 	sign.r,
// 	sign.s,
// );

// 	console.log('rawPermitCall: ', rawPermitCall);
// 	return rawPermitCall;
// }

// export async function stakeTokens(
// 	amount: string,
// 	poolAddress: string,
// 	lmAddress: string,
// 	provider: Web3Provider,
// ): Promise<TransactionResponse> {
// 	if (amount === '0') return;

// const signer = provider.getSigner();

// const lmContract = new Contract(lmAddress, LM_ABI, signer);

// const rawPermitCall =
// 	provider.network.chainId === config.MAINNET_NETWORK_NUMBER
// 		? await permitTokensMainnet(
// 				provider,
// 				poolAddress,
// 				lmAddress,
// 				amount,
// 		  )
// 		: await permitTokensMainnet(
// 				provider,
// 				poolAddress,
// 				lmAddress,
// 				amount,
// 		  );

// const txResponse: TransactionResponse = await lmContract
// 	.connect(signer.connectUnchecked())
// 	.stakeWithPermit(
// 		ethers.BigNumber.from(amount.toString()),
// 		rawPermitCall.data,
// 		{
// 			gasLimit: 300_000,
// 		},
// 	);

// stakeToast.showPendingStake(
// 	ethers.utils.formatEther(amount),
// 	provider.network.chainId,
// 	txResponse.hash,
// );

// const { status } = await txResponse.wait();

// 	if (status) {
// 		stakeToast.showConfirmedStake(
// 			provider.network.chainId,
// 			txResponse.hash,
// 		);
// 	} else {
// 		stakeToast.showFailedStake(provider.network.chainId, txResponse.hash);
// 	}
// }

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
