import { useState, ChangeEvent, FC } from 'react';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import { H2, H4, P } from '../styled-components/Typography';
import { ArrowButton, Card, Header, ICardProps, MaxGIV } from './common';

const InvestCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/earn.png');
		position: absolute;
		width: 368px;
		height: 361px;
		bottom: 0;
		right: 0;
		z-index: 0;
	}
`;

const DepositeLable = styled.span`
	color: #cabaff;
`;

const DepositInput = styled.div`
	width: 392px;
`;

const ImpactCard = styled.div`
	padding: 20px 30px;
	height: 208px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const PoolCard = styled.div`
	width: 399px;
	height: 208px;
	padding: 20px 30px;

	background: #ffffff;
	border-radius: 16px;
	color: #1b1657;
	z-index: 1;
`;

const PoolItems = styled.div`
	padding: 12px 0;
`;

const PoolItem = styled.div`
	font-size: 16px;
	height: 40px;
	line-height: 40px;
`;

const PoolItemBold = styled.div`
	font-size: 32px;
	font-weight: bold;
	line-height: 40px;
`;

const InvestCard: FC<ICardProps> = ({ activeIndex, index }) => {
	const [deposite, setDopsite] = useState(0);

	const depositeChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length === 0) {
			setDopsite(0);
		} else if (isNaN(+e.target.value)) {
			setDopsite(deposite);
		} else {
			setDopsite(+e.target.value);
		}
	};

	return (
		<InvestCardContainer activeIndex={activeIndex} index={index}>
			<Header>
				<H2 as='h1'>Invest with GIVmining</H2>
				<P size='small' color={'#CABAFF'}>
					Provide liquidity or stake your GIV tokens to earn up to
					140% APY
				</P>
			</Header>
			<Row alignItems={'flex-start'} justifyContent={'space-between'}>
				<ImpactCard>
					<H4 as='h2'>See your impact</H4>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<DepositeLable>Your deposit</DepositeLable>
							<MaxGIV>{`Max ${333} GIV`}</MaxGIV>
						</Row>
						<DepositInput>
							<InputWithUnit
								value={deposite}
								unit={'GIV'}
								onChange={depositeChangeHandler}
							/>
						</DepositInput>
					</div>
				</ImpactCard>
				<PoolCard>
					<H4 as='h2'>Your Pool</H4>
					<PoolItems>
						<Row justifyContent='space-between'>
							<PoolItem>Your deposit</PoolItem>
							<PoolItem>{deposite}</PoolItem>
						</Row>
						<Row justifyContent='space-between'>
							<PoolItem>Farm fee</PoolItem>
							<PoolItem>Free</PoolItem>
						</Row>
						<Row justifyContent='space-between'>
							<PoolItem>Annual GIV earned</PoolItem>
							<PoolItemBold>{0}</PoolItemBold>
						</Row>
					</PoolItems>
				</PoolCard>
			</Row>
			<ArrowButton />
		</InvestCardContainer>
	);
};

export default InvestCard;
