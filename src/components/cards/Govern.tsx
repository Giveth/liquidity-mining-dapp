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
import {
	APRRow,
	ArrowButton,
	Card,
	ImpactCard,
	ImpactCardInput,
	ImpactCardLabel,
	MaxGIV,
	PoolCard,
	PoolCardContainer,
	PoolCardTitle,
	PoolItem,
	PoolItemBold,
	PoolItems,
} from './common';
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
	padding-left: 254px;
	::before {
		content: '';
		background-image: url('/images/vote.png');
		position: absolute;
		width: 274px;
		height: 313px;
		bottom: 0;
		left: 0;
		z-index: -1;
	}
	@media only screen and (max-width: 1360px) {
		padding-left: 112px;
		::before {
			width: 170px;
			height: 150px;
			background-size: contain;
			background-repeat: no-repeat;
		}
	}
	@media only screen and (max-width: 1120px) {
		padding: 8px;
		::before {
			background-image: none;
		}
	}
`;

const BeeImage = styled.div`
	position: absolute;
	left: 40px;
	@media only screen and (max-width: 1360px) {
		left: 10px;
		width: 80px;
	}
	@media only screen and (max-width: 1120px) {
		display: none;
	}
`;

const Header = styled.div`
	margin-bottom: 60px;
	@media only screen and (max-width: 1120px) {
		margin-bottom: 16px;
	}
`;

const Title = styled(H2)`
	width: 750px;
`;

const Desc = styled(P)`
	max-width: 650px;
	margin-top: 22px;
`;

const GovernGIVToken = styled.div`
	padding: 20px 30px;
	height: 208px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const MaxStakeGIV = styled(MaxGIV)`
	cursor: pointer;
`;

const GovernFooter = styled.div`
	max-width: 500px;
	font-size: 12px;
	line-height: 18px;
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
			if (claimableAmount.gte(utils.parseEther(e.target.value)))
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
			setStacked(utils.formatEther(claimableAmount));
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
			<BeeImage>
				<Image
					src='/images/bee1.svg'
					height='81'
					width='112'
					alt='Image of a happy bee'
				/>
			</BeeImage>
			<Header>
				<Title as='h1'>How to use your GIV</Title>
				<Desc size='small' color={'#CABAFF'}>
					Participate in Giveth governance using the GIVgarden. Govern
					on proposals with GIV and earn rewards.
				</Desc>
			</Header>
			<APRRow alignItems={'center'} justifyContent={'flex-end'}>
				<ImpactCard>
					<H4 as='h2'>If you vote with GIV tokens</H4>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<ImpactCardLabel>
								Amount of GIV wrapped
							</ImpactCardLabel>
							<MaxStakeGIV
								onClick={() =>
									setStacked(
										Number(
											utils.formatEther(claimableAmount),
										),
									)
								}
							>{`Max ${utils.formatEther(
								claimableAmount,
							)} GIV`}</MaxStakeGIV>
						</Row>
						<ImpactCardInput>
							<InputWithUnit
								type='number'
								value={stacked}
								unit={'GIV'}
								onChange={stackedChangeHandler}
							/>
						</ImpactCardInput>
					</div>
				</ImpactCard>
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
			</APRRow>
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
