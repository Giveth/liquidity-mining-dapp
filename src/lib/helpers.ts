import { Zero } from '@/helpers/number';
import { BigNumber } from 'ethers';

export const calcStream = (start: string, end: string, cliff: string) => {
	const startTime = new Date(start);
	const endTime = new Date(end);
	const cliffTime = new Date(cliff);
	const now = new Date();

	const duration = endTime.getTime() - cliffTime.getTime();

	if (now <= cliffTime) {
		return Zero;
	}
};

// HRM: Human Readable Date.
export const convertMSToHRD = (ms: number) => {
	let rem = ms / 1000;
	const y = Math.floor(rem / 31536000);
	rem -= y * 31536000;
	const m = Math.floor(rem / 2592000);
	rem -= m * 2592000;
	const d = Math.floor(rem / 86400);
	return { y, m, d };
};

export const calcTokenInfo = (
	initialAmount: BigNumber,
	totalTokens: BigNumber,
	totalReward: BigNumber,
	duration: number,
	cliffTime: Date,
	startTime: Date,
	targetTime: Date = new Date(),
) => {
	const zeroResp = {
		releasedReward: BigNumber.from('0'),
		lockedReward: BigNumber.from('0'),
		flowratePerMS: BigNumber.from('0'),
		flowratePerWeek: BigNumber.from('0'),
	};
	try {
		const initReward = initialAmount.mul(totalReward).div(totalTokens); //amount of rewards that released in cliffTime.
		const cliffdif = cliffTime.getTime() - startTime.getTime();
		const now = targetTime.getTime() - startTime.getTime();
		if (now <= 0) {
			console.log('Not started');
			return zeroResp;
		} else if (now <= cliffdif) {
			console.log('In Cliff Time');
			return {
				releasedReward: initReward,
				lockedReward: totalReward.sub(initReward),
				flowratePerMS: BigNumber.from('0'),
				flowratePerWeek: BigNumber.from('0'),
			};
		} else if (now >= duration) {
			console.log('Ended');
			return {
				releasedReward: totalReward,
				lockedReward: BigNumber.from('0'),
				flowratePerMS: BigNumber.from('0'),
				flowratePerWeek: BigNumber.from('0'),
			};
		}
		const deltaTime = duration - cliffdif;
		const deltaAmount = totalReward.sub(initReward);
		const releasedReward = deltaAmount
			.mul(now - cliffdif)
			.div(deltaTime)
			.add(initReward);
		const lockedReward = totalReward.sub(releasedReward);
		const flowratePerMS = lockedReward.div(duration - now);
		const flowratePerWeek = flowratePerMS.mul(604800000);
		return { releasedReward, lockedReward, flowratePerMS, flowratePerWeek };
	} catch (error) {
		console.error('error in calcTokenInfo', error);
		return zeroResp;
	}
};
