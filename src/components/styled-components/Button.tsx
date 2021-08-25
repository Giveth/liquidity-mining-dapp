import styled from 'styled-components'

interface IButtonProps {
	secondary?: boolean
}

export const Button = styled.button<IButtonProps>`
	padding: 25px 32px;
	background: ${props => (props.secondary ? '#E1458D' : '#5326EC')};
	height: 64px;
	border: 0;
	border-radius: 88px;
	color: #ffffff;
	width: 100%;
	font-style: normal;
	font-weight: bold;
	font-size: 16px;
	line-height: 18px;
	text-align: center;
	cursor: pointer;
`
