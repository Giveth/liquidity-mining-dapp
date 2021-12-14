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
import { PoolStakingConfig, StakingType } from '@/types/config';
import { StakePoolInfo } from '@/types/poolInfo';
import { fetchLPStakingInfo } from '@/lib/stakingPool';
import { useLiquidityPositions } from '@/context';

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

const PoolCard = styled.div`
	width: 399px;
	height: 192px;
	padding: 20px 30px;

	background: #211985;
	border-radius: 16px;
	z-index: 1;
`;

const PoolTitle = styled(H4)`
	font-size: 18px;
	font-weight: bold;
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
	const [APR, setAPR] = useState<any>();
	const { apr: univ3apr } = useLiquidityPositions();
	const depositChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length === 0) {
			setDeposit(0);
		} else if (isNaN(+e.target.value)) {
			setDeposit(deposit);
		} else {
			if (claimableAmount.gte(utils.parseEther(e.target.value)))
				setDeposit(+e.target.value);
		}
	};

	// useEffect(() => {
	// 	setEarnEstimate(apr ? apr.times(deposit).div(100) : Zero);
	// }, [apr, deposit]);

	const mounted = useRef(true);
	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	const getAPRs = async (promises: Promise<StakePoolInfo>[]) => {
		const promiseResult = await Promise.all(promises);
		const APRs: BigNumber[] = promiseResult.map(elem =>
			elem.apr ? elem.apr : Zero,
		);
		APRs.push(univ3apr);
		const sortedAPRs = APRs.sort((a, b) => (a.gt(b) ? 0 : -1));
		setAPR(sortedAPRs.pop());
	};

	useEffect(() => {
		const promiseQueue: Promise<StakePoolInfo>[] = [];
		config.XDAI_CONFIG.pools.forEach(poolStakingConfig => {
			const promise: Promise<StakePoolInfo> = fetchLPStakingInfo(
				poolStakingConfig,
				config.XDAI_NETWORK_NUMBER,
			);
			promiseQueue.push(promise);
		});
		config.MAINNET_CONFIG.pools.forEach(poolStakingConfig => {
			const promise: Promise<StakePoolInfo> = fetchLPStakingInfo(
				poolStakingConfig,
				config.MAINNET_NETWORK_NUMBER,
			);
			promiseQueue.push(promise);
		});
		getAPRs(promiseQueue);
	}, []);

	return (
		<InvestCardContainer activeIndex={activeIndex} index={index}>
			<Header onClick={() => console.log(APR)}>
				<Title as='h1'>How to use your GIV</Title>
				<Desc size='small' color={'#CABAFF'}>
					Stake tokens in the GIVfarm to earn up to
					{/* {apr ? `${formatEthHelper(apr, 2)}% APR` : ' ? '} */}
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
							<MaxGIV>{`Max ${utils.formatEther(
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
					<PoolTitle as='h2'>GIV Staking</PoolTitle>
					<PoolItems>
						<Row justifyContent='space-between'>
							<PoolItem>
								APR
								<Image
									src='/images/icons/operations.svg'
									height='16'
									width='16'
									alt='Operations icon'
								/>
							</PoolItem>
							<PoolItemBold>
								<Image
									src='/images/icons/star.svg'
									height='16'
									width='16'
									alt='Star icon'
								/>
								{deposit}%
							</PoolItemBold>
						</Row>
						<Row justifyContent='space-between'>
							<PoolItem>Claimable</PoolItem>
							<PoolItemBold>0 GIV</PoolItemBold>
						</Row>
						<Row justifyContent='space-between'>
							<PoolItem>
								Streaming
								<Image
									src='/images/icons/questionMark.svg'
									height='16'
									width='16'
									alt='Operations icon'
								/>
							</PoolItem>
							<PoolItemBold>
								{formatEthHelper(earnEstimate, 2)} GIV/week
							</PoolItemBold>
						</Row>
					</PoolItems>
				</PoolCard>
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
