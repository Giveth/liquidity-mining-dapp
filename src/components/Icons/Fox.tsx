import React, { FC } from 'react';
import Image from 'next/image';
import { ICurrencyIconProps } from './type';

export const IconFox: FC<ICurrencyIconProps> = ({ size = 16 }) => {
	return (
		<Image
			src={`/images/currencies/fox/${size}.svg`}
			alt='balancer'
			width={64}
			height={64}
			loading='lazy'
		/>
	);
};
