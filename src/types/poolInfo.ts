import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

export interface UserStakeInfo {
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
	earned: ethers.BigNumber;
}

export type APR = BigNumber | null;

export interface StakePoolInfo {
	tokensInPool?: BigNumber;
	apr: APR;
	rewardRatePerToken: BigNumber;
}
