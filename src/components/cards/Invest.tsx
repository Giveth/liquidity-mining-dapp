import { useState, ChangeEvent, FC, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import { H2, H4, P } from '../styled-components/Typography';
import { ArrowButton, Card, Header, MaxGIV } from './common';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import { UserContext } from '../../context/user.context';
import { ethers } from 'ethers';
import { fetchGivMiningInfo } from '../../lib/stakingPool';
import config from '../../configuration';
import { APR } from '../../types/poolInfo';
import BigNumber from 'bignumber.js';
import { convertEthHelper, Zero } from '../../helpers/number';

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

const InvestCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);

	const [deposit, setDeposit] = useState(0);
	const [earnEstimate, setEarnEstimate] = useState<BigNumber>(Zero);
	const [apr, setApr] = useState<APR>(null);

	const depositChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length === 0) {
			setDeposit(0);
		} else if (isNaN(+e.target.value)) {
			setDeposit(deposit);
		} else {
			if (claimableAmount.gte(ethers.utils.parseEther(e.target.value)))
				setDeposit(+e.target.value);
		}
	};

	useEffect(() => {
		setEarnEstimate(apr ? apr.times(deposit).div(100) : Zero);
	}, [apr, deposit]);

	useEffect(() => {
		const cb = () => {
			fetchGivMiningInfo(
				config.XDAI_CONFIG.GIV.LM_ADDRESS,
				config.XDAI_NETWORK_NUMBER,
			)
				.then(({ apr: _apr }) => setApr(_apr))
				.catch(e => console.error('Error on fetching APR:', e));
		};

		cb();
		const interval = setInterval(cb, 120 * 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<InvestCardContainer activeIndex={activeIndex} index={index}>
			<Header>
				<H2 as='h1'>Invest with GIVmining</H2>
				<P size='small' color={'#CABAFF'}>
					Provide liquidity or stake your GIV tokens to earn up to
					{apr ? convertEthHelper(apr, 2, true) : '?'}% APY
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
							<MaxGIV>{`Max ${ethers.utils.formatEther(
								claimableAmount,
							)} GIV`}</MaxGIV>
						</Row>
						<DepositInput>
							<InputWithUnit
								value={deposit}
								unit={'GIV'}
								onChange={depositChangeHandler}
							/>
						</DepositInput>
					</div>
				</ImpactCard>
				<PoolCard>
					<H4 as='h2'>Your Pool</H4>
					<PoolItems>
						<Row justifyContent='space-between'>
							<PoolItem>Your deposit</PoolItem>
							<PoolItem>{deposit}</PoolItem>
						</Row>
						<Row justifyContent='space-between'>
							<PoolItem>Farm fee</PoolItem>
							<PoolItem>Free</PoolItem>
						</Row>
						<Row justifyContent='space-between'>
							<PoolItem>Annual GIV earned</PoolItem>
							<PoolItemBold>
								{convertEthHelper(earnEstimate, 2, true)}
							</PoolItemBold>
						</Row>
					</PoolItems>
				</PoolCard>
			</Row>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</InvestCardContainer>
	);
};

export default InvestCard;
