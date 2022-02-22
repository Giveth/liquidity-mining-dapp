import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconFox: FC<ICurrencyIconProps> = () => {
	return (
		<Image
			src={`/images/currencies/fox/${64}.svg`}
			alt='balancer'
			width={64}
			height={64}
			loading='lazy'
		/>
	);
};
