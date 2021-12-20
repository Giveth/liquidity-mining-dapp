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
import {
	APRRow,
	ArrowButton,
	Card,
	ImpactCard,
	ImpactCardInput,
	ImpactCardLabel,
	MaxGIV,
	MaxStakeGIV,
	PoolCard,
	PoolCardContainer,
	PoolCardFooter,
	PoolCardTitle,
	PoolItem,
	PoolItemBold,
	PoolItems,
} from './common';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import { UserContext } from '../../context/user.context';
import { utils, BigNumber as EthersBigNumber, constants } from 'ethers';
import { fetchGivStakingInfo } from '../../lib/stakingPool';
import config from '../../configuration';
import { APR } from '../../types/poolInfo';
import BigNumber from 'bignumber.js';
import { formatEthHelper, formatWeiHelper, Zero } from '../../helpers/number';
import { PoolStakingConfig, StakingType } from '@/types/config';
import { StakePoolInfo } from '@/types/poolInfo';
import { fetchLPStakingInfo } from '@/lib/stakingPool';
import { useLiquidityPositions } from '@/context';
import { useTokenDistro } from '@/context/tokenDistro.context';

const InvestCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/earn.png');
		position: absolute;
		width: 368px;
		height: 361px;
		bottom: 0;
		right: 0;
		z-index: -1;
	}
	@media only screen and (max-width: 1120px) {
		padding: 8px 16px;
	}
`;

export const Header = styled.div`
	margin-bottom: 92px;
	@media only screen and (max-width: 1120px) {
		margin-bottom: 8px;
	}
`;

const Title = styled(H2)`
	width: 700px;
	@media only screen and (max-width: 1360px) {
		width: 700px;
	}
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;

const Desc = styled(P)`
	margin-top: 22px;
	@media only screen and (max-width: 1120px) {
		margin-top: 8px;
	}
`;

const InvestCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);

	const [deposit, setDeposit] = useState<any>(0);
	const [potentialClaim, setPotentialClaim] = useState<EthersBigNumber>(
		constants.Zero,
	);
	const [earnEstimate, setEarnEstimate] = useState<BigNumber>(Zero);
	const [APR, setAPR] = useState<BigNumber>(Zero);
	const { apr: univ3apr } = useLiquidityPositions();
	const { tokenDistroHelper } = useTokenDistro();

	const depositChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (value.length === 0) {
			setDeposit(undefined);
		} else if (isNaN(+value)) {
			setDeposit(deposit);
		} else {
			if (claimableAmount.gte(utils.parseEther(value)))
				setDeposit(+value);
		}
	};

	useEffect(() => {
		if (claimableAmount) {
			setDeposit(utils.formatEther(claimableAmount));
		}
	}, [claimableAmount]);

	useEffect(() => {
		let _deposit = 0;
		if (!isNaN(deposit)) {
			_deposit = deposit;
		}
		const stackedWithApr = APR ? APR.times(_deposit).div(1200) : Zero;
		if (stackedWithApr.isNaN()) return;
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
		// setEarnEstimate(stackedWithApr.times(0.9).div(52 * 5));
	}, [APR, deposit]);

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
		const _apr = sortedAPRs.pop();
		if (_apr) {
			setAPR(_apr);
		}
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
			<Header>
				<Title as='h1'>How to use your GIV</Title>
				<Desc size='small' color={'#CABAFF'}>
					Stake tokens in the GIVfarm to earn up to{' '}
					{APR ? `${formatEthHelper(APR, 2)}% APR` : ' ? '}
				</Desc>
			</Header>
			<APRRow alignItems={'flex-start'} justifyContent={'space-between'}>
				<ImpactCard>
					<H4 as='h2'>See how much you could earn</H4>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<ImpactCardLabel>If you deposit</ImpactCardLabel>
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
						<ImpactCardInput>
							<InputWithUnit
								type='number'
								value={deposit}
								unit={'GIV'}
								onChange={depositChangeHandler}
							/>
						</ImpactCardInput>
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
									{formatEthHelper(APR ? APR : Zero, 2)}%
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
									{formatWeiHelper(earnEstimate)} GIV/week
								</PoolItemBold>
							</Row>
						</PoolItems>
					</PoolCard>
				</PoolCardContainer>
			</APRRow>
			<PoolCardFooter>
				The following calculators demonstrate how you can use GIV to
				participate in the GIVeconomy!{' '}
				<b>These are just simulations.</b> To participate for real,
				claim your GIV.
			</PoolCardFooter>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</InvestCardContainer>
	);
};

export default InvestCard;
