import { createContext, FC, useContext, useEffect, useState } from 'react';
import config from '@/configuration';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { Zero } from '@ethersproject/constants';
import { useSubgraph } from '@/context/subgraph.context';
import { useWeb3React } from '@web3-react/core';
import { StreamType } from '@/types/config';

export interface IRegenTokenDistroHelpers {
	[key: string]: TokenDistroHelper;
}
export interface ITokenDistroContext {
	tokenDistroHelper: TokenDistroHelper;
	regenTokenDistroHelpers: IRegenTokenDistroHelpers;
}

const defaultTokenDistroHelper = new TokenDistroHelper({
	initialAmount: Zero,
	lockedAmount: Zero,
	totalTokens: Zero,
	startTime: new Date(),
	cliffTime: new Date(),
	endTime: new Date(),
});

export const BalanceContext = createContext<ITokenDistroContext>({
	tokenDistroHelper: defaultTokenDistroHelper,
	regenTokenDistroHelpers: {},
});

export const TokenDistroProvider: FC = ({ children }) => {
	const { chainId } = useWeb3React();

	const { mainnetValues, xDaiValues } = useSubgraph();

	const [currentTokenDistroInfo, setCurrentTokenDistroInfo] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [mainnetTokenDistro, setMainnetTokenDistro] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [xDaiTokenDistro, setXDaiTokenDistro] = useState<TokenDistroHelper>(
		defaultTokenDistroHelper,
	);

	const [currentRegenTokenDistroHelpers, setCurrentRegenTokenDistroHelpers] =
		useState<IRegenTokenDistroHelpers>({});
	const [mainnetRegenTokenHelpers, setMainnetRegenTokenHelpers] =
		useState<IRegenTokenDistroHelpers>({});
	const [xDaiRegenTokenDistroHelpers, setXDaiRegenTokenDistroHelpers] =
		useState<IRegenTokenDistroHelpers>({});

	useEffect(() => {
		if (mainnetValues?.tokenDistroInfo)
			setMainnetTokenDistro(
				new TokenDistroHelper(mainnetValues.tokenDistroInfo),
			);
		let newRegenTokenDistroHelpers: IRegenTokenDistroHelpers = {};
		config.MAINNET_CONFIG.regenStreams.forEach(({ type }) => {
			const tokenDistroInfo = mainnetValues[type];
			if (tokenDistroInfo) {
				newRegenTokenDistroHelpers[type] = new TokenDistroHelper(
					tokenDistroInfo,
				);
			}
		});
		setMainnetRegenTokenHelpers(newRegenTokenDistroHelpers);
	}, [mainnetValues]);

	useEffect(() => {
		if (xDaiValues.tokenDistroInfo)
			setXDaiTokenDistro(
				new TokenDistroHelper(xDaiValues.tokenDistroInfo),
			);
		let newRegenTokenDistroHelpers: IRegenTokenDistroHelpers = {};
		config.XDAI_CONFIG.regenStreams.forEach(({ type }) => {
			const tokenDistroInfo = xDaiValues[type];
			console.log('type:', type);
			console.log('tokenDistroInfo:', xDaiValues);
			if (tokenDistroInfo) {
				newRegenTokenDistroHelpers[type] = new TokenDistroHelper(
					tokenDistroInfo,
				);
			}
		});
		setXDaiRegenTokenDistroHelpers(newRegenTokenDistroHelpers);
	}, [xDaiValues]);

	useEffect(() => {
		switch (chainId) {
			case config.XDAI_NETWORK_NUMBER:
				setCurrentTokenDistroInfo(xDaiTokenDistro);
				setCurrentRegenTokenDistroHelpers(xDaiRegenTokenDistroHelpers);
				break;

			case config.MAINNET_NETWORK_NUMBER:
			default:
				setCurrentTokenDistroInfo(mainnetTokenDistro);
				setCurrentRegenTokenDistroHelpers(mainnetRegenTokenHelpers);
		}
	}, [
		mainnetTokenDistro,
		xDaiTokenDistro,
		chainId,
		xDaiRegenTokenDistroHelpers,
		mainnetRegenTokenHelpers,
	]);

	return (
		<BalanceContext.Provider
			value={{
				tokenDistroHelper: currentTokenDistroInfo,
				regenTokenDistroHelpers: currentRegenTokenDistroHelpers,
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
