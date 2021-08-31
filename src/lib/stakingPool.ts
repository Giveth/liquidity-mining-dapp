import { Contract, ethers } from 'ethers';

import { abi as LM_ABI } from '../artifacts/UnipoolTokenDistributor.json';
import { StakePoolInfo } from '../types/poolInfo';
import { networkProviders } from '../helpers/networkProvider';
import BigNumber from 'bignumber.js';

export const fetchGivMiningInfo = async (
	lmAddress: string,
	network: number,
): Promise<StakePoolInfo> => {
	const provider = networkProviders[network];
	const lmContract = new Contract(lmAddress, LM_ABI, provider);

	let apr: BigNumber | null;
	let totalSupply;

	const [_totalSupply, _rewardRate]: [ethers.BigNumber, ethers.BigNumber] =
		await Promise.all([lmContract.totalSupply(), lmContract.rewardRate()]);
	totalSupply = new BigNumber(_totalSupply.toString());
	apr = totalSupply.isZero()
		? null
		: new BigNumber(_rewardRate.toString())
				.times('31536000')
				.times('100')
				.div(_totalSupply.toString());

	return {
		tokensInPool: totalSupply,
		apr,
	};
};
