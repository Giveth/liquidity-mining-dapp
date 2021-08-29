import styled from 'styled-components';
import { H1, H2, H3, P } from '../styled-components/Typography';
import { Container, Row } from '../styled-components/Grid';
import { Button } from '../styled-components/Button';
import router from 'next/router';
import Header from '../Header';
import Image from 'next/image';
import { ThemeContext } from '../../context/theme.context';
import { useContext } from 'react';

const StackingPoolTitle = styled.h1`
	font-family: 'red-hat';
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 19px;
	letter-spacing: 0em;
	color: #4f576a;
`;

const FarmViewStyled = styled.div`
	background-image: url('/images/farm-bg.png');
	background-color: ${props => props.theme.bg};
`;

function FarmView() {
	const { theme } = useContext(ThemeContext);

	return (
		<>
			<Header />
			<FarmViewStyled theme={theme}>
				<Container>
					<Row flexDirection='column'>
						<Row gap='5px'>
							<Image
								width='20px'
								height='20px'
								alt='Giveth logo'
								src='/images/stackingPool.svg'
							/>
							<StackingPoolTitle>Staking Pools</StackingPoolTitle>
						</Row>
						<Row justifyContent='space-between' wrap={1}>
							<div></div>
						</Row>
					</Row>
				</Container>
			</FarmViewStyled>
		</>
	);
}

export default FarmView;
