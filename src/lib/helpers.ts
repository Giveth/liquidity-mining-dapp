// HRM: Human Readable Date.
export const DurationToYMDhms = (ms: number) => {
	let baseTime = new Date(0);
	let duration = new Date(ms);

	let Y = duration.getUTCFullYear() - baseTime.getUTCFullYear();
	let M = duration.getUTCMonth() - baseTime.getUTCMonth();
	let D = duration.getUTCDate() - baseTime.getUTCDate();
	let h = duration.getUTCHours() - baseTime.getUTCHours();
	let m = duration.getUTCMinutes() - baseTime.getUTCMinutes();
	let s = duration.getUTCSeconds() - baseTime.getUTCSeconds();

	return { Y: Y, M, D, h, m, s };
};

export const DurationToString = (ms: number, length: number = 3) => {
	let i = 0;
	const temp: { [key: string]: number } = DurationToYMDhms(ms);
	const res: string[] = [];
	for (const key in temp) {
		if (Object.prototype.hasOwnProperty.call(temp, key)) {
			const value: number = temp[key];
			if (value) {
				res.push(`${value}${key}`);
			}
		}
	}
	return res.slice(0, length).join(' ');
};

export const formatDate = (date: Date) => {
	return date
		.toLocaleString('en-US', {
			weekday: 'short',
			day: 'numeric',
			year: 'numeric',
			month: 'short',
			hour: 'numeric',
			minute: 'numeric',
		})
		.replace(/,/g, '');
};

// export interface ITokenInfo {
// 	releasedReward: BigNumber;
// 	lockedReward: BigNumber;
// 	flowratePerMS: BigNumber;
// 	flowratePerWeek: BigNumber;
// }
//
// export const calcTokenInfo = (
// 	initialAmount: BigNumber,
// 	totalTokens: BigNumber,
// 	totalReward: BigNumber,
// 	duration: number,
// 	cliffTime: Date,
// 	startTime: Date,
// 	targetTime: Date = new Date(),
// ): ITokenInfo => {
// 	const zeroResp = {
// 		releasedReward: BigNumber.from('0'),
// 		lockedReward: BigNumber.from('0'),
// 		flowratePerMS: BigNumber.from('0'),
// 		flowratePerWeek: BigNumber.from('0'),
// 	};
// 	try {
// 		const initReward = initialAmount.mul(totalReward).div(totalTokens); //amount of rewards that released in cliffTime.
// 		const cliffdif = cliffTime.getTime() - startTime.getTime();
// 		const now = targetTime.getTime() - startTime.getTime();
// 		if (now <= 0) {
// 			console.log('Not started');
// 			return zeroResp;
// 		} else if (now <= cliffdif) {
// 			console.log('In Cliff Time');
// 			return {
// 				releasedReward: initReward,
// 				lockedReward: totalReward.sub(initReward),
// 				flowratePerMS: BigNumber.from('0'),
// 				flowratePerWeek: BigNumber.from('0'),
// 			};
// 		} else if (now >= duration) {
// 			console.log('Ended');
// 			return {
// 				releasedReward: totalReward,
// 				lockedReward: BigNumber.from('0'),
// 				flowratePerMS: BigNumber.from('0'),
// 				flowratePerWeek: BigNumber.from('0'),
// 			};
// 		}
// 		const deltaTime = duration - cliffdif;
// 		const deltaAmount = totalReward.sub(initReward);
// 		const releasedReward = deltaAmount
// 			.mul(now - cliffdif)
// 			.div(deltaTime)
// 			.add(initReward);
// 		const lockedReward = totalReward.sub(releasedReward);
// 		const flowratePerMS = lockedReward.div(duration - now);
// 		const flowratePerWeek = flowratePerMS.mul(604800000);
// 		return { releasedReward, lockedReward, flowratePerMS, flowratePerWeek };
// 	} catch (error) {
// 		console.error('error in calcTokenInfo', error);
// 		return zeroResp;
// 	}
// };
