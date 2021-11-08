import {
	createContext,
	FC,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Pool, Position } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';

import { LiquidityPosition } from '@/types/nfts';
import config from '@/configuration';
import { UniswapV3PoolStakingConfig } from '@/types/config';
import { useOnboard } from '.';
import {
	getGivethV3PoolContract,
	getNftManagerPositionsContract,
	getUniswapV3StakerContract,
} from '@/lib/contracts';

const ERC721NftContext = createContext<{
	totalNftPositions: LiquidityPosition[];
	stakedPositions: LiquidityPosition[];
	unstakedPositions: LiquidityPosition[];
	currentIncentive: { key?: (string | number)[] | null };
	loadingNftPositions: boolean;
	loadPositions: () => any;
} | null>(null);

export const NftsProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const network = config.MAINNET_NETWORK_NUMBER;
	const { address: walletAddress, provider } = useOnboard();

	const [totalNftPositions, setTotalNftPositions] = useState<
		LiquidityPosition[]
	>([]);
	const [stakedPositions, setStakedPositions] = useState<LiquidityPosition[]>(
		[],
	);
	const [unstakedPositions, setUnstakedPositions] = useState<
		LiquidityPosition[]
	>([]);

	const [loadingNftPositions, setLoadingNftPositions] = useState(false);

	const mainnetConfig = config.MAINNET_CONFIG;
	const wethAddress = mainnetConfig.WETH_TOKEN_ADDRESS;
	const givethAddress = mainnetConfig.TOKEN_ADDRESS;

	const uniswapConfig = mainnetConfig.pools[0] as UniswapV3PoolStakingConfig;
	const rewardToken = uniswapConfig.REWARD_TOKEN;
	const poolAddress = uniswapConfig.UNISWAP_V3_LP_POOL;
	const incentiveRefundeeAddress = uniswapConfig.INCENTIVE_REFUNDEE_ADDRESS;

	const currentIncentive = useMemo(() => {
		if (
			!rewardToken ||
			!poolAddress ||
			!incentiveRefundeeAddress ||
			(network !== 1 && network !== 4 && network !== 42)
		)
			return { key: null };

		const { INCENTIVE_START_TIME, INCENTIVE_END_TIME } = uniswapConfig;

		return {
			key: [
				rewardToken,
				poolAddress,
				INCENTIVE_START_TIME,
				INCENTIVE_END_TIME,
				incentiveRefundeeAddress,
			],
		};
	}, [
		rewardToken,
		poolAddress,
		incentiveRefundeeAddress,
		network,
		uniswapConfig,
	]);

	// check for WETH / GIV Pair
	const checkForGivethLp = useCallback(
		(token0: string, token1: string): boolean => {
			if (!wethAddress || !givethAddress) return false;
			if (
				token0.toLowerCase() === wethAddress.toLowerCase() &&
				token1.toLowerCase() === givethAddress.toLowerCase()
			) {
				return true;
			} else if (
				token0.toLowerCase() === givethAddress.toLowerCase() &&
				token1.toLowerCase() === wethAddress.toLowerCase()
			) {
				return true;
			} else {
				return false;
			}
		},
		[wethAddress, givethAddress],
	);

	const loadPositions = useCallback(() => {
		const uniswapV3StakerContract = getUniswapV3StakerContract(provider);
		const givethV3PoolContract = getGivethV3PoolContract(provider);
		const nftManagerPositionsContract =
			getNftManagerPositionsContract(provider);

		if (
			!nftManagerPositionsContract ||
			!uniswapV3StakerContract ||
			!walletAddress ||
			!givethAddress ||
			!givethV3PoolContract ||
			!network
		)
			return;

		const loadPositions = async (owner: string) => {
			// get number of tokens owned by address
			try {
				const noOfPositions =
					await nftManagerPositionsContract.balanceOf(owner);

				// construct multicall to get all tokenIDs

				const tokenIdsCalldata: Array<string> = new Array(
					noOfPositions.toNumber(),
				)
					.fill(0)
					.map((_, i) =>
						nftManagerPositionsContract.interface.encodeFunctionData(
							'tokenOfOwnerByIndex',
							[owner, i],
						),
					);

				// return list of tokenId big numbers
				const tokenIds = (
					await nftManagerPositionsContract.callStatic.multicall(
						tokenIdsCalldata,
					)
				)
					.map((result: any) =>
						nftManagerPositionsContract.interface.decodeFunctionResult(
							'tokenOfOwnerByIndex',
							result,
						),
					)
					.filter((tokenId: any) => Array.isArray(tokenId))
					.map(([tokenId]: any) => tokenId);

				// construst position call data
				const positionCallData = tokenIds.map((tokenId: any) =>
					nftManagerPositionsContract.interface.encodeFunctionData(
						'positions',
						[tokenId],
					),
				);

				const encodedPositions =
					await nftManagerPositionsContract.callStatic.multicall(
						positionCallData,
					);

				// get pool info
				const slot0 = await givethV3PoolContract.slot0();

				// return GIV / Eth positions owned by user
				const positions: any[] = (
					await Promise.all(
						encodedPositions.map(
							(encodedPosition: any, i: number) =>
								filterPositions(
									owner,
									encodedPosition,
									tokenIds[i],
									slot0,
								),
						),
					)
				).filter((p: any) => p);

				console.log('loaoaa', encodedPositions);

				return positions;
			} catch (err) {
				console.log('err', err);
				return [];
			}
		};

		const filterPositions = async (
			owner: string,
			encodedPosition: any,
			tokenId: any,
			slot0: any,
		): Promise<any | null> => {
			try {
				const { token0, token1, liquidity, fee, tickLower, tickUpper } =
					nftManagerPositionsContract.interface.decodeFunctionResult(
						'positions',
						encodedPosition,
					);

				// check for liquidity
				if (liquidity.isZero()) {
					return null;
				}

				// check for GIV / ETH pair
				if (!checkForGivethLp(token0, token1)) {
					return null;
				}

				// check if fee is 0.3%
				if (fee !== 3000) {
					return null;
				}

				// sdk position
				let _position: Position | null = null;
				if (
					poolAddress &&
					liquidity &&
					typeof tickLower === 'number' &&
					typeof tickUpper === 'number'
				) {
					try {
						let _token0: Token;
						let _token1: Token;
						if (
							token0.toLowerCase() ===
							givethAddress?.toLowerCase()
						) {
							_token0 = new Token(
								network,
								token0,
								18,
								'GIV',
								'GIV',
							);
							_token1 = new Token(
								network,
								token1,
								18,
								'WETH',
								'WETH',
							);
						} else {
							_token0 = new Token(
								network,
								token1,
								18,
								'WETH',
								'WETH',
							);
							_token1 = new Token(
								network,
								token0,
								18,
								'GIV',
								'GIV',
							);
						}

						let pool = new Pool(
							_token0,
							_token1,
							fee,
							slot0.sqrtPriceX96,
							liquidity,
							slot0.tick,
						);

						_position = new Position({
							pool,
							liquidity: liquidity.toString(),
							tickLower,
							tickUpper,
						});
					} catch (err) {
						console.log('error', err);
					}
				}

				const stakedPosition = await uniswapV3StakerContract.deposits(
					tokenId,
				);

				// check if owner of staked nft
				let forTotalLiquidity = false;
				if (
					owner !== walletAddress &&
					stakedPosition.owner.toLowerCase() !== walletAddress
				) {
					forTotalLiquidity = true;
				}

				return {
					owner,
					staked: !!stakedPosition.numberOfStakes,
					numberOfStakes: stakedPosition.numberOfStakes,
					tokenId,
					forTotalLiquidity,
					_position,
				};
			} catch {
				return null;
			}
		};

		const init = async () => {
			try {
				setLoadingNftPositions(true);

				const owners: string[] = [
					walletAddress,
					uniswapV3StakerContract.address,
				];

				const allPositions: LiquidityPosition[][] = await Promise.all(
					owners.map(loadPositions),
				);

				const downloadURI = async (
					position: any,
				): Promise<any | null> => {
					const uri = await nftManagerPositionsContract.tokenURI(
						position.tokenId,
					);

					return { ...position, uri };
				};

				const stakedPositions = allPositions
					.flat()
					.filter(
						position =>
							position.staked && !position.forTotalLiquidity,
					);

				const stakedPositionsWithURI = await Promise.all(
					stakedPositions.map(downloadURI),
				);

				const unstakedPositions = allPositions
					.flat()
					.filter(
						position =>
							!position.staked && !position.forTotalLiquidity,
					);

				const unstakedPositionsWithURI = await Promise.all(
					unstakedPositions.map(downloadURI),
				);

				setTotalNftPositions(allPositions.flat());
				setStakedPositions(stakedPositionsWithURI);
				setUnstakedPositions(unstakedPositionsWithURI);

				setLoadingNftPositions(false);
			} catch (e) {
				setLoadingNftPositions(false);
				console.log(`getAddressInfo failed: ${e}`);
			}
		};

		return init();
	}, [
		walletAddress,
		checkForGivethLp,
		network,
		poolAddress,
		givethAddress,
		provider,
	]);

	//initial load of positions
	useEffect(() => {
		const nftManagerPositionsContract =
			getNftManagerPositionsContract(provider);

		const uniswapV3StakerContract = getUniswapV3StakerContract(provider);
		if (
			!nftManagerPositionsContract ||
			!uniswapV3StakerContract ||
			!walletAddress
		)
			return;

		// only check if network is ethereum or rinkeby
		if (network && (network === 1 || network === 4 || network == 42)) {
			loadPositions();
		}
	}, [walletAddress, loadPositions, network, provider]);
	// handle nft events
	useEffect(() => {
		const nftManagerPositionsContract =
			getNftManagerPositionsContract(provider);

		const uniswapV3StakerContract = getUniswapV3StakerContract(provider);
		if (
			!nftManagerPositionsContract ||
			!uniswapV3StakerContract ||
			!walletAddress
		)
			return;

		const handleTransfer = (_1: any, address1: any, address2: string) => {
			loadPositions();
		};

		const subscribe = () => {
			const inTransfer =
				uniswapV3StakerContract.filters.DepositTransferred(
					null,
					walletAddress,
					null,
				);
			const outTransfer =
				uniswapV3StakerContract.filters.DepositTransferred(
					null,
					null,
					walletAddress,
				);
			uniswapV3StakerContract.on(inTransfer, handleTransfer);
			uniswapV3StakerContract.on(outTransfer, handleTransfer);

			return () => {
				uniswapV3StakerContract.off(inTransfer, handleTransfer);
				uniswapV3StakerContract.off(outTransfer, handleTransfer);
			};
		};

		return subscribe();
	}, [walletAddress, loadPositions, provider]);

	return (
		<ERC721NftContext.Provider
			value={{
				totalNftPositions,
				stakedPositions,
				unstakedPositions,
				currentIncentive,
				loadingNftPositions,
				loadPositions,
			}}
		>
			{children}
		</ERC721NftContext.Provider>
	);
};

export function useLiquidityPositions() {
	const context = useContext(ERC721NftContext);

	if (!context) {
		throw new Error('ERC721 context not found!');
	}

	return context;
}