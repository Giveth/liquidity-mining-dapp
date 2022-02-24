import { formatWeiHelper } from '@/helpers/number';
import { ethers } from 'ethers';
import { FC } from 'react';
import {
	AmountBoxWithPriceContainer,
	AmountBoxWithPriceIcon,
	AmountBoxWithPriceAmount,
	AmountBoxWithPriceUSD,
} from './AmountBoxWithPrice.sc';
import { IconGIV } from '@/components/Icons/GIV';
import { IconFox } from '@/components/Icons/Fox';

interface IGIVBoxWithPriceProps {
	amount: ethers.BigNumber;
	price?: string;
	tokenSymbol?: string;
}

const getTokenIconBySymbol = (tokenSymbol: string) => {
	switch (tokenSymbol) {
		case 'FOX':
			return <IconFox size={40} />;
		case 'GIV':
		default:
			return <IconGIV size={40} />;
	}
};

export const AmountBoxWithPrice: FC<IGIVBoxWithPriceProps> = ({
	amount,
	price,
	tokenSymbol = 'GIV',
}) => {
	return (
		<>
			<AmountBoxWithPriceContainer alignItems='center'>
				{getTokenIconBySymbol(tokenSymbol)}
				<AmountBoxWithPriceAmount>
					{formatWeiHelper(amount)}
				</AmountBoxWithPriceAmount>
				<AmountBoxWithPriceUSD>~${price}</AmountBoxWithPriceUSD>
			</AmountBoxWithPriceContainer>
		</>
	);
};
