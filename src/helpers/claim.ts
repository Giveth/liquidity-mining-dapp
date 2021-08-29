import { getAddress } from 'ethers/lib/utils';
import { constants, Contract, ethers } from 'ethers';
import { fetchMerkleResults } from './utils';
import { ClaimData } from '../types/giveDrop';
import { networkProviders } from './networkProvider';
import config from '../configuration';
import { abi as MERKLE_ABI } from '../artifacts/MerkleDrop.json';

export const formatAddress = (address: string): string => {
	try {
		return getAddress(address);
	} catch {
		return constants.AddressZero;
	}
};

export const fetchClaimData = async (
	address: string,
): Promise<ClaimData | undefined> => {
	try {
		const { claims } = await fetchMerkleResults();
		const formatted = formatAddress(address);

		return claims[formatted];
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);
		return undefined;
	}
};

export const hasClaimed = async (
	address: string,
	claimData: ClaimData,
): Promise<boolean> => {
	const provider = networkProviders[config.XDAI_NETWORK_NUMBER];
	const merkleContract = new Contract(
		config.XDAI_CONFIG.MERKLE_ADDRESS,
		MERKLE_ABI,
		provider,
	);

	try {
		const isClaimedResult = await merkleContract.isClaimed(
			Number(claimData.index),
		);

		return Boolean(isClaimedResult);
	} catch (e) {
		console.error('error:', e);
		return false;
	}
};
