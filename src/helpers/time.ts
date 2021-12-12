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
				'http://worldtimeapi.org/api/timezone/Etc/UTC',
			);

			if (response.ok) {
				const json = await response.json();
				const { unixtime } = json;
				console.info('Unix time from api:', unixtime);
				timeDifference = unixtime * 1000 - Date.now();
				console.info('Machine time difference ms:', timeDifference);
				initialized = true;
				now = unixtime * 1000;
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
