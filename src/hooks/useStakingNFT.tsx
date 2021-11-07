import { useCallback, useState } from 'react';
import { utils } from 'ethers';

import { useContracts, useV3Liquidity, useOnboard } from '@/context';
import { LiquidityPosition } from '@/types/nfts';

const abiEncoder = utils.defaultAbiCoder;

export function useV3Staking(tokenId: number | undefined) {
	const { address: walletAddress } = useOnboard();
	const { nftManagerPositionsContract, uniswapV3StakerContract } =
		useContracts();
	const { currentIncentive, stakedPositions } = useV3Liquidity();

	const [isWorking, setIsWorking] = useState<string | null>(null);

	const transfer = useCallback(async () => {
		try {
			console.log('0');
			console.log(tokenId);
			console.log(walletAddress);
			console.log(nftManagerPositionsContract);
			console.log(uniswapV3StakerContract);
			console.log(currentIncentive.key);
			if (
				!tokenId ||
				!walletAddress ||
				!nftManagerPositionsContract ||
				!uniswapV3StakerContract ||
				!currentIncentive.key
			)
				return;
			console.log('1');

			setIsWorking('Staking...');

			const data = abiEncoder.encode(
				['address', 'address', 'uint', 'uint', 'address'],
				currentIncentive.key,
			);
			console.log('incentinve:', data);
			await nftManagerPositionsContract[
				'safeTransferFrom(address,address,uint256,bytes)'
			](walletAddress, uniswapV3StakerContract.address, tokenId, data);
		} catch (e) {
			console.warn(e);
		} finally {
			setIsWorking(null);
		}
	}, [
		tokenId,
		currentIncentive.key,
		uniswapV3StakerContract,
		nftManagerPositionsContract,
		walletAddress,
	]);

	const exit = useCallback(async () => {
		try {
			if (
				!tokenId ||
				!walletAddress ||
				!uniswapV3StakerContract ||
				!currentIncentive.key
			)
				return;

			setIsWorking('Unstaking...');

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

			await uniswapV3StakerContract.multicall([
				unstakeCalldata,
				claimRewardCalldata,
				withdrawTokenCalldata,
			]);
		} catch (e) {
			console.warn(e);
		} finally {
			setIsWorking(null);
		}
	}, [tokenId, currentIncentive.key, uniswapV3StakerContract, walletAddress]);

	const claimUnstakeStake = useCallback(
		async (next: () => void) => {
			try {
				if (
					!stakedPositions?.length ||
					!walletAddress ||
					!uniswapV3StakerContract ||
					!currentIncentive.key ||
					stakedPositions.length === 0
				)
					return;

				setIsWorking('Claiming...');

				const unstakeCalldata = ({
					tokenId: _tokenId,
				}: LiquidityPosition) =>
					uniswapV3StakerContract.interface.encodeFunctionData(
						'unstakeToken',
						[currentIncentive.key, _tokenId.toNumber()],
					);

				const stakeCalldata = ({
					tokenId: _tokenId,
				}: LiquidityPosition) =>
					uniswapV3StakerContract.interface.encodeFunctionData(
						'stakeToken',
						[currentIncentive.key, _tokenId.toNumber()],
					);

				const claimRewardCalldata =
					uniswapV3StakerContract.interface.encodeFunctionData(
						'claimReward',
						[currentIncentive.key[0] as string, walletAddress, 0],
					);

				const unstakeMulticall = stakedPositions.map(unstakeCalldata);
				const stakeMulticall = stakedPositions.map(stakeCalldata);

				const multicallData = unstakeMulticall
					.concat(stakeMulticall)
					.concat(claimRewardCalldata);

				await uniswapV3StakerContract.multicall(multicallData);
				next();
			} catch (e) {
				console.warn(e);
				setIsWorking(null);
			} finally {
				setIsWorking(null);
			}
		},
		[
			currentIncentive.key,
			walletAddress,
			uniswapV3StakerContract,
			stakedPositions,
		],
	);

	const claim = useCallback(
		async (next: () => void) => {
			if (
				!walletAddress ||
				!uniswapV3StakerContract ||
				!currentIncentive.key
			)
				return;

			try {
				setIsWorking('Claiming...');

				uniswapV3StakerContract.claimReward(
					currentIncentive.key[0],
					walletAddress,
					0,
				);

				next();
			} catch (e) {
				console.warn(e);
				setIsWorking(null);
			} finally {
				setIsWorking(null);
			}
		},
		[walletAddress, currentIncentive.key, uniswapV3StakerContract],
	);

	const stake = useCallback(async () => {
		if (
			!tokenId ||
			!walletAddress ||
			!uniswapV3StakerContract ||
			!currentIncentive.key
		)
			return;
		console.log('currentIncentive', currentIncentive.key);
		try {
			setIsWorking('Staking...');
			uniswapV3StakerContract.stakeToken(currentIncentive.key, tokenId);
		} catch (e) {
			console.warn(e);
			setIsWorking(null);
		} finally {
			setIsWorking(null);
		}
	}, [tokenId, currentIncentive.key, uniswapV3StakerContract, walletAddress]);

	const unstake = useCallback(async () => {
		try {
			if (
				!tokenId ||
				!walletAddress ||
				!uniswapV3StakerContract ||
				!currentIncentive.key
			)
				return;

			setIsWorking('Unstaking...');
			await uniswapV3StakerContract.unstakeToken(
				currentIncentive.key,
				tokenId,
			);
		} catch (e) {
			console.warn(e);
			setIsWorking(null);
		} finally {
			setIsWorking(null);
		}
	}, [tokenId, currentIncentive.key, uniswapV3StakerContract, walletAddress]);

	const withdraw = useCallback(
		async (next: () => void) => {
			try {
				if (!tokenId || !walletAddress || !uniswapV3StakerContract)
					return;

				setIsWorking('Withdrawing...');
				await uniswapV3StakerContract.withdrawToken(
					tokenId,
					walletAddress,
					[],
				);
				next();
			} catch (e) {
				console.warn(e);
				setIsWorking(null);
			} finally {
				setIsWorking(null);
			}
		},
		[tokenId, walletAddress, uniswapV3StakerContract],
	);

	return {
		isWorking,
		transfer,
		stake,
		unstake,
		claim,
		claimUnstakeStake,
		exit,
		withdraw,
	};
}
