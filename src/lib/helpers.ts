import { Zero } from '@/helpers/number';

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
