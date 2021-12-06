import { createContext, FC, useContext, useEffect, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import {
	fetchBalances,
	getTokenDistroInfo,
	IBalances,
	zeroBalances,
} from '@/services/subgraph';
import { OnboardContext } from '@/context/onboard.context';
import config from '@/configuration';
import { TokenDistroMock } from '@/lib/contractMock/TokenDistroMock';
import { Zero } from '@ethersproject/constants';

export interface ITokenDistroContext {
	tokenDistroMock: TokenDistroMock;
	mainnetTokenDistro: TokenDistroMock;
	xDaiTokenDistro: TokenDistroMock;
}

const defaultTokenDistroMock = new TokenDistroMock({
	initialAmount: Zero,
	lockedAmount: Zero,
	totalTokens: Zero,
	startTime: new Date(),
	cliffTime: new Date(),
	endTime: new Date(),
	duration: 0,
	progress: 0,
	remain: 0,
	percent: 0,
});

export const BalanceContext = createContext<ITokenDistroContext>({
	tokenDistroMock: defaultTokenDistroMock,
	mainnetTokenDistro: defaultTokenDistroMock,
	xDaiTokenDistro: defaultTokenDistroMock,
});

export const TokenDistroProvider: FC = ({ children }) => {
	const { address, network, provider } = useContext(OnboardContext);

	const [currentTokenDistroInfo, setCurrentTokenDistroInfo] =
		useState<TokenDistroMock>(defaultTokenDistroMock);
	const [mainnetTokenDistro, setMainnetTokenDistro] =
		useState<TokenDistroMock>(defaultTokenDistroMock);
	const [xDaiTokenDistro, setXDaiTokenDistro] = useState<TokenDistroMock>(
		defaultTokenDistroMock,
	);

	useEffect(() => {
		switch (network) {
			case config.MAINNET_NETWORK_NUMBER:
				setCurrentTokenDistroInfo(mainnetTokenDistro);
				break;

			case config.XDAI_NETWORK_NUMBER:
				setCurrentTokenDistroInfo(xDaiTokenDistro);
				break;

			default:
		}
	}, [mainnetTokenDistro, xDaiTokenDistro, network]);

	useEffect(() => {
		const fetchTokenDistroInfo = async () => {
			try {
				const [_mainnetTokenDistro, _xDaiTokenDistro] =
					await Promise.all([
						getTokenDistroInfo(config.MAINNET_NETWORK_NUMBER),
						getTokenDistroInfo(config.XDAI_NETWORK_NUMBER),
					]);

				if (_mainnetTokenDistro)
					setMainnetTokenDistro(
						new TokenDistroMock(_mainnetTokenDistro),
					);
				if (_xDaiTokenDistro)
					setXDaiTokenDistro(new TokenDistroMock(_xDaiTokenDistro));
			} catch (e) {
				console.error(
					'Error in fetching token and streaming balances',
					e,
				);
			}
		};

		fetchTokenDistroInfo();
		const interval = setInterval(
			fetchTokenDistroInfo,
			config.POLLING_INTERVAL,
		);
		return () => {
			clearInterval(interval);
		};
	}, [address, network, provider]);

	return (
		<BalanceContext.Provider
			value={{
				tokenDistroMock: currentTokenDistroInfo,
				mainnetTokenDistro,
				xDaiTokenDistro,
			}}
		>
			{children}
		</BalanceContext.Provider>
	);
};

export function useTokenDistro() {
	const context = useContext(BalanceContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
