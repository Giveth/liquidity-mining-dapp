import { createContext, FC, useContext, useEffect, useState } from 'react';
import { getTokenDistroInfo } from '@/services/subgraph';
import { OnboardContext } from '@/context/onboard.context';
import config from '@/configuration';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { Zero } from '@ethersproject/constants';

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
	duration: 0,
	progress: 0,
	remain: 0,
	percent: 0,
});

export const BalanceContext = createContext<ITokenDistroContext>({
	tokenDistroHelper: defaultTokenDistroHelper,
	mainnetTokenDistro: defaultTokenDistroHelper,
	xDaiTokenDistro: defaultTokenDistroHelper,
});

export const TokenDistroProvider: FC = ({ children }) => {
	const { address, network, provider } = useContext(OnboardContext);

	const [currentTokenDistroInfo, setCurrentTokenDistroInfo] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [mainnetTokenDistro, setMainnetTokenDistro] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [xDaiTokenDistro, setXDaiTokenDistro] = useState<TokenDistroHelper>(
		defaultTokenDistroHelper,
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
		getTokenDistroInfo(config.MAINNET_NETWORK_NUMBER).then(
			_tokenDistroInfo => {
				if (_tokenDistroInfo)
					setMainnetTokenDistro(
						new TokenDistroHelper(_tokenDistroInfo),
					);
			},
		);
		getTokenDistroInfo(config.XDAI_NETWORK_NUMBER).then(
			_tokenDistroInfo => {
				if (_tokenDistroInfo)
					setXDaiTokenDistro(new TokenDistroHelper(_tokenDistroInfo));
			},
		);
	}, []);

	useEffect(() => {
		const fetchTokenDistroInfo = async () => {
			try {
				const _tokenDistroInfo = await getTokenDistroInfo(network);
				if (_tokenDistroInfo) {
					if (network === config.MAINNET_NETWORK_NUMBER)
						setMainnetTokenDistro(
							new TokenDistroHelper(_tokenDistroInfo),
						);
					else
						setXDaiTokenDistro(
							new TokenDistroHelper(_tokenDistroInfo),
						);
				}
			} catch (e) {
				console.error(
					'Error in fetching token and streaming balances',
					e,
				);
			}
		};

		const interval = setInterval(
			fetchTokenDistroInfo,
			120000, // Every two minutes
		);
		return () => {
			clearInterval(interval);
		};
	}, [network]);

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
