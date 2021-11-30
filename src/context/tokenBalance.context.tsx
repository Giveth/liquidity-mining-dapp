import { createContext, FC, useContext, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { Zero } from '@ethersproject/constants';
import { OnboardContext } from './onboard.context';
import config from '../configuration';
import { isAddress } from 'ethers/lib/utils';
import { getERC20Contract, getTokenDistroAmounts } from '../lib/claim';
import { ITokenDistroBalance } from '../types/GIV';
import { fetchBalance } from '@/services/subgraph';

export interface ITokenBalanceContext {
	tokenBalance: BigNumber;
	tokenDistroBalance: ITokenDistroBalance;

	mainnetTokenBalance: BigNumber;
	xDaiTokenBalance: BigNumber;

	mainnetTokenDistroBalance: ITokenDistroBalance;
	xDaiTokenDistroBalance: ITokenDistroBalance;
}

const initialTokenDistroBalance: ITokenDistroBalance = {
	claimable: Zero,
	locked: Zero,
};
const initialValue = {
	tokenBalance: Zero,
	mainnetTokenBalance: Zero,
	xDaiTokenBalance: Zero,

	tokenDistroBalance: initialTokenDistroBalance,
	mainnetTokenDistroBalance: initialTokenDistroBalance,
	xDaiTokenDistroBalance: initialTokenDistroBalance,
};
export const TokenBalanceContext =
	createContext<ITokenBalanceContext>(initialValue);

export const TokenBalanceProvider: FC = ({ children }) => {
	const { address, network, provider } = useContext(OnboardContext);
	const [tokenBalance, setTokenBalance] = useState<BigNumber>(Zero);
	const [mainnetTokenBalance, setMainnetTokenBalance] =
		useState<BigNumber>(Zero);
	const [xDaiTokenBalance, setXDaiTokenBalance] =
		useState<BigNumber>(Zero);

	const [tokenDistroBalance, setTokenDistroBalance] =
		useState<ITokenDistroBalance>(initialTokenDistroBalance);
	const [mainnetTokenDistroBalance, setMainnetTokenDistroBalance] =
		useState<ITokenDistroBalance>(initialTokenDistroBalance);
	const [xDaiTokenDistroBalance, setXDaiTokenDistroBalance] =
		useState<ITokenDistroBalance>(initialTokenDistroBalance);

	const [newMainnetTokenBalance, setNewMainnetTokenBalance] =
		useState<BigNumber>(Zero);
	const [newXDaiTokenBalance, setNewXDaiTokenBalance] =
		useState<BigNumber>(Zero);

	useEffect(() => {
		if (!newMainnetTokenBalance.eq(mainnetTokenBalance))
			setMainnetTokenBalance(newMainnetTokenBalance);
	}, [newMainnetTokenBalance]);

	useEffect(() => {
		if (!newXDaiTokenBalance.eq(xDaiTokenBalance))
			setXDaiTokenBalance(newXDaiTokenBalance);
	}, [newXDaiTokenBalance]);

	useEffect(() => {
		switch (network) {
			case config.MAINNET_NETWORK_NUMBER:
				setTokenBalance(mainnetTokenBalance);
				break;

			case config.XDAI_NETWORK_NUMBER:
				setTokenBalance(xDaiTokenBalance);
				break;

			default:
		}
	}, [mainnetTokenBalance, xDaiTokenBalance, network]);

	useEffect(() => {
		switch (network) {
			case config.MAINNET_NETWORK_NUMBER:
				setTokenDistroBalance(mainnetTokenDistroBalance);
				break;

			case config.XDAI_NETWORK_NUMBER:
				setTokenDistroBalance(xDaiTokenDistroBalance);
				break;

			default:
		}
	}, [mainnetTokenDistroBalance, xDaiTokenDistroBalance, network]);

	useEffect(() => {
		const getTokenContract = (_network: number) => {
			const networkConfig = config.NETWORKS_CONFIG[_network];
			return getERC20Contract(
				networkConfig?.TOKEN_ADDRESS,
				_network,
				_network === network ? provider : null,
			);
		};

		const fetchTokenBalance = async () => {
			const mainnetTokenContract = getTokenContract(
				config.MAINNET_NETWORK_NUMBER,
			);

			if (!mainnetTokenContract) {
				console.error('No mainnet token contract found!');
				return;
			}

			const xDaiTokenContract = getTokenContract(
				config.XDAI_NETWORK_NUMBER,
			);

			if (!xDaiTokenContract) {
				console.error('No xDai token contract found!');
				return;
			}

			const safeNetworkCall = async <T extends unknown>(
				promise: Promise<T>,
				defaultValue: T,
			): Promise<T> => {
				try {
					return await promise;
				} catch (e) {
					console.error(e);
				}
				return defaultValue;
			};

			const defaultTokenDistroResult: ITokenDistroBalance = {
				claimable: Zero,
				locked: Zero,
			};
			try {
				const [
					_newMainnetBalance,
					_newXDaiBalance,
					_mainnetTokenDistro,
					_xDaiTokenDistro,
				] = await Promise.all([
					// safeNetworkCall(
					// 	mainnetTokenContract.balanceOf(address),
					// 	Zero,
					// ),
					fetchBalance(config.MAINNET_NETWORK_NUMBER, address),
					// safeNetworkCall(xDaiTokenContract.balanceOf(address), Zero),
					fetchBalance(config.XDAI_NETWORK_NUMBER, address),
					safeNetworkCall(
						getTokenDistroAmounts(
							address,
							config.MAINNET_CONFIG.TOKEN_DISTRO_ADDRESS,
							config.MAINNET_NETWORK_NUMBER,
							network === config.MAINNET_NETWORK_NUMBER
								? provider
								: null,
						),
						defaultTokenDistroResult,
					),
					safeNetworkCall(
						getTokenDistroAmounts(
							address,
							config.XDAI_CONFIG.TOKEN_DISTRO_ADDRESS,
							config.XDAI_NETWORK_NUMBER,
							network === config.XDAI_NETWORK_NUMBER
								? provider
								: null,
						),
						defaultTokenDistroResult,
					),
				]);

				setNewMainnetTokenBalance(_newMainnetBalance);
				setNewXDaiTokenBalance(_newXDaiBalance);

				setMainnetTokenDistroBalance(_mainnetTokenDistro);
				setXDaiTokenDistroBalance(_xDaiTokenDistro);
			} catch (e) {
				console.error(
					'Error in fetching token and streaming balances',
					e,
				);
			}
		};

		if (isAddress(address)) {
			setTokenBalance(Zero);
			setNewMainnetTokenBalance(Zero);
			setNewXDaiTokenBalance(Zero);

			setTokenDistroBalance(initialTokenDistroBalance);
			setMainnetTokenDistroBalance(initialTokenDistroBalance);
			setXDaiTokenDistroBalance(initialTokenDistroBalance);

			fetchTokenBalance();

			const interval = setInterval(
				fetchTokenBalance,
				config.POLLING_INTERVAL,
			);
			return () => {
				clearInterval(interval);
			};
		}
	}, [address, network, provider]);

	return (
		<TokenBalanceContext.Provider
			value={{
				tokenBalance,
				mainnetTokenBalance,
				xDaiTokenBalance,
				tokenDistroBalance,
				mainnetTokenDistroBalance,
				xDaiTokenDistroBalance,
			}}
		>
			{children}
		</TokenBalanceContext.Provider>
	);
};

export function useTokenBalance() {
	const context = useContext(TokenBalanceContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
