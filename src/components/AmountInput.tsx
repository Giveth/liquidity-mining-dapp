import { GLink, neutralColors, brandColors } from '@giveth/ui-design-system';
import { ethers } from 'ethers';
import { FC, useState, useCallback, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import config from '../configuration';
import { formatEthHelper, formatWeiHelper } from '../helpers/number';
import { PoolStakingConfig } from '../types/config';
import { Row } from './styled-components/Grid';

interface IAmountInput {
	maxAmount: ethers.BigNumber;
	setAmount: Dispatch<SetStateAction<string>>;
	poolStakingConfig: PoolStakingConfig;
}

export const AmountInput: FC<IAmountInput> = ({
	maxAmount,
	setAmount,
	poolStakingConfig,
}) => {
	const [displayAmount, setDisplayAmount] = useState('0');

	const setAmountPercentage = useCallback(
		(percentage: number): void => {
			const newAmount = ethers.BigNumber.from(maxAmount)
				.mul(percentage)
				.div(100)
				.toString();
			setAmount(newAmount);
			setDisplayAmount(formatWeiHelper(newAmount, 6, false));
		},
		[maxAmount],
	);

	const onChange = useCallback(value => {
		setDisplayAmount(formatEthHelper(value, 6, false));
		setAmount(ethers.utils.parseUnits('' + value).toString());
	}, []);

	return (
		<>
			<InputLabelRow justifyContent='space-between'>
				<InputLabel>
					<InputLabelText>Available: </InputLabelText>
					<InputLabelValue>
						&nbsp;
						{formatWeiHelper(maxAmount, config.TOKEN_PRECISION)}
						&nbsp;
						{poolStakingConfig.title}
						&nbsp;LP
					</InputLabelValue>
				</InputLabel>
				<InputLabelAction
					onClick={() => {
						setAmountPercentage(100);
					}}
				>
					Max
				</InputLabelAction>
			</InputLabelRow>
			<Input
				value={displayAmount}
				type='number'
				onChange={e => onChange(+e.target.value || '0')}
			/>
			<FiltersRow>
				<Filter
					onClick={() => {
						setAmountPercentage(25);
					}}
				>
					25%
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(50);
					}}
				>
					50%
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(75);
					}}
				>
					75%
				</Filter>
				<Filter
					onClick={() => {
						setAmountPercentage(100);
					}}
				>
					100%
				</Filter>
			</FiltersRow>
		</>
	);
};

const InputLabelRow = styled(Row)``;
const InputLabel = styled(GLink)`
	display: flex;
`;
const InputLabelText = styled.div`
	color: ${neutralColors.gray[100]};
`;
const InputLabelValue = styled.div``;
const InputLabelAction = styled(GLink)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
`;

export const Input = styled.input`
	width: 100%;
	height: 54px;
	padding: 15px 16px;
	margin-top: 10px;
	margin-bottom: 8px;

	background: ${brandColors.giv[700]};
	color: ${neutralColors.gray[100]};

	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;

	font-family: Red Hat Text;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 150%;

	&:focus {
		outline: none;
	}
	&[type='number'] {
		-moz-appearance: textfield;
	}
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

const FiltersRow = styled(Row)`
	gap: 8px;
`;

const Filter = styled(GLink)`
	padding: 8px 16px;
	color: ${brandColors.deep[100]};
	background: ${brandColors.giv[700]};
	border-radius: 54px;
	cursor: pointer;
`;
