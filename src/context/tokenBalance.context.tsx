import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
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

	// const [_mainnetTokenBalance, _setMainnetTokenBalance] =
	// 	useState<ethers.BigNumber>(Zero);
	// const [_xDaiTokenBalance, _setXDaiTokenBalance] =
	// 	useState<ethers.BigNumber>(Zero);

	useEffect(() => {
		console.log(
			'on update mainnetTOkenBalance:',
			mainnetTokenBalance.toString(),
		);
	}, [mainnetTokenBalance]);
	useEffect(() => {
		console.log('on update xdaiTokenBalance:', xDaiTokenBalance.toString());
	}, [xDaiTokenBalance]);

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

	const fetchTokenBalance = async (): Promise<void> => {
		const mainnetTokenContract = getTokenContract(
			config.MAINNET_NETWORK_NUMBER,
		);
		if (mainnetTokenContract) {
			try {
				console.log(
					'mainnetTokenBalance:',
					mainnetTokenBalance.toString(),
				);
				const newBalance = await mainnetTokenContract.balanceOf(
					address,
				);
				if (!mainnetTokenBalance.eq(newBalance)) {
					console.log(
						'mainnet token balance updated ',
						new Date(),
						mainnetTokenBalance.toString(),
						newBalance.toString(),
						mainnetTokenBalance.sub(newBalance).toString(),
					);
					setMainnetTokenBalance(newBalance);
				}
			} catch (e) {
				console.error(
					'Error on fetching user mainnet token balance:',
					e,
				);
			}
		} else {
			console.log('mainnet contract is not ready');
		}

		const xDaiTokenContract = getTokenContract(config.XDAI_NETWORK_NUMBER);
		if (xDaiTokenContract) {
			try {
				console.log('xdaiBalance:', xDaiTokenBalance.toString());
				const newBalance = await xDaiTokenContract.balanceOf(address);
				if (!xDaiTokenBalance.eq(newBalance)) {
					console.log(
						'xdai token balance updated ',
						new Date(),
						xDaiTokenBalance.toString(),
						newBalance.toString(),
						xDaiTokenBalance.sub(newBalance).toString(),
					);
					setXDaiTokenBalance(newBalance);
				}
			} catch (e) {
				console.error('Error on fetching user xDai token balance:', e);
			}
		} else {
			console.log('xdai contract is not ready');
		}
	};

	useEffect(() => {
		if (isAddress(address)) {
			console.log('address is changed');
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
