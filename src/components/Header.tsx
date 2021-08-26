import styled from 'styled-components'
import Image from 'next/image'
import router from 'next/router'
import { Row } from './styled-components/Grid'
import { Button } from './styled-components/Button'
import { FC, useContext } from 'react'
import { ThemeContext, ThemeType } from '../providers/theme'

interface IHeader {
	theme?: ThemeType
}

const StyledHeader = styled(Row)<IHeader>`
	height: 128px;
	padding: 0 132px;
	/* margin-top: 16px; */
	position: relative;
	background-color: ${props => props.theme.bg};
	::before {
		content: url('/images/homebg1.png');
		position: absolute;
		top: 48px;
		left: 0;
	}
`

const HeaderClaimButton = styled(Button)`
	height: 36px;
	width: 140px;
	font-size: 14px;
	font-style: normal;
	font-weight: 700;
	line-height: 18px;
	letter-spacing: 0.04em;
	text-align: center;
	padding: 0;
`

const Title = styled.h1`
	font-family: 'red-hat';
	font-size: 16px;
	font-style: normal;
	font-weight: 500;
	line-height: 24px;
	letter-spacing: 0.02em;
	text-align: left;
	color: ${props => props.theme.fg};
`

const Header: FC<IHeader> = () => {
	const { theme } = useContext(ThemeContext)
	const goToClaim = () => {
		router.push('/claim')
	}

	return (
		<StyledHeader
			justifyContent='space-between'
			alignItems='center'
			theme={theme}
		>
			<Row gap='16px'>
				<Image
					width='58'
					height='58px'
					alt='Giveth logo'
					src={`/images/${
						theme.type === ThemeType.Dark ? 'logod' : 'logol'
					}.svg`}
				/>
				<Title theme={theme}>THE FUTURE OF GIVING</Title>
			</Row>
			<Row>
				<HeaderClaimButton secondary onClick={goToClaim}>
					CLAIM GIV
				</HeaderClaimButton>
			</Row>
		</StyledHeader>
	)
}

export default Header
