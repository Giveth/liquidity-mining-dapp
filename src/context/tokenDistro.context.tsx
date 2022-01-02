import { createContext, FC, useContext, useEffect, useState } from 'react';
import { OnboardContext } from '@/context/onboard.context';
import config from '@/configuration';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { Zero } from '@ethersproject/constants';
import { useSubgraph } from '@/context/subgraph.context';

export interface ITokenDistroContext {
	tokenDistroHelper: TokenDistroHelper;
	mainnetTokenDistro: TokenDistroHelper;
	xDaiTokenDistro: TokenDistroHelper;
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
	mainnetTokenDistro: defaultTokenDistroHelper,
	xDaiTokenDistro: defaultTokenDistroHelper,
});

export const TokenDistroProvider: FC = ({ children }) => {
	const { address, network, provider } = useContext(OnboardContext);

	const { mainnetValues, xDaiValues } = useSubgraph();

	const [currentTokenDistroInfo, setCurrentTokenDistroInfo] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [mainnetTokenDistro, setMainnetTokenDistro] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [xDaiTokenDistro, setXDaiTokenDistro] = useState<TokenDistroHelper>(
		defaultTokenDistroHelper,
	);

	useEffect(() => {
		if (mainnetValues?.tokenDistroInfo)
			setMainnetTokenDistro(
				new TokenDistroHelper(mainnetValues.tokenDistroInfo),
			);
	}, [mainnetValues]);

	useEffect(() => {
		if (xDaiValues.tokenDistroInfo)
			setXDaiTokenDistro(
				new TokenDistroHelper(xDaiValues.tokenDistroInfo),
			);
	}, [xDaiValues]);

	useEffect(() => {
		switch (network) {
			case config.MAINNET_NETWORK_NUMBER:
				setCurrentTokenDistroInfo(mainnetTokenDistro);
				break;

			case config.XDAI_NETWORK_NUMBER:
				setCurrentTokenDistroInfo(xDaiTokenDistro);
				break;

			default:
				setCurrentTokenDistroInfo(mainnetTokenDistro);
		}
	}, [mainnetTokenDistro, xDaiTokenDistro, network]);

	return (
		<BalanceContext.Provider
			value={{
				tokenDistroHelper: currentTokenDistroInfo,
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
