import { createContext, FC, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Zero } from '@ethersproject/constants';
import { OnboardContext } from './onboard.context';
import config from '../configuration';
import { isAddress } from 'ethers/lib/utils';
import { getERC20Contract, getTokenDistroAmounts } from '../lib/claim';
import { ITokenDistroBalance } from '../types/GIV';

export interface ITokenBalanceContext {
	tokenBalance: ethers.BigNumber;
	tokenDistroBalance: ITokenDistroBalance;

	mainnetTokenBalance: ethers.BigNumber;
	xDaiTokenBalance: ethers.BigNumber;

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
	const { address, network } = useContext(OnboardContext);
	const [tokenBalance, setTokenBalance] = useState<ethers.BigNumber>(Zero);
	const [mainnetTokenBalance, setMainnetTokenBalance] =
		useState<ethers.BigNumber>(Zero);
	const [xDaiTokenBalance, setXDaiTokenBalance] =
		useState<ethers.BigNumber>(Zero);

	const [tokenDistroBalance, setTokenDistroBalance] =
		useState<ITokenDistroBalance>(initialTokenDistroBalance);
	const [mainnetTokenDistroBalance, setMainnetTokenDistroBalance] =
		useState<ITokenDistroBalance>(initialTokenDistroBalance);
	const [xDaiTokenDistroBalance, setXDaiTokenDistroBalance] =
		useState<ITokenDistroBalance>(initialTokenDistroBalance);

	const [newMainnetTokenBalance, setNewMainnetTokenBalance] =
		useState<ethers.BigNumber>(Zero);
	const [newXDaiTokenBalance, setNewXDaiTokenBalance] =
		useState<ethers.BigNumber>(Zero);

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

	const getTokenContract = (network: number) => {
		const networkConfig = config.NETWORKS_CONFIG[network];
		return getERC20Contract(networkConfig?.TOKEN_ADDRESS, network);
	};

	useEffect(() => {
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

			console.log('before!!!!!');

			try {
				const [
					_newMainnetBalance,
					_newXDaiBalance,
					_mainnetTokenDistro,
					_xDaiTokenDistro,
				] = await Promise.all([
					mainnetTokenContract.balanceOf(address),
					xDaiTokenContract.balanceOf(address),
					getTokenDistroAmounts(
						address,
						config.MAINNET_CONFIG.TOKEN_DISTRO_ADDRESS,
						config.MAINNET_NETWORK_NUMBER,
					),
					getTokenDistroAmounts(
						address,
						config.XDAI_CONFIG.TOKEN_DISTRO_ADDRESS,
						config.XDAI_NETWORK_NUMBER,
					),
				]);

				console.log(
					'all',
					_newMainnetBalance,
					_newXDaiBalance,
					_mainnetTokenDistro,
					_xDaiTokenDistro,
				);

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
	}, [address]);

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
