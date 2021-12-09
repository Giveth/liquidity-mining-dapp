// Shamelessly copied from Sushiswap front-end
import React from 'react';
import styled from 'styled-components';
import { neutralColors, brandColors } from '@giveth/ui-design-system';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const Input = React.memo(
	({
		value,
		onUserInput,
		placeholder,
		...rest
	}: {
		value: string;
		onUserInput: (input: string) => void;
		error?: boolean;
		fontSize?: string;
		align?: 'right' | 'left';
	} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
		const enforcer = (nextUserInput: string) => {
			if (
				nextUserInput === '' ||
				inputRegex.test(escapeRegExp(nextUserInput))
			) {
				onUserInput(nextUserInput);
			}
		};

		return (
			<StyledInput
				{...rest}
				value={value}
				onChange={event => {
					// replace commas with periods, because uniswap exclusively uses period as the decimal separator
					enforcer(event.target.value.replace(/,/g, '.'));
				}}
				// universal input options
				inputMode='decimal'
				title='Token Amount'
				autoComplete='off'
				autoCorrect='off'
				// text-specific options
				type='text'
				pattern='^[0-9]*[.,]?[0-9]*$'
				placeholder={placeholder || '0.0'}
				min={0}
				minLength={1}
				maxLength={79}
				spellCheck='false'
			/>
		);
	},
);

export const StyledInput = styled.input`
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
	${props => (props.disabled ? `color: ${brandColors.giv[300]};` : '')}
`;

Input.displayName = 'NumericalInput';

export default Input;
