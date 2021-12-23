import { Dispatch, SetStateAction } from 'react';
import { utils } from 'ethers';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';

import { LiquidityPosition } from '@/types/nfts';
import {
	getNftManagerPositionsContract,
	getUniswapV3StakerContract,
} from './contracts';
import { StakeState } from '@/components/modals/V3Stake';

const abiEncoder = utils.defaultAbiCoder;

export const transfer = async (
	tokenId: number | undefined,
	walletAddress: string,
	provider: Web3Provider,
	currentIncentive: { key?: (string | number)[] | null },
	handleStakeStatus: Dispatch<SetStateAction<StakeState>>,
) => {
	try {
		const uniswapV3StakerContract = getUniswapV3StakerContract(
			provider,
			true,
		);
		const nftManagerPositionsContract =
			getNftManagerPositionsContract(provider);

		if (
			!tokenId ||
			!walletAddress ||
			!nftManagerPositionsContract ||
			!uniswapV3StakerContract ||
			!currentIncentive.key
		)
			return;

		const data = abiEncoder.encode(
			['address', 'address', 'uint', 'uint', 'address'],
			currentIncentive.key,
		);
		const tx = await nftManagerPositionsContract[
			'safeTransferFrom(address,address,uint256,bytes)'
		](walletAddress, uniswapV3StakerContract.address, tokenId, data);

		handleStakeStatus(StakeState.SUBMITTING);
		return tx;
	} catch (e) {
		console.warn(e);
	}
};

export const exit = async (
	tokenId: number | undefined,
	walletAddress: string,
	provider: Web3Provider,
	currentIncentive: { key?: (string | number)[] | null },
	handleStakeStatus: Dispatch<SetStateAction<StakeState>>,
) => {
	try {
		const uniswapV3StakerContract = getUniswapV3StakerContract(
			provider,
			true,
		);

		if (
			!tokenId ||
			!walletAddress ||
			!uniswapV3StakerContract ||
			!currentIncentive.key
		)
			return;

		const unstakeCalldata =
			uniswapV3StakerContract.interface.encodeFunctionData(
				'unstakeToken',
				[currentIncentive.key, tokenId],
			);

		const claimRewardCalldata =
			uniswapV3StakerContract.interface.encodeFunctionData(
				'claimReward',
				[currentIncentive.key[0] as string, walletAddress, 0],
			);

		const withdrawTokenCalldata =
			uniswapV3StakerContract.interface.encodeFunctionData(
				'withdrawToken',
				[tokenId, walletAddress, 0],
			);

		const tx = await uniswapV3StakerContract.multicall([
			unstakeCalldata,
			claimRewardCalldata,
			withdrawTokenCalldata,
		]);
		handleStakeStatus(StakeState.SUBMITTING);
		return tx;
	} catch (e) {
		console.warn(e);
	}
};

export const claimUnstakeStake = async (
	walletAddress: string,
	provider: Web3Provider,
	currentIncentive: { key?: (string | number)[] | null },
	stakedPositions: LiquidityPosition[],
): Promise<TransactionResponse | undefined> => {
	const uniswapV3StakerContract = getUniswapV3StakerContract(provider);

	if (
		!stakedPositions?.length ||
		!walletAddress ||
		!uniswapV3StakerContract ||
		!currentIncentive.key ||
		stakedPositions.length === 0
	)
		return;

	const unstakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
		uniswapV3StakerContract.interface.encodeFunctionData('unstakeToken', [
			currentIncentive.key,
			_tokenId,
		]);

	const stakeCalldata = ({ tokenId: _tokenId }: LiquidityPosition) =>
		uniswapV3StakerContract.interface.encodeFunctionData('stakeToken', [
			currentIncentive.key,
			_tokenId,
		]);

	const claimRewardCalldata =
		uniswapV3StakerContract.interface.encodeFunctionData('claimReward', [
			currentIncentive.key[0] as string,
			walletAddress,
			0,
		]);

	const unstakeMulticall = stakedPositions.map(unstakeCalldata);
	const stakeMulticall = stakedPositions.map(stakeCalldata);

	const multicallData = unstakeMulticall
		.concat(stakeMulticall)
		.concat(claimRewardCalldata);

	const tx = await uniswapV3StakerContract.multicall(multicallData);

	return tx;
};

export const claim = async (
	walletAddress: string,
	provider: Web3Provider,
	currentIncentive: { key?: (string | number)[] | null },
) => {
	const uniswapV3StakerContract = getUniswapV3StakerContract(provider);

	if (!walletAddress || !uniswapV3StakerContract || !currentIncentive.key)
		return;

	try {
		uniswapV3StakerContract.claimReward(
			currentIncentive.key[0],
			walletAddress,
			0,
		);
	} catch (e) {
		console.warn(e);
	}
};

export const stake = async (
	tokenId: number | undefined,
	walletAddress: string,
	provider: Web3Provider,
	currentIncentive: { key?: (string | number)[] | null },
) => {
	const uniswapV3StakerContract = getUniswapV3StakerContract(provider);

	if (
		!tokenId ||
		!walletAddress ||
		!uniswapV3StakerContract ||
		!currentIncentive.key
	)
		return;
	console.log('currentIncentive', currentIncentive.key);
	try {
		uniswapV3StakerContract.stakeToken(currentIncentive.key, tokenId);
	} catch (e) {
		console.warn(e);
	}
};

export const unstake = async (
	tokenId: number | undefined,
	walletAddress: string,
	provider: Web3Provider,
	currentIncentive: { key?: (string | number)[] | null },
) => {
	try {
		const uniswapV3StakerContract = getUniswapV3StakerContract(provider);

		if (
			!tokenId ||
			!walletAddress ||
			!uniswapV3StakerContract ||
			!currentIncentive.key
		)
			return;

		await uniswapV3StakerContract.unstakeToken(
			currentIncentive.key,
			tokenId,
		);
	} catch (e) {
		console.warn(e);
	}
};

export const withdraw = async (
	tokenId: number | undefined,
	walletAddress: string,
	provider: Web3Provider,
) => {
	try {
		const uniswapV3StakerContract = getUniswapV3StakerContract(provider);

		if (!tokenId || !walletAddress || !uniswapV3StakerContract) return;

		await uniswapV3StakerContract.withdrawToken(tokenId, walletAddress, []);
	} catch (e) {
		console.warn(e);
	}
};
