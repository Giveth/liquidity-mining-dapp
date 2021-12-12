import { IUnipool } from '@/services/subgraph';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import BigNumber from 'bignumber.js';
import { getNowUnix } from '@/helpers/time';

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

	async lastTimeRewardApplicable(): Promise<BigNumber> {
		const lastTimeRewardApplicableMS: number = Math.min(
			await getNowUnix(),
			this.periodFinish.getTime(),
		);
		return toBN(Math.floor(lastTimeRewardApplicableMS / 1000));
	}

	async rewardPerToken(): Promise<BigNumber> {
		if (this.totalSupply.isZero()) {
			return this.rewardPerTokenStored;
		}
		return this.rewardPerTokenStored.plus(
			(await this.lastTimeRewardApplicable())
				.minus(this.lastUpdateTime.getTime() / 1000)
				.times(this.rewardRate)
				.times(1e18)
				.div(this.totalSupply)
				.toFixed(0),
		);
	}

	earned = async (
		rewards: ethers.BigNumber,
		userRewardPerTokenPaid: ethers.BigNumber,
		stakedAmount: ethers.BigNumber,
	): Promise<ethers.BigNumber> => {
		// const rewardPerToken = this.rewardPerToken;
		// console.log('rewardPerToken:', rewardPerToken.toFixed());
		// console.log(
		// 	this.rewardPerToken
		// 		.minus(userRewardPerTokenPaid.toString())
		// 		.toFixed(0),
		// );
		// console.log('stakedAmount:', stakedAmount.toString());
		// console.log(
		// 	'userRewardPerTokenPaid:',
		// 	userRewardPerTokenPaid.toString(),
		// );
		// console.log('rewards:', rewards.toString());
		const earndBN = toBN(stakedAmount)
			.times(
				(await this.rewardPerToken()).minus(
					toBN(userRewardPerTokenPaid),
				),
			)
			.div(1e18)
			.plus(rewards.toString());
		// console.log('earned:', earndBN.toFixed(0));
		return ethers.BigNumber.from(earndBN.toFixed(0));
	};
}
