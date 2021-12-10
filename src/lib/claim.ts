import { getAddress, isAddress } from 'ethers/lib/utils';
import { constants, Contract } from 'ethers';
import { fetchMerkleResults } from '../helpers/utils';
import { ClaimData, ITokenDistroBalance } from '../types/GIV';
import { networkProviders } from '../helpers/networkProvider';
import config from '../configuration';
import { abi as MERKLE_ABI } from '../artifacts/MerkleDrop.json';
import { abi as TOKEN_DISTRO_ABI } from '../artifacts/TokenDistro.json';
import {
	JsonRpcProvider,
	Web3Provider,
	TransactionResponse,
} from '@ethersproject/providers';

export const formatAddress = (address: string): string => {
	try {
		return getAddress(address);
	} catch {
		return constants.AddressZero;
	}
};

export const getERC20Contract = (
	address: string,
	network: number,
	userProvider: Web3Provider | null,
) => {
	const networkConfig = config.NETWORKS_CONFIG[network];
	const provider: JsonRpcProvider = userProvider
		? userProvider
		: networkProviders[network];

	if (!networkConfig || !provider) {
		return null;
	}

	const ERC20ABI = [
		// read balanceOf
		{
			constant: true,
			inputs: [{ name: '_owner', type: 'address' }],
			name: 'balanceOf',
			outputs: [{ name: 'balance', type: 'uint256' }],
			type: 'function',
		},
	];
	return new Contract(address, ERC20ABI, provider);
};

export const fetchAirDropClaimData = async (
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

export const hasClaimedAirDrop = async (
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

export const claimAirDrop = async (
	address: string,
	provider: Web3Provider,
): Promise<any> => {
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
		.claim(...args);
};

export const getTokenDistroAmounts = async (
	address: string,
	tokenDistroAddress: string,
	networkNumber: number,
	userProvider: Web3Provider | null,
): Promise<ITokenDistroBalance> => {
	if (!isAddress(tokenDistroAddress)) {
		return {
			claimable: constants.Zero,
			allocatedAmount: constants.Zero,
			claimedAmount: constants.Zero,
		};
	}

	const provider: JsonRpcProvider = userProvider
		? userProvider
		: networkProviders[networkNumber];

	const tokenDistro = new Contract(
		tokenDistroAddress,
		TOKEN_DISTRO_ABI,
		provider,
	);

	const balances = await tokenDistro.balances(address);
	const claimable = await tokenDistro.claimableNow(address);
	const [allocatedAmount, claimedAmount] = balances;

	return { claimable, allocatedAmount, claimedAmount };
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
