import { createContext, FC, useContext, useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { Zero } from '@ethersproject/constants';
import { OnboardContext } from './onboard.context';
import config from '../configuration';
import { isAddress } from 'ethers/lib/utils';
import { getERC20Contract } from '../lib/claim';

export interface ITokenBalanceContext {
	tokenBalance: ethers.BigNumber;
	mainnetTokenBalance: ethers.BigNumber;
	xDaiTokenBalance: ethers.BigNumber;
}

const initialValue = {
	tokenBalance: Zero,
	mainnetTokenBalance: Zero,
	xDaiTokenBalance: Zero,
};
export const TokenBalanceContext =
	createContext<ITokenBalanceContext>(initialValue);

export const TokenBalanceProvider: FC = ({ children }) => {
	const { address, network } = useContext(OnboardContext);
	const [tokenBalance, setTokenBalance] = useState<ethers.BigNumber>(Zero);
	const [mainnetTokenBalance, setMainnetTokenBalance] =
		useState<ethers.BigNumber>(Zero);
	const [xDaiTokenBalance, setXDaiTokenBalance] =
		useState<ethers.BigNumber>(Zero);

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
		const getTokenContract = (network: number) => {
			const networkConfig = config.NETWORKS_CONFIG[network];

			if (!networkConfig) {
				return null;
			}

			return getERC20Contract(networkConfig.TOKEN_ADDRESS, network);
		};

		const fetchTokenBalance = (): void => {
			const mainnetTokenContract = getTokenContract(
				config.MAINNET_NETWORK_NUMBER,
			);
			if (mainnetTokenContract) {
				mainnetTokenContract
					.balanceOf(address)
					.then(setMainnetTokenBalance)
					.catch((e: Error) =>
						console.error(
							'Error on fetching user mainnet token balance:',
							e,
						),
					);
			} else {
				console.log('mainnet contract is not ready');
			}

			const xDaiTokenContract = getTokenContract(
				config.XDAI_NETWORK_NUMBER,
			);
			if (xDaiTokenContract) {
				xDaiTokenContract
					.balanceOf(address)
					.then(setXDaiTokenBalance)
					.catch((e: Error) =>
						console.error(
							'Error on fetching user xDai token balance:',
							e,
						),
					);
			} else {
				console.log('xdai contract is not ready');
			}
		};

		if (isAddress(address)) {
			setTokenBalance(Zero);
			setMainnetTokenBalance(Zero);
			setXDaiTokenBalance(Zero);

			fetchTokenBalance();

			const interval = setInterval(
				fetchTokenBalance,
				config.POLLING_INTERVAL,
			);
			return () => {
				clearInterval(interval);
			};
		}
	}, [address, network]);

	return (
		<TokenBalanceContext.Provider
			value={{
				tokenBalance,
				mainnetTokenBalance,
				xDaiTokenBalance,
			}}
		>
			{children}
		</TokenBalanceContext.Provider>
	);
};
