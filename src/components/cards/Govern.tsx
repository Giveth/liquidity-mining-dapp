import {
	ChangeEvent,
	FC,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import Image from 'next/image';
import BigNumber from 'bignumber.js';
import { utils, BigNumber as EthersBigNumber, constants } from 'ethers';
import styled from 'styled-components';
import { ArrowButton, Card, MaxGIV } from './common';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import { H2, H4, P } from '../styled-components/Typography';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import config from '../../configuration';
import { UserContext } from '../../context/user.context';
import { formatEthHelper, formatWeiHelper, Zero } from '../../helpers/number';
import { fetchGivStakingInfo } from '../../lib/stakingPool';
import { APR } from '../../types/poolInfo';
import { useTokenDistro } from '@/context/tokenDistro.context';

const GovernCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/vote.png');
		position: absolute;
		width: 274px;
		height: 313px;
		bottom: 0;
		left: 0;
		z-index: 0;
	}
`;

const Header = styled.div`
	margin-bottom: 60px;
`;

const Title = styled(H2)`
	width: 750px;
	margin-left: 15%;
`;

const Desc = styled(P)`
	max-width: 650px;
	margin-top: 22px;
	margin-left: 15%;
`;

const GovernGIVToken = styled.div`
	padding: 20px 30px;
	height: 208px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const GovernLabel = styled.span`
	color: #cabaff;
	display: flex;
	gap: 6px;
`;

const MaxStakeGIV = styled(MaxGIV)`
	cursor: pointer;
`;

const GovernInput = styled.div`
	width: 392px;
`;

const YouCanEarn = styled(GovernGIVToken)`
	padding: 20px 5px;
	max-width: 380px;
`;

const GovernGIVEarn = styled.div`
	font-family: Red Hat Text;
	font-size: 48px;
	font-style: normal;
	font-weight: 700;
	line-height: 80px;
	letter-spacing: 0em;
	text-align: left;
`;

const PoolCardContainer = styled.div`
	z-index: 1;
`;

const PoolCardTitle = styled.div`
	font-size: 16px;
	padding-bottom: 12px;
`;

const PoolCard = styled.div`
	width: 350px;
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

const GovernFooter = styled.div`
	max-width: 500px;
	font-size: 12px;
	line-height: 18px;
	margin-left: 20%;
`;

const GovernCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);

	const [stacked, setStacked] = useState<any>(0);
	const [potentialClaim, setPotentialClaim] = useState<EthersBigNumber>(
		constants.Zero,
	);
	const [earnEstimate, setEarnEstimate] = useState<BigNumber>(Zero);
	const [apr, setApr] = useState<APR>(null);
	const { tokenDistroHelper } = useTokenDistro();

	const stackedChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length === 0) {
			setStacked(undefined);
		} else if (isNaN(+e.target.value)) {
			setStacked(stacked);
		} else {
			if (claimableAmount.div(10).gte(utils.parseEther(e.target.value)))
				setStacked(+e.target.value);
		}
	};

	useEffect(() => {
		let _stacked = 0;
		if (!isNaN(stacked)) {
			_stacked = stacked;
		}
		const stackedWithApr = apr ? apr.times(_stacked).div(1200) : Zero;
		const convertedStackedWithApr = EthersBigNumber.from(
			stackedWithApr.toFixed(0),
		).mul(constants.WeiPerEther);
		setPotentialClaim(
			tokenDistroHelper.getLiquidPart(convertedStackedWithApr),
		);
		setEarnEstimate(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				convertedStackedWithApr,
			),
		);
		// setPotentialClaim(stackedWithApr.times(0.1));
		// setEarnEstimate((stackedWithApr.toNumber() * 0.9) / (52 * 5));
	}, [apr, stacked]);

	useEffect(() => {
		if (claimableAmount) {
			setStacked(utils.formatEther(claimableAmount.div(10)));
		}
	}, [claimableAmount]);

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
	}, [stacked]);

	return (
		<GovernCardContainer activeIndex={activeIndex} index={index}>
			<div
				style={{
					position: 'relative',
					height: 0,
					top: '15%',
					left: '-6%',
				}}
			>
				<Image
					src='/images/bee1.svg'
					height='81'
					width='112'
					alt='Image of a happy bee'
				/>
			</div>
			<Header>
				<Title as='h1'>How to use your GIV</Title>
				<Desc size='small' color={'#CABAFF'}>
					Participate in Giveth governance using the GIVgarden. Govern
					on proposals with GIV and earn rewards.
				</Desc>
			</Header>
			<Row alignItems={'center'} justifyContent={'flex-end'}>
				<GovernGIVToken>
					<H4 as='h2'>If you vote with GIV tokens</H4>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<GovernLabel>Amount of GIV wrapped</GovernLabel>
							<MaxStakeGIV
								onClick={() =>
									setStacked(
										Number(
											utils.formatEther(
												claimableAmount.div(10),
											),
										),
									)
								}
							>{`Max ${utils.formatEther(
								claimableAmount.div(10),
							)} GIV`}</MaxStakeGIV>
						</Row>
						<GovernInput>
							<InputWithUnit
								type='number'
								value={stacked}
								unit={'GIV'}
								onChange={stackedChangeHandler}
							/>
						</GovernInput>
					</div>
				</GovernGIVToken>
				<PoolCardContainer>
					<PoolCardTitle>If you wrap for 1 month:</PoolCardTitle>
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
									{formatWeiHelper(potentialClaim)} GIV
								</PoolItemBold>
							</Row>
							<Row justifyContent='space-between'>
								<PoolItem>Streaming</PoolItem>
								<PoolItemBold>
									{formatWeiHelper(earnEstimate, 2)} GIV/week
								</PoolItemBold>
							</Row>
						</PoolItems>
					</PoolCard>
				</PoolCardContainer>
			</Row>
			<Row>
				<GovernFooter>
					The following calculators demonstrate how you can use GIV to
					participate in the GIVeconomy!{' '}
					<b>These are just simulations.</b> To participate for real,
					claim your GIV.
				</GovernFooter>
			</Row>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</GovernCardContainer>
	);
};

export default GovernCard;
