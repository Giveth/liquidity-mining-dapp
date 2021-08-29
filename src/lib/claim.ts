import { getAddress, isAddress } from 'ethers/lib/utils';
import { constants, Contract } from 'ethers';
import { fetchMerkleResults } from '../helpers/utils';
import { ClaimData } from '../types/giveDrop';
import { networkProviders } from '../helpers/networkProvider';
import config from '../configuration';
import { abi as MERKLE_ABI } from '../artifacts/MerkleDrop.json';
import { abi as TOKEN_DISTRO_ABI } from '../artifacts/TokenDistro.json';
import { Web3Provider } from '@ethersproject/providers';

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

export const claim = async (
	address: string,
	provider: Web3Provider,
): Promise<any> => {
	const merkleAddress = config.XDAI_CONFIG.MERKLE_ADDRESS;
	if (!isAddress(merkleAddress)) throw new Error('No MerkleAddress');
	if (!provider) throw new Error('No Provider');

	const signer = provider.getSigner().connectUnchecked();
	const merkleContract = new Contract(merkleAddress, MERKLE_ABI, provider);

	const claimData = await fetchClaimData(address);

	if (!claimData) throw new Error('No claim data');

	const args = [claimData.index, address, claimData.amount, claimData.proof];

	return await merkleContract
		.connect(signer.connectUnchecked())
		.claim(...args);
};
