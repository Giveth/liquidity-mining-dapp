import {
	useState,
	ChangeEvent,
	FC,
	useContext,
	useEffect,
	useRef,
} from 'react';
import Image from 'next/image';
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
import { utils } from 'ethers';
import { fetchGivStakingInfo } from '../../lib/stakingPool';
import config from '../../configuration';
import { APR } from '../../types/poolInfo';
import BigNumber from 'bignumber.js';
import { formatEthHelper, Zero } from '../../helpers/number';

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

const Title = styled(H2)`
	width: 700px;
`;

const Desc = styled(P)`
	margin-top: 22px;
`;

const DepositLabel = styled.span`
	color: #cabaff;
`;

const DepositInput = styled.div`
	width: 392px;
`;

const ImpactCard = styled.div`
	padding: 20px 0px;
	height: 208px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const MaxStakeGIV = styled(MaxGIV)`
	cursor: pointer;
`;

const PoolCardContainer = styled.div`
	z-index: 1;
`;

const PoolCardTitle = styled.div`
	font-size: 16px;
	padding-bottom: 12px;
`;

const PoolCard = styled.div`
	width: 399px;
	height: 164px;
	padding: 10px 30px;

	background: #211985;
	border-radius: 16px;
	z-index: 1;
`;

const PoolItems = styled.div`
	padding: 12px 0;
`;

const PoolItem = styled.div`
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	display: flex;
	gap: 6px;
`;

const PoolItemBold = styled.div`
	font-size: 16px;
	font-weight: 500;
	line-height: 40px;
	display: flex;
	gap: 6px;
`;

const PoolCardFooter = styled.div`
	max-width: 500px;
	font-size: 12px;
	line-height: 18px;
`;

const InvestCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);

	const [deposit, setDeposit] = useState(0);
	const [earnEstimate, setEarnEstimate] = useState<BigNumber>(Zero);
	const [potentialClaim, setPotentialClaim] = useState<BigNumber>(Zero);
	const [apr, setApr] = useState<APR>(null);

	const depositChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (value.length === 0) {
			setDeposit(0);
		} else if (isNaN(+value)) {
			setDeposit(deposit);
		} else {
			if (claimableAmount.gte(utils.parseEther(value)))
				setDeposit(+value);
		}
	};
	// 9 / 52 * 5
	useEffect(() => {
		const stackedWithApr = apr ? apr.times(deposit).div(100).div(12) : Zero;
		setPotentialClaim(stackedWithApr.times(0.1));
		setEarnEstimate(stackedWithApr.times(0.9).div(52 * 5));
	}, [apr, deposit]);

	const mounted = useRef(true);
	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	useEffect(() => {
		const cb = () => {
			fetchGivStakingInfo(
				config.XDAI_CONFIG.GIV.LM_ADDRESS,
				config.XDAI_NETWORK_NUMBER,
			)
				.then(({ apr: _apr }) => {
					mounted.current && setApr(_apr);
				})
				.catch(e => console.error('Error on fetching APR:', e));
		};

		cb();
		const interval = setInterval(cb, 120 * 1000);

		return () => clearInterval(interval);
	}, [deposit]);

	return (
		<InvestCardContainer activeIndex={activeIndex} index={index}>
			<Header>
				<Title as='h1'>How to use your GIV</Title>
				<Desc size='small' color={'#CABAFF'}>
					Stake tokens in the GIVfarm to earn up to{' '}
					{apr ? `${formatEthHelper(apr, 2)}% APR` : ' ? '}
				</Desc>
			</Header>
			<Row alignItems={'flex-start'} justifyContent={'space-between'}>
				<ImpactCard>
					<H4 as='h2'>See how much you could earn</H4>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<DepositLabel>If you deposit</DepositLabel>
							<MaxStakeGIV
								onClick={() =>
									setDeposit(
										Number(
											utils.formatEther(claimableAmount),
										),
									)
								}
							>{`Max ${utils.formatEther(
								claimableAmount,
							)} GIV`}</MaxStakeGIV>
						</Row>
						<DepositInput>
							<InputWithUnit
								type='number'
								value={deposit}
								unit={'GIV'}
								onChange={depositChangeHandler}
							/>
						</DepositInput>
					</div>
				</ImpactCard>
				<PoolCardContainer>
					<PoolCardTitle>If you stake for 1 month:</PoolCardTitle>
					<PoolCard>
						<PoolItems>
							<Row justifyContent='space-between'>
								<PoolItem>APR</PoolItem>
								<PoolItemBold>
									<Image
										src='/images/icons/star.svg'
										height='16'
										width='16'
										alt='Star icon'
									/>
									{formatEthHelper(apr ? apr : Zero, 2)}%
								</PoolItemBold>
							</Row>
							<Row justifyContent='space-between'>
								<PoolItem>Claimable</PoolItem>
								<PoolItemBold>
									{formatEthHelper(potentialClaim, 2)} GIV
								</PoolItemBold>
							</Row>
							<Row justifyContent='space-between'>
								<PoolItem>Streaming</PoolItem>
								<PoolItemBold>
									{formatEthHelper(earnEstimate, 2)} GIV/week
								</PoolItemBold>
							</Row>
						</PoolItems>
					</PoolCard>
				</PoolCardContainer>
			</Row>
			<Row>
				<PoolCardFooter>
					The following calculators demonstrate how you can use GIV to
					participate in the GIVeconomy!{' '}
					<b>These are just simulations.</b> To participate for real,
					claim your GIV.
				</PoolCardFooter>
			</Row>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</InvestCardContainer>
	);
};

export default InvestCard;
