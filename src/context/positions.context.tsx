import {
	createContext,
	FC,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Pool, Position } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';

import { LiquidityPosition } from '@/types/nfts';
import config from '@/configuration';
import { StakingType, UniswapV3PoolStakingConfig } from '@/types/config';
import { useOnboard } from '.';
import {
	getUniswapV3Pool,
	getUniswapV3TokenURI,
	getUserPositions,
	IUniswapV3Pool,
	IUniswapV3Position,
	IUserPositions,
} from '@/services/subgraph';
import { Zero } from '@/helpers/number';
import BigNumber from 'bignumber.js';
import { constants } from 'ethers';

const ERC721NftContext = createContext<{
	totalNftPositions: LiquidityPosition[];
	stakedPositions: LiquidityPosition[];
	unstakedPositions: LiquidityPosition[];
	currentIncentive: { key?: (string | number)[] | null };
	loadingNftPositions: boolean;
	loadPositions: () => any;
	apr: BigNumber;
} | null>(null);

interface IPositionsInfo {
	userPositionInfo: IUserPositions;
	poolInfo: IUniswapV3Pool;
}

export const NftsProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const network = config.MAINNET_NETWORK_NUMBER;
	const { address: walletAddress, network: walletNetwork } = useOnboard();

	const [totalNftPositions, setTotalNftPositions] = useState<
		LiquidityPosition[]
	>([]);
	const [stakedPositions, setStakedPositions] = useState<LiquidityPosition[]>(
		[],
	);
	const [unstakedPositions, setUnstakedPositions] = useState<
		LiquidityPosition[]
	>([]);
	const [apr, setApr] = useState<BigNumber>(Zero);

	const [loadingNftPositions, setLoadingNftPositions] = useState(false);

	const lastPositionInfo = useRef<IPositionsInfo | null>(null);
	const mainnetConfig = config.MAINNET_CONFIG;
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
			network !== config.MAINNET_NETWORK_NUMBER
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

	const positionInfoIsChanged = (
		newPositionInfo: IPositionsInfo | null,
	): boolean => {
		if (newPositionInfo === null) return false;
		if (lastPositionInfo.current === null) return true;

		const { userPositionInfo: newUserPositionInfo, poolInfo: newPoolInfo } =
			newPositionInfo;
		const {
			userPositionInfo: lastUserPositionInfo,
			poolInfo: lastPoolInfo,
		} = lastPositionInfo.current;
		if (
			!newPoolInfo.stakedLiquidity.eq(lastPoolInfo.stakedLiquidity) ||
			!newPoolInfo.liquidity.eq(lastPoolInfo.liquidity) ||
			newPoolInfo.tick !== lastPoolInfo.tick ||
			!newPoolInfo.sqrtPriceX96.eq(lastPoolInfo.sqrtPriceX96)
		)
			return true;

		const { staked: newStaked, notStaked: newNotStaked } =
			newUserPositionInfo;
		const { staked: currentStaked, notStaked: currentNotStaked } =
			lastUserPositionInfo;

		if (
			newStaked.length !== currentStaked.length ||
			newNotStaked.length !== currentNotStaked.length
		)
			return true;

		let changed = false;

		// Comparing tokenId is enough
		for (const position of newStaked) {
			if (!currentStaked.some(_p => _p.tokenId === position.tokenId)) {
				changed = true;
				break;
			}
		}

		if (changed) return true;

		for (const position of newNotStaked) {
			if (!currentNotStaked.some(_p => _p.tokenId === position.tokenId)) {
				changed = true;
				break;
			}
		}
		return changed;
	};

	const loadPositions = useCallback(() => {
		if (!walletAddress || !givethAddress || !network) return;

		const fetchPositions = async (
			owner: string,
		): Promise<IPositionsInfo> => {
			// get number of tokens owned by address
			const [userPositionInfo, poolInfo]: [
				IUserPositions,
				IUniswapV3Pool,
			] = await Promise.all([
				getUserPositions(owner),
				getUniswapV3Pool(poolAddress),
			]);

			return {
				userPositionInfo,
				poolInfo,
			};
		};

		const transformToLiquidityPosition = async (
			{
				liquidity,
				owner,
				staked,
				tickLower,
				tickUpper,
				tokenId,
			}: IUniswapV3Position,
			pool: Pool,
		): Promise<LiquidityPosition | null> => {
			try {
				// sdk position
				let _position: Position | null = null;
				if (poolAddress && liquidity) {
					try {
						_position = new Position({
							pool,
							liquidity: liquidity.toString(),
							tickLower: tickLower,
							tickUpper: tickUpper,
						});
					} catch (err) {
						console.log('error', err);
					}
				}

				return {
					owner: owner,
					staked: staked,
					tokenId: tokenId,
					uri: '',
					_position,
				};
			} catch {
				return null;
			}
		};

		const init = async () => {
			try {
				setLoadingNftPositions(true);

				const positionInfo = await fetchPositions(walletAddress);

				if (!positionInfoIsChanged(positionInfo)) return;

				console.log('New position info fetched');

				lastPositionInfo.current = positionInfo;
				const { userPositionInfo, poolInfo } = positionInfo;

				const { TOKEN_ADDRESS, WETH_TOKEN_ADDRESS } =
					config.MAINNET_CONFIG;

				const givToken = new Token(
					network,
					TOKEN_ADDRESS,
					18,
					'GIV',
					'GIV',
				);
				const wethToken = new Token(
					network,
					WETH_TOKEN_ADDRESS,
					18,
					'WETH',
					'WETH',
				);

				const givIsToken0 =
					poolInfo.token0.toLowerCase() ===
					TOKEN_ADDRESS.toLowerCase();

				const _token0: Token = givIsToken0 ? givToken : wethToken;
				const _token1: Token = givIsToken0 ? wethToken : givToken;

				let pool = new Pool(
					_token0,
					_token1,
					3000,
					poolInfo.sqrtPriceX96.toString(),
					poolInfo.liquidity.toString(),
					poolInfo.tick,
				);

				const allPositions: LiquidityPosition[] = (
					await Promise.all(
						[
							...userPositionInfo.staked,
							...userPositionInfo.notStaked,
						].map(positionInfo =>
							transformToLiquidityPosition(positionInfo, pool),
						),
					)
				).filter(p => p) as LiquidityPosition[];

				const downloadURI = async (
					position: LiquidityPosition,
				): Promise<any | null> => {
					const { tokenId } = position;
					const key = `nft-${tokenId}-uri`;
					let uri = window.sessionStorage.getItem(key);
					if (!uri) {
						try {
							uri = await getUniswapV3TokenURI(tokenId);
							window.sessionStorage.setItem(key, uri as string);
						} catch (e) {
							console.error(
								'Error on fetching uri of token ' + tokenId,
								e,
							);
						}
					}

					return { ...position, uri };
				};

				const stakedPositions = allPositions
					.flat()
					.filter(position => position.staked);

				const stakedPositionsWithURI = await Promise.all(
					stakedPositions.map(downloadURI),
				);

				const unstakedPositions = allPositions
					.flat()
					.filter(position => !position.staked);

				const unstakedPositionsWithURI = await Promise.all(
					unstakedPositions.map(downloadURI),
				);

				setTotalNftPositions(allPositions);
				setStakedPositions(stakedPositionsWithURI);
				setUnstakedPositions(unstakedPositionsWithURI);

				const ethPriceInGIV = pool.priceOf(pool.token1).toFixed(10);
				// console.log('ethPriceInGIV: ', ethPriceInGIV);

				const allStaked = (await Promise.all(
					userPositionInfo.allStaked.map(p =>
						transformToLiquidityPosition(p, pool),
					),
				)) as LiquidityPosition[];

				const totalETHValue = allStaked
					.flat()
					.reduce((acc, { _position }) => {
						if (!_position) return acc;

						if (givIsToken0) {
							// GIV is token0

							// GIV Token
							// let _givToken = _position.pool.token0;

							// amount of giv in LP
							let givAmount = _position.amount0;

							// amount of eth in LP
							let wethAmount = _position.amount1;

							// calc value of GIV in terms of ETH
							const ethValueGIV =
								_position.pool.token0Price.quote(givAmount);

							// add values of all tokens in ETH
							return acc?.add(ethValueGIV).add(wethAmount);
						} else {
							// WETH is token0

							// amount of giv in LP
							let wethAmount = _position.amount0;

							// amount of eth in LP
							let givAmount = _position.amount1;

							// calc value of GIV in terms of ETH
							const ethValueGIV =
								_position.pool.token1Price.quote(givAmount);

							// add values of all tokens in ETH
							return acc?.add(ethValueGIV).add(wethAmount);
						}
					}, allStaked[0]._position?.amount1.multiply('0'));

				if (totalETHValue) {
					const totalLiquidityEth = totalETHValue.toFixed(18);
					// console.log('totalLiquidityEth:', totalLiquidityEth);

					const uniswapV3PoolStakingConfig =
						config.MAINNET_CONFIG.pools.find(
							p => p.type === StakingType.UNISWAP,
						) as UniswapV3PoolStakingConfig;
					const {
						INCENTIVE_REWARD_AMOUNT,
						INCENTIVE_START_TIME,
						INCENTIVE_END_TIME,
					} = uniswapV3PoolStakingConfig;

					const currentApr = new BigNumber(INCENTIVE_REWARD_AMOUNT)
						.div(ethPriceInGIV)
						.div(totalLiquidityEth)
						.times(31536000)
						.div(INCENTIVE_END_TIME - INCENTIVE_START_TIME)
						.times(100);

					setApr(currentApr);
				}

				setLoadingNftPositions(false);
			} catch (e) {
				setLoadingNftPositions(false);
				console.log(`getAddressInfo failed: ${e}`);
			}
		};

		return init();
	}, [walletAddress, network]);

	//initial load of positions
	useEffect(() => {
		const cb = () => {
			if (!walletAddress) return;

			// only check if network is ethereum or rinkeby
			if (network && network === config.MAINNET_NETWORK_NUMBER) {
				loadPositions();
			}
		};
		cb();
		const interval = setInterval(cb, config.SUBGRAPH_POLLING_INTERVAL);
		return () => {
			clearInterval(interval);
		};
	}, [walletAddress, loadPositions, network]);

	return (
		<ERC721NftContext.Provider
			value={{
				totalNftPositions,
				stakedPositions,
				unstakedPositions,
				currentIncentive,
				loadingNftPositions,
				loadPositions,
				apr,
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
