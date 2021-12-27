// HRM: Human Readable Date.
export const DurationToYMDh = (ms: number) => {
	let baseTime = new Date(0);
	let duration = new Date(ms);

	let y = duration.getUTCFullYear() - baseTime.getUTCFullYear();
	let m = duration.getUTCMonth() - baseTime.getUTCMonth();
	let d = duration.getUTCDate() - baseTime.getUTCDate();
	let h = duration.getUTCHours() - baseTime.getUTCHours();
	// let min = duration.getUTCMinutes() - baseTime.getUTCMinutes();
	// let sec = duration.getUTCSeconds() - baseTime.getUTCSeconds();

	return { y, m, d, h };
};

export const DurationToString = (ms: number, length: number = 3) => {
	let i = 0;
	const temp: { [key: string]: number } = DurationToYMDh(ms);
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
