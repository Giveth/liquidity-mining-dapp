import { IUnipool } from '@/services/subgraph';
import { ethers } from 'ethers';

export class UnipoolMock {
	private readonly totalSupply: ethers.BigNumber;
	private readonly lastUpdateTime: Date;
	private readonly periodFinish: Date;
	private readonly rewardPerTokenStored: ethers.BigNumber;
	private readonly rewardRate: ethers.BigNumber;

	constructor({
		lastUpdateTime,
		periodFinish,
		rewardPerTokenStored,
		rewardRate,
		totalSupply,
	}: IUnipool) {
		this.totalSupply = totalSupply;
		this.lastUpdateTime = lastUpdateTime;
		this.rewardRate = rewardRate;
		this.rewardPerTokenStored = rewardPerTokenStored;
		this.periodFinish = periodFinish;
	}

	get lastTimeRewardApplicable(): ethers.BigNumber {
		const lastTimeRewardApplicableMS = Math.min(
			new Date().getTime(),
			this.periodFinish.getTime(),
		);
		return ethers.BigNumber.from(lastTimeRewardApplicableMS).div(1000);
	}
	get rewardPerToken(): ethers.BigNumber {
		if (this.totalSupply.isZero()) {
			return this.rewardPerTokenStored;
		}
		return this.rewardPerTokenStored.add(
			this.lastTimeRewardApplicable
				.sub(this.lastUpdateTime.getTime() / 1000)
				.mul(this.rewardRate)
				.mul(1e18)
				.div(this.totalSupply),
		);
	}
}