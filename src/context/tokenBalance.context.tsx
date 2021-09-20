import { createContext, FC, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
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

	const [newMainnetTokenBalance, setNewMainnetTokenBalance] =
		useState<ethers.BigNumber>(Zero);
	const [newXDaiTokenBalance, setNewXDaiTokenBalance] =
		useState<ethers.BigNumber>(Zero);

	useEffect(() => {
		if (newMainnetTokenBalance.eq(mainnetTokenBalance)) return;
		setMainnetTokenBalance(newMainnetTokenBalance);
	}, [newMainnetTokenBalance]);

	useEffect(() => {
		if (newXDaiTokenBalance.eq(xDaiTokenBalance)) return;
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

	const getTokenContract = (network: number) => {
		const networkConfig = config.NETWORKS_CONFIG[network];

		if (!networkConfig) {
			return null;
		}

		return getERC20Contract(networkConfig.TOKEN_ADDRESS, network);
	};

	useEffect(() => {
		const fetchTokenBalance = (): void => {
			const mainnetTokenContract = getTokenContract(
				config.MAINNET_NETWORK_NUMBER,
			);
			if (mainnetTokenContract) {
				mainnetTokenContract
					.balanceOf(address)
					.then((newBalance: ethers.BigNumber) => {
						setNewMainnetTokenBalance(newBalance);
					})
					.catch((e: Error) => {
						console.error(
							'Error on fetching user mainnet token balance:',
							e,
						);
					});
			} else {
				console.log('mainnet contract is not ready');
			}

			const xDaiTokenContract = getTokenContract(
				config.XDAI_NETWORK_NUMBER,
			);
			if (xDaiTokenContract) {
				xDaiTokenContract
					.balanceOf(address)
					.then((newBalance: ethers.BigNumber) => {
						setNewXDaiTokenBalance(newBalance);
					})
					.catch((e: Error) => {
						console.error(
							'Error on fetching user xDai token balance:',
							e,
						);
					});
			} else {
				console.log('xdai contract is not ready');
			}
		};

		if (isAddress(address)) {
			console.log('address is changed');
			setTokenBalance(Zero);
			setNewMainnetTokenBalance(Zero);
			setNewXDaiTokenBalance(Zero);

			fetchTokenBalance();

			const interval = setInterval(
				fetchTokenBalance,
				config.POLLING_INTERVAL,
			);
			return () => {
				clearInterval(interval);
			};
		}
	}, [address]);

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
