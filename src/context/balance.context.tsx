import { createContext, FC, useContext, useEffect, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import { fetchBalances, IBalances, zeroBalances } from '@/services/subgraph';
import { OnboardContext } from '@/context/onboard.context';
import config from '@/configuration';

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
		if (network === config.XDAI_NETWORK_NUMBER) {
			setCurrentBalance(xDaiBalance);
		} else {
			setCurrentBalance(mainnetBalance);
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
