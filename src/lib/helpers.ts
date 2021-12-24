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
