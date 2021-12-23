import { isAddress } from 'ethers/lib/utils';
import { Contract } from 'ethers';
import { ClaimData } from '../types/GIV';
import config from '../configuration';
import { abi as MERKLE_ABI } from '../artifacts/MerkleDrop.json';
import { abi as TOKEN_DISTRO_ABI } from '../artifacts/TokenDistro.json';
import { Web3Provider, TransactionResponse } from '@ethersproject/providers';
import { fetchBalances } from '@/services/subgraph';

export const fetchAirDropClaimData = async (
	address: string,
): Promise<ClaimData | undefined> => {
	if (!address) return undefined;
	try {
		const data = { address };
		const response = await fetch('/api/airdrop', {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify(data),
		});
		const json = await response.json();
		return json;
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);
		return undefined;
	}
};

export const hasClaimedAirDrop = async (address: string): Promise<boolean> => {
	const { givDropClaimed } = await fetchBalances(
		config.XDAI_NETWORK_NUMBER,
		address,
	);
	return givDropClaimed;
};

export const claimAirDrop = async (
	address: string,
	provider: Web3Provider,
): Promise<TransactionResponse | undefined> => {
	const merkleAddress = config.XDAI_CONFIG.MERKLE_ADDRESS;
	if (!isAddress(merkleAddress)) throw new Error('No MerkleAddress');
	if (!provider) throw new Error('No Provider');

	const signer = provider.getSigner().connectUnchecked();
	const merkleContract = new Contract(merkleAddress, MERKLE_ABI, provider);

	const claimData = await fetchAirDropClaimData(address);

	if (!claimData) throw new Error('No claim data');

	const args = [claimData.index, claimData.amount, claimData.proof];

	return await merkleContract
		.connect(signer.connectUnchecked())
		.claim(...args, {
			maxFeePerGas: 4000000000,
			maxPriorityFeePerGas: 3000000000,
		});
};

export const claimReward = async (
	tokenDistroAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (!isAddress(tokenDistroAddress)) return;
	if (!provider) return;

	const signer = provider.getSigner();
	const network = provider.network.chainId;

	const tokenDistro = new Contract(
		tokenDistroAddress,
		TOKEN_DISTRO_ABI,
		signer.connectUnchecked(),
	);

	const tx = await tokenDistro.claim();

	return tx;

	// showPendingClaim(network, tx.hash);

	// const { status } = await tx.wait();

	// if (status) {
	// 	showConfirmedClaim(network, tx.hash);
	// } else {
	// 	showFailedClaim(network, tx.hash);
	// }
};
