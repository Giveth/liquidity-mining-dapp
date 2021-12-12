let initialized = false;
let timeDifference: number = 0;
let promise: Promise<number> | undefined;

export const getNowUnix = async (): Promise<number> => {
	if (initialized) {
		return Date.now() + timeDifference;
	}

	if (promise) {
		return promise;
	}

	promise = new Promise(async resolve => {
		let now;

		try {
			const response = await fetch(
				'https://api.timezonedb.com/v2.1/get-time-zone?by=zone&format=json&key=LU8PKNDD9BUB&zone=GM',
			);

			if (response.ok) {
				const json = await response.json();
				const { timestamp, gmtOffset } = json;
				const unixMS = (timestamp - gmtOffset) * 1000;
				// console.info('unixMs:', unixMS);
				timeDifference = unixMS - Date.now();
				// console.info('Machine time difference ms:', timeDifference);
				initialized = true;
				now = unixMS;
			} else {
				now = Date.now();
			}
		} catch (e) {
			console.error('Error in getting time:', e);
			now = Date.now();
		}

		promise = undefined;

		resolve(now);
	});

	return promise;
};
