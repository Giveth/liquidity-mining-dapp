import styled from 'styled-components'

export interface ICardProps {
	activeIndex: number
	index: number
}

export const Card = styled.div<ICardProps>`
	position: absolute;
	width: 1120px;
	height: 582px;
	background: #3c14c5;
	padding: 96px 80px;
	background-image: url('/images/GIVGIVGIV.png');
	background-repeat: no-repeat;
	background-size: cover;
	margin: 10px auto;
	top: 50%;
	left: ${props => {
		if (props.index - props.activeIndex === 0) {
			return '50%'
		}
		if (props.index - props.activeIndex === 1) {
			return `calc(100% + ${1120 / 2 - 120}px)`
		}
		if (props.index - props.activeIndex === -1) {
			return `-${1120 / 2 - 120}px;`
		}
		return `${(props.index - props.activeIndex) * 100 + 50}%`
	}};
	transform: translate(-50%, -60%);
	transition: left 0.3s ease-out;
`

export const Header = styled.div`
	margin-bottom: 92px;
`

export const MaxGIV = styled.span`
	color: #fed670;
`
