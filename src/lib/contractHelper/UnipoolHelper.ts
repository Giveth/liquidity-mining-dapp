import { IUnipool } from '@/services/subgraph';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import BigNumber from 'bignumber.js';

const toBN = (value: ethers.BigNumberish): BigNumber => {
	return new BigNumber(value.toString());
};

export class UnipoolHelper {
	private readonly totalSupply: BigNumber;
	private readonly lastUpdateTime: Date;
	private readonly periodFinish: Date;
	private readonly rewardPerTokenStored: BigNumber;
	private readonly rewardRate: BigNumber;

	constructor({
		lastUpdateTime,
		periodFinish,
		rewardPerTokenStored,
		rewardRate,
		totalSupply,
	}: IUnipool) {
		this.totalSupply = toBN(totalSupply);
		this.lastUpdateTime = lastUpdateTime;
		this.rewardRate = toBN(rewardRate);
		this.rewardPerTokenStored = toBN(rewardPerTokenStored);
		this.periodFinish = periodFinish;
	}

	lastTimeRewardApplicable(date: Date): BigNumber {
		const lastTimeRewardApplicableMS: number = Math.min(
			date.getTime(),
			this.periodFinish.getTime(),
		);
		return toBN(Math.floor(lastTimeRewardApplicableMS / 1000));
	}

	rewardPerToken(date: Date): BigNumber {
		if (this.totalSupply.isZero()) {
			return this.rewardPerTokenStored;
		}
		return this.rewardPerTokenStored.plus(
			this.lastTimeRewardApplicable(date)
				.minus(this.lastUpdateTime.getTime() / 1000)
				.times(this.rewardRate)
				.times(1e18)
				.div(this.totalSupply)
				.toFixed(0),
		);
	}

	earned = (
		rewards: ethers.BigNumber,
		userRewardPerTokenPaid: ethers.BigNumber,
		stakedAmount: ethers.BigNumber,
		date: Date,
	): ethers.BigNumber => {
		const earndBN = toBN(stakedAmount)
			.times(
				this.rewardPerToken(date).minus(toBN(userRewardPerTokenPaid)),
			)
			.div(1e18)
			.plus(rewards.toString());
		// console.log('earned:', earndBN.toFixed(0));
		return ethers.BigNumber.from(earndBN.toFixed(0));
	};
}
