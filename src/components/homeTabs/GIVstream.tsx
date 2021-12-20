import React, {
	FC,
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import Link from 'next/link';
import { Row } from '../styled-components/Grid';
import {
	B,
	brandColors,
	Container,
	H1,
	H3,
	H6,
	IconGIVBack,
	IconGIVFarm,
	IconGIVGarden,
	IconGIVStream,
	IconHelp,
	IconSpark,
	P,
} from '@giveth/ui-design-system';
import {
	Bar,
	FlowRateRow,
	FlowRateTooltip,
	FlowRateUnit,
	GIVbacksBottomContainer,
	GIVstreamProgressContainer,
	GIVstreamRewardCard,
	GIVstreamTopContainer,
	GIVstreamTopInnerContainer,
	Grid,
	GsButton,
	GsDataBlock,
	GsHFrUnit,
	GsPTitle,
	GsPTitleRow,
	GsPTooltip,
	GSSubtitle,
	GSTitle,
	HistoryContainer,
	HistoryTitle,
	HistoryTitleRow,
	HistoryTooltip,
	IGsDataBox,
	IncreaseSection,
	IncreaseSectionTitle,
	Left,
	PaginationItem,
	PaginationRow,
	PercentageRow,
	Right,
	TxHash,
} from './GIVstream.sc';
import { IconWithTooltip } from '../IconWithToolTip';
import {
	getHistory,
	getTokenDistroInfo,
	ITokenAllocation,
} from '@/services/subgraph';
import { OnboardContext } from '@/context/onboard.context';
import { formatWeiHelper } from '@/helpers/number';
import config from '@/configuration';
import { convertMSToHRD } from '@/lib/helpers';
import { NetworkSelector } from '@/components/NetworkSelector';
import { useBalances } from '@/context/balance.context';
import { constants, ethers } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';
import BigNumber from 'bignumber.js';
import { HarvestAllModal } from '../modals/HarvestAll';
import { Zero } from '@ethersproject/constants';

export const TabGIVstreamTop = () => {
	const [showModal, setShowModal] = useState(false);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { tokenDistroHelper } = useTokenDistro();
	const { currentBalance } = useBalances();
	const { allocatedTokens, claimed, givback } = currentBalance;
	const { network: walletNetwork } = useContext(OnboardContext);

	useEffect(() => {
		setRewardLiquidPart(
			tokenDistroHelper
				.getLiquidPart(allocatedTokens.sub(givback))
				.sub(claimed),
		);
		setRewardStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				allocatedTokens.sub(givback),
			),
		);
	}, [allocatedTokens, claimed, givback, tokenDistroHelper]);

	return (
		<>
			<GIVstreamTopContainer>
				<GIVstreamTopInnerContainer>
					<Row justifyContent='space-between'>
						<Left>
							<Row alignItems='baseline' gap='16px'>
								<GSTitle>GIVstream</GSTitle>
								<IconGIVStream size={64} />
							</Row>
							<GSSubtitle size='medium'>
								Welcome to the expanding GIViverse! The
								GIVstream aligns community members with the long
								term success of Giveth and the GIVeconomy.
							</GSSubtitle>
						</Left>
						<Right>
							<GIVstreamRewardCard
								wrongNetworkText='GIVstream is only available on Mainnet and xDAI.'
								liquidAmount={rewardLiquidPart}
								stream={rewardStream}
								actionLabel='HARVEST'
								actionCb={() => {
									setShowModal(true);
								}}
								network={walletNetwork}
								targetNetworks={[
									config.MAINNET_NETWORK_NUMBER,
									config.XDAI_NETWORK_NUMBER,
								]}
							/>
						</Right>
					</Row>
				</GIVstreamTopInnerContainer>
			</GIVstreamTopContainer>
			{showModal && (
				<HarvestAllModal
					title='GIVstream Rewards'
					showModal={showModal}
					setShowModal={setShowModal}
					network={walletNetwork}
				/>
			)}
		</>
	);
};

export const TabGIVstreamBottom = () => {
	const { network: walletNetwork } = useContext(OnboardContext);
	const { tokenDistroHelper } = useTokenDistro();

	const [percent, setPercent] = useState(0);
	const [remain, setRemain] = useState('');
	useState<ethers.BigNumber>(Zero);
	const [streamAmount, setStreamAmount] = useState<BigNumber>(
		new BigNumber(0),
	);
	const { currentBalance } = useBalances();
	const increaseSecRef = useRef<HTMLDivElement>(null);
	const supportedNetworks = [
		config.MAINNET_NETWORK_NUMBER,
		config.XDAI_NETWORK_NUMBER,
	];

	useEffect(() => {
		setStreamAmount(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				currentBalance.allocatedTokens.sub(currentBalance.givback),
			),
		);
	}, [
		currentBalance.allocatedTokens,
		currentBalance.givback,
		tokenDistroHelper,
	]);

	useEffect(() => {
		const _remain = convertMSToHRD(tokenDistroHelper.remain);
		const _HRremain = `${_remain.y ? _remain.y + 'y' : ''} ${
			_remain.m ? _remain.m + 'm' : ''
		} ${_remain.d ? _remain.d + 'd' : ''} `;
		setPercent(tokenDistroHelper.percent);
		setRemain(_HRremain);
	}, [tokenDistroHelper]);
	return (
		<GIVbacksBottomContainer>
			<Container>
				<NetworkSelector />
				<FlowRateRow alignItems='baseline' gap='8px'>
					<H3 weight={700}>Your Flowrate:</H3>
					<IconGIVStream size={64} />
					<H1>
						{supportedNetworks.includes(walletNetwork)
							? formatWeiHelper(streamAmount)
							: '0'}
					</H1>
					<FlowRateUnit>GIV/week</FlowRateUnit>
					<IconWithTooltip
						icon={<IconHelp size={16} />}
						direction={'top'}
					>
						<FlowRateTooltip>
							The GIVstream progress shows how much time is left
							for your GIVstream to flow.
						</FlowRateTooltip>
					</IconWithTooltip>
				</FlowRateRow>
				<GIVstreamProgress percentage={percent} remainTime={remain} />
				<Row wrap={1} justifyContent='space-between'>
					<GsDataBlock
						title='GIVstream'
						button={
							<a
								target='_blank'
								href='https://docs.giveth.io/giveconomy/givstream'
								rel='noreferrer noopener'
							>
								<GsButton
									label='LEARN MORE'
									buttonType='secondary'
									size='large'
								/>
							</a>
						}
					>
						At launch, 10% of the total supply of GIV is liquid. The
						rest is released via the GIVstream, becoming liquid
						gradually until December 24, 2026.
					</GsDataBlock>
					<GsDataBlock
						title='Expanding GIViverse'
						// button={
						// 	<GsButton
						// 		label='INCREASE YOUR GIVSTREAM'
						// 		buttonType='secondary'
						// 		size='large'
						// 		onClick={() => {
						// 			if (increaseSecRef.current) {
						// 				const elDistanceToTop =
						// 					window.pageYOffset +
						// 					increaseSecRef.current.getBoundingClientRect()
						// 						.top;
						// 				window.scrollTo({
						// 					top: elDistanceToTop || 100,
						// 					left: 0,
						// 					behavior: 'smooth',
						// 				});
						// 			}
						// 		}}
						// 	/>
						// }
					>
						Anyone who adds value to the Giveth ecosystem recieves a
						GIVstream. As the GIVeconomy grows, more GIV becomes
						liquid & flows to our community.
					</GsDataBlock>
				</Row>
				{/* <HistoryTitleRow>
					<HistoryTitle>History</HistoryTitle>
					<IconWithTooltip
						icon={<IconHelp size={16} />}
						direction={'top'}
					>
						<HistoryTooltip>
							Every time you claim GIV rewards from GIVbacks, the
							GIVgarden, or the GIVfarm, your GIVstream flowrate
							increases. Below is a summary.
						</HistoryTooltip>
					</IconWithTooltip>
				</HistoryTitleRow> */}
				{/* <GIVstreamHistory /> */}
			</Container>
			{/* //unipooldis */}
			<IncreaseSection ref={increaseSecRef}>
				<Container>
					<IncreaseSectionTitle>
						Increase your GIVstream
						<IconSpark size={32} color={brandColors.mustard[500]} />
					</IncreaseSectionTitle>
					<Row wrap={1} justifyContent='space-between'>
						<IGsDataBox
							title='GIVbacks'
							button={
								<a
									href='https://giveth.io/projects'
									target='_blank'
									rel='noreferrer'
								>
									<GsButton
										label='SEE PROJECTS'
										buttonType='primary'
										size='medium'
									/>
								</a>
							}
						>
							Donate to verified projects on Giveth. Get GIV and
							increase your GIVstream with the GIVbacks program.
						</IGsDataBox>
						<IGsDataBox
							title='GIVgarden'
							button={
								<a
									href='https://gardens-staging.1hive.org/#/xdai/garden/0x2050eabe84409e480ad1062001fdb6dfbc836192'
									target='_blank'
									rel='noreferrer'
								>
									<GsButton
										label='SEE PROPOSALS'
										buttonType='primary'
										size='medium'
									/>
								</a>
							}
						>
							The GIVgarden is the decentralized governance
							platform for the GIVeconomy. Increase your GIVstream
							when you wrap GIV to vote.
						</IGsDataBox>
						<IGsDataBox
							title='GIVfarm'
							button={
								<Link href='/givfarm' passHref>
									<GsButton
										label='SEE OPPORTUNITIES'
										buttonType='primary'
										size='medium'
									/>
								</Link>
							}
						>
							Stake GIV, or become a liquidity provider and stake
							LP tokens in the GIVfarm. Get GIV rewards and
							increase your GIVstream.
						</IGsDataBox>
					</Row>
				</Container>
			</IncreaseSection>
		</GIVbacksBottomContainer>
	);
};

interface IGIVstreamProgressProps {
	percentage?: number;
	remainTime?: string;
}

export const GIVstreamProgress: FC<IGIVstreamProgressProps> = ({
	percentage = 0,
	remainTime = '',
}) => {
	return (
		<GIVstreamProgressContainer>
			<GsPTitleRow justifyContent='space-between'>
				<GsPTitle alignItems='center' gap='8px'>
					<H6>GIViverse Expansion</H6>
					<IconWithTooltip
						icon={<IconHelp size={16} />}
						direction={'right'}
					>
						<GsPTooltip>
							Time left for all GIVstreams to flow & for the
							GIViverse to reach full power!
						</GsPTooltip>
					</IconWithTooltip>
				</GsPTitle>
				<P>{`Time remaining: ` + remainTime}</P>
			</GsPTitleRow>
			<Bar percentage={percentage} />
			<PercentageRow justifyContent='space-between'>
				<B>{percentage?.toFixed(2)}%</B>
				<B>100%</B>
			</PercentageRow>
		</GIVstreamProgressContainer>
	);
};

export enum GIVstreamDistributor {
	Back,
	Farm,
	Garden,
}

const convetSourceTypeToIcon = (distributor: string) => {
	switch (distributor.toLowerCase()) {
		case 'givback':
			return (
				<Row gap='16px'>
					<IconGIVBack size={24} color={brandColors.mustard[500]} />
					<P>{` GIVbacks`}</P>
				</Row>
			);
		case 'giveth':
		case 'balancerlm':
		case 'uniswappool':
		case 'givlm':
			return (
				<Row gap='16px'>
					<IconGIVFarm size={24} color={brandColors.mustard[500]} />
					<P>{` GIVfarm`}</P>
				</Row>
			);
		// case GIVstreamSources.Garden:
		// 	return (
		// 		<Row gap='16px'>
		// 			<IconGIVGarden size={24} color={brandColors.mustard[500]} />
		// 			<P>{` GIVgarden`}</P>
		// 		</Row>
		// 	);
		default:
			return distributor; //'Unknown'
			break;
	}
};

export const GIVstreamHistory: FC = () => {
	const { network, address } = useContext(OnboardContext);
	const [tokenAllocations, setTokenAllocations] = useState<
		ITokenAllocation[]
	>([]);
	const [page, setPage] = useState(0);
	const [pages, setPages] = useState<any[]>([]);
	const count = 6;
	const { currentBalance } = useBalances();
	const { allocationCount } = currentBalance;

	const { tokenDistroHelper } = useTokenDistro();

	useEffect(() => {
		setPage(0);
	}, [network, address]);

	useEffect(() => {
		getHistory(network, address, page * count, count).then(
			_tokenAllocations => {
				setTokenAllocations(_tokenAllocations);
			},
		);
	}, [network, address, page]);

	useEffect(() => {
		const nop = Math.floor(allocationCount / count) + 1;
		if (nop > 4) {
			setPages([1, 2, '...', nop - 1, nop]);
		} else {
			const _pages = [];
			for (let i = 1; i < nop + 1; i++) {
				_pages.push(i);
			}
			setPages(_pages);
		}
	}, [allocationCount]);

	return (
		<HistoryContainer>
			<Grid>
				<B as='span'>GIVstream Source</B>
				<B as='span'>Flowrate Change</B>
				<B as='span'>Date</B>
				<B as='span'>Tx</B>
			</Grid>
			{tokenAllocations && tokenAllocations.length > 0 && (
				<Grid>
					{tokenAllocations.map((tokenAllocation, idx) => {
						const d = new Date(+`${tokenAllocation.timestamp}000`);
						const date = d
							.toDateString()
							.split(' ')
							.splice(1, 2)
							.join(' ');
						return (
							// <span key={idx}>1</span>
							<Fragment key={idx}>
								<P as='span'>
									{convetSourceTypeToIcon(
										tokenAllocation.distributor ||
											'Unknown',
									)}
									{/* {tokenAllocation.distributor || 'Unknown'} */}
								</P>
								<B as='span'>
									+
									{formatWeiHelper(
										tokenDistroHelper.getStreamPartTokenPerWeek(
											ethers.BigNumber.from(
												tokenAllocation.amount,
											),
										),
									)}
									<GsHFrUnit as='span'>{` GIV/week`}</GsHFrUnit>
								</B>
								<P as='span'>{date}</P>
								<TxHash
									as='span'
									size='Big'
									onClick={() => {
										const url =
											network ===
											config.MAINNET_NETWORK_NUMBER
												? config.MAINNET_NETWORK
														.blockExplorerUrls
												: config.XDAI_NETWORK
														.blockExplorerUrls;
										window.open(
											`${url}/tx/${tokenAllocation.txHash}`,
											'_blank',
										);
									}}
								>
									{tokenAllocation.txHash}
								</TxHash>
							</Fragment>
						);
					})}
				</Grid>
			)}
			{!tokenAllocations && <div> NO DATA</div>}
			<PaginationRow justifyContent={'flex-end'} gap='16px'>
				<PaginationItem
					onClick={() => {
						if (page > 0) setPage(page => page - 1);
					}}
					disable={page == 0}
				>
					{'<  Back'}
				</PaginationItem>
				{pages.map((p, id) => {
					return (
						<PaginationItem
							key={id}
							onClick={() => {
								if (!isNaN(+p)) setPage(+p - 1);
							}}
							isActive={+p - 1 === page}
						>
							{p}
						</PaginationItem>
					);
				})}
				<PaginationItem
					onClick={() => {
						if (page < Math.floor(allocationCount / count))
							setPage(page => page + 1);
					}}
					disable={page >= Math.floor(allocationCount / count)}
				>
					{'Next  >'}
				</PaginationItem>
			</PaginationRow>
		</HistoryContainer>
	);
};
