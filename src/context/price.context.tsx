import { createContext, FC, useContext, useEffect, useState } from 'react';
import { OnboardContext } from '@/context/onboard.context';
import BigNumber from 'bignumber.js';
import { Zero } from '@/helpers/number';
import { useSubgraph } from '@/context/subgraph.context';
import config from '@/configuration';

export interface IPriceContext {
	price: BigNumber;
}

const priceDefaultValue = {
	price: Zero,
};

const PriceContext = createContext<IPriceContext>(priceDefaultValue);
export const PriceProvider: FC = ({ children }) => {
	const { network } = useContext(OnboardContext);
	const { mainnetValues, xDaiValues } = useSubgraph();

	const [currentPrice, setCurrentPrice] = useState<BigNumber>(Zero);
	const [mainnetPrice, setMainnetPrice] = useState<BigNumber>(Zero);
	const [xDaiPrice, setXDaiPrice] = useState<BigNumber>(Zero);
	const [ethPrice, setEthPrice] = useState<BigNumber>(Zero);

	useEffect(() => {
		const { uniswapV2EthGivPair } = xDaiValues;
		if (uniswapV2EthGivPair) {
			const { token0, token1, reserve0, reserve1 } = uniswapV2EthGivPair;
			const { TOKEN_ADDRESS } = config.XDAI_CONFIG;

			switch (TOKEN_ADDRESS.toLowerCase()) {
				case token0.toLowerCase():
					setXDaiPrice(
						ethPrice
							.times(reserve1.toString())
							.div(reserve0.toString()),
					);
					break;
				case token1.toLowerCase():
					setXDaiPrice(
						ethPrice
							.times(reserve0.toString())
							.div(reserve1.toString()),
					);
					break;
				default:
					console.error(
						'Non of UniswapV2Pair tokens is GIV, ',
						uniswapV2EthGivPair,
					);
			}
		}
	}, [xDaiValues, ethPrice]);

	useEffect(() => {}, [mainnetValues, ethPrice]);

	useEffect(() => {
		fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
			.then(async res => {
				const date = await res.json();
				setEthPrice(new BigNumber(date.USD));
			})
			.catch(error => {
				console.error(
					'Error on getting eth price from crypto=compare:',
					error,
				);
			});
	}, []);

	useEffect(() => {
		switch (network) {
			case config.XDAI_NETWORK_NUMBER:
				setCurrentPrice(xDaiPrice);
				console.log('xdai price:', xDaiPrice.toFixed());
				break;

			case config.MAINNET_NETWORK_NUMBER:
			default:
				setCurrentPrice(mainnetPrice);
				console.log('mainnet price:', mainnetPrice.toFixed());
				break;
		}
	}, [network, xDaiPrice, mainnetPrice]);

	useEffect(() => {});
	return (
		<PriceContext.Provider
			value={{
				price: currentPrice,
			}}
		>
			{children}
		</PriceContext.Provider>
	);
};

export function usePrice() {
	const context = useContext(PriceContext);

	if (!context) {
		throw new Error('Price balance context not found!');
	}

	return context;
}
