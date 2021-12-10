import { IBalances, ITokenDistroInfo } from '@/services/subgraph';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Zero } from '@ethersproject/constants';

export class TokenDistroHelper {
	public readonly initialAmount: ethers.BigNumber;
	public readonly lockedAmount: ethers.BigNumber;
	public readonly totalTokens: ethers.BigNumber;
	public readonly startTime: Date;
	public readonly cliffTime: Date;
	public readonly endTime: Date;
	public readonly duration: number;
	public readonly progress: number;
	public readonly remain: number;
	public readonly percent: number;

	constructor({
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
	}: ITokenDistroInfo) {
		this.initialAmount = initialAmount;
		this.lockedAmount = lockedAmount;
		this.totalTokens = totalTokens;
		this.startTime = startTime;
		this.cliffTime = cliffTime;
		this.endTime = endTime;
		this.duration = duration;
		this.progress = progress;
		this.remain = remain;
		this.percent = percent;
	}

	public get globallyClaimableNow(): ethers.BigNumber {
		if (this.duration === 0) return Zero;
		return this.initialAmount.add(
			this.lockedAmount.mul(this.progress).div(this.duration),
		);
	}

	public getLiquidPart = (amount: ethers.BigNumber): ethers.BigNumber => {
		if (this.totalTokens.isZero()) return Zero;
		return this.globallyClaimableNow.mul(amount).div(this.totalTokens);
	};

	public getStreamPartTokenPerSecond = (
		amount: ethers.BigNumber,
	): BigNumber => {
		if (this.remain === 0) return new BigNumber(0);
		const lockAmount = amount.sub(this.getLiquidPart(amount));
		return new BigNumber(lockAmount.toString()).div(this.remain);
	};

	public getStreamPartTokenPerWeek = (
		amount: ethers.BigNumber,
	): BigNumber => {
		return this.getStreamPartTokenPerSecond(amount).times(604800000);
	};

	public getUserClaimableNow(userBalance: IBalances): ethers.BigNumber {
		return this.getLiquidPart(userBalance.allocatedTokens).sub(
			userBalance.claimed,
		);
	}
}
