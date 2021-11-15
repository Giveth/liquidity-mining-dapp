import { Contract, ethers, utils } from 'ethers';

import { abi as LM_ABI } from '../artifacts/UnipoolTokenDistributor.json';
import { abi as UNI_ABI } from '../artifacts/UNI.json';
import { abi as BAL_WEIGHTED_POOL_ABI } from '../artifacts/BalancerWeightedPool.json';
import { abi as BAL_VAULT_ABI } from '../artifacts/BalancerVault.json';
import { abi as TOKEN_MANAGER_ABI } from '../artifacts/HookedTokenManager.json';
import { abi as ERC20_ABI } from '../artifacts/ERC20.json';

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
import * as withdrawToast from './notifications/withdraw';
import * as harvestToast from './notifications/harvest';

import { Zero } from '@ethersproject/constants';
import { isAddress } from 'ethers/lib/utils';
import {
	JsonRpcProvider,
	TransactionResponse,
	Web3Provider,
} from '@ethersproject/providers';

const toBigNumber = (eb: ethers.BigNumber): BigNumber =>
	new BigNumber(eb.toString());

export const fetchGivStakingInfo = async (
	lmAddress: string,
	provider: JsonRpcProvider,
): Promise<StakePoolInfo> => {
	const lmContract = new Contract(lmAddress, LM_ABI, provider);

	let apr: BigNumber | null;
	let totalSupply;

	const [_totalSupply, _rewardRate, _rewardPerToken]: [
		ethers.BigNumber,
		ethers.BigNumber,
		ethers.BigNumber,
	] = await Promise.all([
		lmContract.totalSupply(),
		lmContract.rewardRate(),
		lmContract.rewardPerToken(),
	]);
	totalSupply = new BigNumber(_totalSupply.toString());

	const rewardRatePerToken = toBigNumber(_rewardRate).div(
		_totalSupply.toString(),
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
	provider: JsonRpcProvider,
): Promise<StakePoolInfo> => {
	if (poolStakingConfig.type === StakingType.BALANCER) {
		return fetchBalancerPoolStakingInfo(
			poolStakingConfig as BalancerPoolStakingConfig,
			network,
			provider,
		);
	} else {
		return fetchSimplePoolStakingInfo(poolStakingConfig, network, provider);
	}
};

const fetchBalancerPoolStakingInfo = async (
	balancerPoolStakingConfig: BalancerPoolStakingConfig,
	network: number,
	provider: JsonRpcProvider,
): Promise<StakePoolInfo> => {
	const { LM_ADDRESS, POOL_ADDRESS, VAULT_ADDRESS, POOL_ID } =
		balancerPoolStakingConfig;
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
		_rewardPerToken,
	]: [
		PoolTokens,
		ethers.BigNumber,
		Array<ethers.BigNumber>,
		ethers.BigNumber,
		ethers.BigNumber,
		ethers.BigNumber,
	] = await Promise.all([
		vaultContract.getPoolTokens(POOL_ID),
		poolContract.totalSupply(),
		poolContract.getNormalizedWeights(),
		lmContract.totalSupply(),
		lmContract.rewardRate(),
		lmContract.rewardPerToken(),
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

	const rewardRatePerToken = toBigNumber(_rewardRate).div(
		_totalSupply.toString(),
	);

	const apr = _totalSupply.isZero()
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
	provider: JsonRpcProvider,
): Promise<StakePoolInfo> => {
	const { LM_ADDRESS, POOL_ADDRESS } = simplePoolStakingConfig;
	const tokenAddress = config.NETWORKS_CONFIG[network].TOKEN_ADDRESS;
	const lmContract = new Contract(LM_ADDRESS, LM_ABI, provider);

	let reserves;

	const poolContract = new Contract(POOL_ADDRESS, UNI_ABI, provider);
	const [
		_reserves,
		_token0,
		_poolTotalSupply,
		_totalSupply,
		_rewardRate,
		_rewardPerToken,
	]: [
		Array<ethers.BigNumber>,
		string,
		ethers.BigNumber,
		ethers.BigNumber,
		ethers.BigNumber,
		ethers.BigNumber,
	] = await Promise.all([
		poolContract.getReserves(),
		poolContract.token0(),
		poolContract.totalSupply(),
		lmContract.totalSupply(),
		lmContract.rewardRate(),
		lmContract.rewardPerToken(),
	]);
	reserves = _reserves.map(toBigNumber);
	if (_token0.toLowerCase() !== tokenAddress.toLowerCase())
		reserves.reverse();
	const lp = toBigNumber(_poolTotalSupply)
		.times(10 ** 18)
		.div(2)
		.div(reserves[0]);
	const rewardRatePerToken = toBigNumber(_rewardRate).div(
		_totalSupply.toString(),
	);
	const apr = _totalSupply.isZero()
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
	provider: JsonRpcProvider | null,
): Promise<ethers.BigNumber> => {
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

		// const network = provider.network.chainId;

		// stakeToast.showPendingStake(
		// 	ethers.utils.formatEther(amount),
		// 	network,
		// 	txResponse.hash,
		// );

		// const { status } = await txResponse.wait();

		// if (status) {
		// 	stakeToast.showConfirmedStake(network, txResponse.hash);
		// 	return txResponse;
		// } else {
		// 	stakeToast.showFailedStake(network, txResponse.hash);
		// 	return;
		// }
		return txResponse;
	} catch (e) {
		console.error('Error on staking:', e);
		return;
	}
};

export const harvestTokens = async (
	lmAddress: string,
	provider: Web3Provider | null,
) => {
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

	const tx = await lmContract.getReward();

	const network = provider.network.chainId;
	harvestToast.showPendingHarvest(network, tx.hash);

	const { status } = await tx.wait();

	if (status) {
		harvestToast.showConfirmedHarvest(network, tx.hash);
	} else {
		harvestToast.showFailedHarvest(network, tx.hash);
	}
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
