import {
	brandColors,
	IconGiveth,
	IconETH,
	IconHoney,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

interface IStakingPoolImagesProps {
	title: string;
}

const getCurIconWithName = (currency: string) => {
	switch (currency) {
		case 'GIV':
			return <IconGiveth size={40} />;
		case 'ETH':
			return <IconETH size={40} />;
		case 'HNY':
			return <IconHoney size={40} />;
		default:
			break;
	}
};

export const StakingPoolImages: FC<IStakingPoolImagesProps> = ({ title }) => {
	const currencies = title.split(' / ');

	return (
		<StakingPoolImagesContainer lenght={currencies.length}>
			{currencies.map((currency, idx) => (
				<div key={idx}>{getCurIconWithName(currency)}</div>
			))}
		</StakingPoolImagesContainer>
	);
};

interface IStakingPoolImagesContainerProps {
	lenght: number;
}

const StakingPoolImagesContainer = styled.div<IStakingPoolImagesContainerProps>`
	padding-left: 27px;
	padding-right: 31px;
	height: 56px;
	width: ${props => (props.lenght == 1 ? 72 : 105)}px;
	background: ${brandColors.giv[700]};
	position: relative;
	border-radius: 0 28px 28px 0;
	& > div {
		position: absolute;
		right: 38px;
		top: 8px;
		z-index: 1;
		:last-child {
			z-index: 0;
			right: 7px;
		}
	}
`;