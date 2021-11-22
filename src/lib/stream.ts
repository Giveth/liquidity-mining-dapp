import { Contract } from 'ethers';
import { abi as TOKEN_DISTRO_ABI } from '@/artifacts/TokenDistro.json';
import { networkProviders } from '@/helpers/networkProvider';
import { isAddress } from 'ethers/lib/utils';
import config from '@/configuration';

export interface IStreamInfo {
	startTime: Date;
	endTime: Date;
	duration: number;
	progress: number;
	remain: number;
	percent: number;
}

export const fetchStreamProgress = async (
	network: number,
): Promise<IStreamInfo> => {
	const failResp = {
		startTime: new Date(),
		endTime: new Date(),
		duration: 0,
		progress: 0,
		remain: 0,
		percent: 0,
	};

	let tokenDistroAddress = '';
	if (network === config.MAINNET_NETWORK_NUMBER) {
		tokenDistroAddress = config.MAINNET_CONFIG.TOKEN_DISTRO_ADDRESS;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		tokenDistroAddress = config.XDAI_CONFIG.TOKEN_DISTRO_ADDRESS;
	}

	if (!isAddress(tokenDistroAddress)) {
		return failResp;
	}
	const provider = networkProviders[network];

	const tokenDistro = new Contract(
		tokenDistroAddress,
		TOKEN_DISTRO_ABI,
		provider,
	);

	try {
		const _startTime = await tokenDistro.startTime();
		const _duration = await tokenDistro.duration();

		const startTime = new Date(+(_startTime.toString() + '000'));
		const duration = +(_duration.toString() + '000');

		const progress = Date.now() - startTime.getTime();
		// console.log(`progress`, convertMSToHRD(progress));

		const endTime = new Date(startTime.getTime() + duration);
		// console.log(`endTime`, endTime);

		const remain = endTime.getTime() - Date.now();
		// console.log(`remain`, convertMSToHRD(remain));

		const percent = Math.floor((progress / duration) * 100);
		// console.log(`percent`, percent);

		return {
			startTime,
			endTime,
			duration,
			progress,
			remain,
			percent,
		};
	} catch (error) {
		console.error('Fail to fetchStreamProgress');
		return failResp;
	}
};
