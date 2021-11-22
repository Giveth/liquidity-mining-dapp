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
