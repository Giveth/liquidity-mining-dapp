import { createContext, FC, useContext, useEffect, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import { fetchBalances, IBalances, zeroBalances } from '@/services/subgraph';
import { OnboardContext } from '@/context/onboard.context';
import config from '@/configuration';

// export interface ITokenBalanceContext {
// 	tokenBalance: BigNumber;
// 	tokenDistroBalance: ITokenDistroBalance;
//
// 	mainnetTokenBalance: BigNumber;
// 	xDaiTokenBalance: BigNumber;
//
// 	mainnetTokenDistroBalance: ITokenDistroBalance;
// 	xDaiTokenDistroBalance: ITokenDistroBalance;
// }
//
// const initialTokenDistroBalance: ITokenDistroBalance = {
// 	claimable: Zero,
// 	allocatedAmount: Zero,
// 	claimedAmount: Zero,
// };
// const initialValue = {
// 	tokenBalance: Zero,
// 	mainnetTokenBalance: Zero,
// 	xDaiTokenBalance: Zero,
//
// 	tokenDistroBalance: initialTokenDistroBalance,
// 	mainnetTokenDistroBalance: initialTokenDistroBalance,
// 	xDaiTokenDistroBalance: initialTokenDistroBalance,
// };
// export const TokenBalanceContext =
// 	createContext<ITokenBalanceContext>(initialValue);
//
// export const TokenBalanceProvider: FC = ({ children }) => {
// 	const { address, network, provider } = useContext(OnboardContext);
// 	const [tokenBalance, setTokenBalance] = useState<BigNumber>(Zero);
// 	const [mainnetTokenBalance, setMainnetTokenBalance] =
// 		useState<BigNumber>(Zero);
// 	const [xDaiTokenBalance, setXDaiTokenBalance] = useState<BigNumber>(Zero);
//
// 	const [tokenDistroBalance, setTokenDistroBalance] =
// 		useState<ITokenDistroBalance>(initialTokenDistroBalance);
// 	const [mainnetTokenDistroBalance, setMainnetTokenDistroBalance] =
// 		useState<ITokenDistroBalance>(initialTokenDistroBalance);
// 	const [xDaiTokenDistroBalance, setXDaiTokenDistroBalance] =
// 		useState<ITokenDistroBalance>(initialTokenDistroBalance);
//
// 	const [newMainnetTokenBalance, setNewMainnetTokenBalance] =
// 		useState<BigNumber>(Zero);
// 	const [newXDaiTokenBalance, setNewXDaiTokenBalance] =
// 		useState<BigNumber>(Zero);
//
// 	useEffect(() => {
// 		if (!newMainnetTokenBalance.eq(mainnetTokenBalance))
// 			setMainnetTokenBalance(newMainnetTokenBalance);
// 	}, [newMainnetTokenBalance]);
//
// 	useEffect(() => {
// 		if (!newXDaiTokenBalance.eq(xDaiTokenBalance))
// 			setXDaiTokenBalance(newXDaiTokenBalance);
// 	}, [newXDaiTokenBalance]);
//
// 	useEffect(() => {
// 		switch (network) {
// 			case config.MAINNET_NETWORK_NUMBER:
// 				setTokenBalance(mainnetTokenBalance);
// 				break;
//
// 			case config.XDAI_NETWORK_NUMBER:
// 				setTokenBalance(xDaiTokenBalance);
// 				break;
//
// 			default:
// 		}
// 	}, [mainnetTokenBalance, xDaiTokenBalance, network]);
//
// 	useEffect(() => {
// 		switch (network) {
// 			case config.MAINNET_NETWORK_NUMBER:
// 				setTokenDistroBalance(mainnetTokenDistroBalance);
// 				break;
//
// 			case config.XDAI_NETWORK_NUMBER:
// 				setTokenDistroBalance(xDaiTokenDistroBalance);
// 				break;
//
// 			default:
// 		}
// 	}, [mainnetTokenDistroBalance, xDaiTokenDistroBalance, network]);
//
// 	useEffect(() => {
// 		const getTokenContract = (_network: number) => {
// 			const networkConfig = config.NETWORKS_CONFIG[_network];
// 			return getERC20Contract(
// 				networkConfig?.TOKEN_ADDRESS,
// 				_network,
// 				_network === network ? provider : null,
// 			);
// 		};
//
// 		const fetchTokenBalance = async () => {
// 			const mainnetTokenContract = getTokenContract(
// 				config.MAINNET_NETWORK_NUMBER,
// 			);
//
// 			if (!mainnetTokenContract) {
// 				console.error('No mainnet token contract found!');
// 				return;
// 			}
//
// 			const xDaiTokenContract = getTokenContract(
// 				config.XDAI_NETWORK_NUMBER,
// 			);
//
// 			if (!xDaiTokenContract) {
// 				console.error('No xDai token contract found!');
// 				return;
// 			}
//
// 			const safeNetworkCall = async <T extends unknown>(
// 				promise: Promise<T>,
// 				defaultValue: T,
// 			): Promise<T> => {
// 				try {
// 					return await promise;
// 				} catch (e) {
// 					console.error(e);
// 				}
// 				return defaultValue;
// 			};
//
// 			const defaultTokenDistroResult: ITokenDistroBalance = {
// 				claimable: Zero,
// 				allocatedAmount: Zero,
// 				claimedAmount: Zero,
// 			};
// 			try {
// 				const [
// 					_newMainnetBalances,
// 					_newXDaiBalances,
// 					_mainnetTokenDistro,
// 					_xDaiTokenDistro,
// 				] = await Promise.all([
// 					// safeNetworkCall(
// 					// 	mainnetTokenContract.balanceOf(address),
// 					// 	Zero,
// 					// ),
// 					fetchBalances(config.MAINNET_NETWORK_NUMBER, address),
// 					// safeNetworkCall(xDaiTokenContract.balanceOf(address), Zero),
// 					fetchBalances(config.XDAI_NETWORK_NUMBER, address),
// 					safeNetworkCall(
// 						getTokenDistroAmounts(
// 							address,
// 							config.MAINNET_CONFIG.TOKEN_DISTRO_ADDRESS,
// 							config.MAINNET_NETWORK_NUMBER,
// 							network === config.MAINNET_NETWORK_NUMBER
// 								? provider
// 								: null,
// 						),
// 						defaultTokenDistroResult,
// 					),
// 					safeNetworkCall(
// 						getTokenDistroAmounts(
// 							address,
// 							config.XDAI_CONFIG.TOKEN_DISTRO_ADDRESS,
// 							config.XDAI_NETWORK_NUMBER,
// 							network === config.XDAI_NETWORK_NUMBER
// 								? provider
// 								: null,
// 						),
// 						defaultTokenDistroResult,
// 					),
// 				]);
//
// 				setNewMainnetTokenBalance(_newMainnetBalances.balance);
// 				setNewXDaiTokenBalance(_newXDaiBalances.balance);
//
// 				setMainnetTokenDistroBalance(_mainnetTokenDistro);
// 				setXDaiTokenDistroBalance(_xDaiTokenDistro);
// 			} catch (e) {
// 				console.error(
// 					'Error in fetching token and streaming balances',
// 					e,
// 				);
// 			}
// 		};
//
// 		if (isAddress(address)) {
// 			setTokenBalance(Zero);
// 			setNewMainnetTokenBalance(Zero);
// 			setNewXDaiTokenBalance(Zero);
//
// 			setTokenDistroBalance(initialTokenDistroBalance);
// 			setMainnetTokenDistroBalance(initialTokenDistroBalance);
// 			setXDaiTokenDistroBalance(initialTokenDistroBalance);
//
// 			fetchTokenBalance();
//
// 			const interval = setInterval(
// 				fetchTokenBalance,
// 				config.WEB3_POLLING_INTERVAL,
// 			);
// 			return () => {
// 				clearInterval(interval);
// 			};
// 		}
// 	}, [address, network, provider]);
//
// 	return (
// 		<TokenBalanceContext.Provider
// 			value={{
// 				tokenBalance,
// 				mainnetTokenBalance,
// 				xDaiTokenBalance,
// 				tokenDistroBalance,
// 				mainnetTokenDistroBalance,
// 				xDaiTokenDistroBalance,
// 			}}
// 		>
// 			{children}
// 		</TokenBalanceContext.Provider>
// 	);
// };
//
// export function useTokenBalance() {
// 	const context = useContext(TokenBalanceContext);
//
// 	if (!context) {
// 		throw new Error('Token balance context not found!');
// 	}
//
// 	return context;
// }

export interface IBalanceContext {
	currentBalance: IBalances;

	mainnetBalance: IBalances;
	xDaiBalance: IBalances;
}

export const BalanceContext = createContext<IBalanceContext>({
	currentBalance: zeroBalances,
	mainnetBalance: zeroBalances,
	xDaiBalance: zeroBalances,
});

export const BalanceProvider: FC = ({ children }) => {
	const { address, network, provider } = useContext(OnboardContext);

	const [currentBalance, setCurrentBalance] =
		useState<IBalances>(zeroBalances);
	const [mainnetBalance, setMainnetBalance] =
		useState<IBalances>(zeroBalances);
	const [xDaiBalance, setXDaiBalance] = useState<IBalances>(zeroBalances);

	useEffect(() => {
		switch (network) {
			case config.MAINNET_NETWORK_NUMBER:
				setCurrentBalance(mainnetBalance);
				break;

			case config.XDAI_NETWORK_NUMBER:
				setCurrentBalance(xDaiBalance);
				break;

			default:
		}
	}, [mainnetBalance, xDaiBalance, network]);

	useEffect(() => {
		const fetchTokenBalance = async () => {
			try {
				const [_newMainnetBalances, _newXDaiBalances] =
					await Promise.all([
						fetchBalances(config.MAINNET_NETWORK_NUMBER, address),
						fetchBalances(config.XDAI_NETWORK_NUMBER, address),
					]);

				setMainnetBalance(_newMainnetBalances);
				setXDaiBalance(_newXDaiBalances);
			} catch (e) {
				console.error(
					'Error in fetching token and streaming balances',
					e,
				);
			}
		};

		if (isAddress(address)) {
			fetchTokenBalance();

			const interval = setInterval(
				fetchTokenBalance,
				config.SUBGRAPH_POLLING_INTERVAL,
			);
			return () => {
				clearInterval(interval);
			};
		}
	}, [address, network, provider]);

	return (
		<BalanceContext.Provider
			value={{
				currentBalance,
				mainnetBalance,
				xDaiBalance,
			}}
		>
			{children}
		</BalanceContext.Provider>
	);
};

export function useBalances() {
	const context = useContext(BalanceContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
