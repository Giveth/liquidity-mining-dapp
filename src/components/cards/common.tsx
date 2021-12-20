import styled from 'styled-components';

export interface ICardProps {
	activeIndex: number;
	index: number;
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
			return '50%';
		}
		if (props.index - props.activeIndex === 1) {
			return `calc(100% + ${1120 / 2 - 60}px)`;
		}
		if (props.index - props.activeIndex === -1) {
			return `-${1120 / 2 - 60}px;`;
		}
		return `${(props.index - props.activeIndex) * 100 + 50}%`;
	}};
	transform: translate(-50%, -60%);
	transition: left 0.3s ease-out;
	@media only screen and (max-width: 1360px) {
		width: 944px;
		padding: 87px 57px;
		left: ${props => {
			if (props.index - props.activeIndex === 0) {
				return '50%';
			}
			if (props.index - props.activeIndex === 1) {
				return `calc(100% + ${944 / 2 - 40}px)`;
			}
			if (props.index - props.activeIndex === -1) {
				return `-${944 / 2 - 40}px;`;
			}
			return `${(props.index - props.activeIndex) * 100 + 50}%`;
		}};
	}
	@media only screen and (max-width: 1120px) {
		width: 705px;
		padding: 87px 24px;
		left: ${props => {
			if (props.index - props.activeIndex === 0) {
				return '50%';
			}
			if (props.index - props.activeIndex === 1) {
				return `calc(100% + ${705 / 2 - 20}px)`;
			}
			if (props.index - props.activeIndex === -1) {
				return `-${705 / 2 - 20}px;`;
			}
			return `${(props.index - props.activeIndex) * 100 + 50}%`;
		}};
	}
`;

export const Header = styled.div`
	margin-bottom: 92px;
	@media only screen and (max-width: 1120px) {
		margin-bottom: 8px;
	}
`;

export const MaxGIV = styled.span`
	color: #fed670;
`;
export const ArrowButton = styled.div`
	width: 64px;
	height: 64px;
	background: #fed670;
	border-radius: 32px;
	background-image: url('/images/rarrow.svg');
	background-repeat: no-repeat;
	background-position: center;

	cursor: pointer;

	position: absolute;
	right: -32px;
	bottom: 48px;
`;
