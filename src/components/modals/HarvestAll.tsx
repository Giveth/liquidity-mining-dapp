import React, { FC, useContext, useEffect, useState } from 'react';
import { Modal, IModal } from './Modal';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import CheckAnimation from '../../animations/check.json';
import {
	brandColors,
	neutralColors,
	Button,
	Caption,
	IconGIVStream,
	IconHelp,
	Lead,
	P,
	B,
	Title,
	H6,
	GLink,
	OulineButton,
	IconGIVGarden,
	H5,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { IconGIV } from '../Icons/GIV';
import { BigNumber } from '@ethersproject/bignumber';
import { OnboardContext } from '@/context/onboard.context';
import {
	fetchBalances,
	getGIVPrice,
	getTokenDistroInfo,
} from '@/services/subgraph';
import { Zero } from '@/helpers/number';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { calcTokenInfo, ITokenInfo } from '@/lib/helpers';
import { formatWeiHelper } from '@/helpers/number';
import config from '@/configuration';
import { TokenBalanceContext } from '@/context/tokenBalance.context';

interface IHarvestAllModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	onHarvest: () => Promise<void>;
	claimable: BigNumber;
	network: number;
}

enum States {
	Harvest,
	Waiting,
	Confirmed,
}

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const checkAnimationOptions = {
	loop: false,
	autoplay: true,
	animationData: CheckAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

export const HarvestAllModal: FC<IHarvestAllModalProps> = ({
	showModal,
	setShowModal,
	poolStakingConfig,
	claimable,
	network,
	onHarvest,
}) => {
	const [state, setState] = useState(States.Harvest);
	const [tokenInfo, setTokenInfo] = useState<ITokenInfo>();
	const [givBackInfo, setGivBackInfo] = useState<ITokenInfo>();
	const [balanceInfo, setBalanceInfo] = useState<ITokenInfo>();
	const { address } = useContext(OnboardContext);
	const { tokenBalance } = useContext(TokenBalanceContext);

	const [price, setPrice] = useState(0);

	useEffect(() => {
		const getTokensInfo = async () => {
			const distroInfo = await getTokenDistroInfo(network);
			const balances = await fetchBalances(network, address);
			if (distroInfo) {
				const {
					initialAmount,
					totalTokens,
					startTime,
					cliffTime,
					duration,
				} = distroInfo;
				const _givBackInfo = calcTokenInfo(
					initialAmount,
					totalTokens,
					balances.givback,
					duration,
					cliffTime,
					startTime,
				);
				setGivBackInfo(_givBackInfo);
			}
		};
		if (network === config.XDAI_NETWORK_NUMBER) {
			getTokensInfo();
		}
	}, [address, network]);

	useEffect(() => {
		getGIVPrice(network).then(price => {
			setPrice(price);
		});
	}, [network]);

	useEffect(() => {
		getTokenDistroInfo(network).then(distroInfo => {
			if (distroInfo) {
				const {
					initialAmount,
					totalTokens,
					startTime,
					cliffTime,
					duration,
				} = distroInfo;
				const _tokenInfo = calcTokenInfo(
					initialAmount,
					totalTokens,
					claimable,
					duration,
					cliffTime,
					startTime,
				);
				setTokenInfo(_tokenInfo);
			}
		});
	}, [claimable, network]);

	useEffect(() => {
		getTokenDistroInfo(network).then(distroInfo => {
			if (distroInfo) {
				const {
					initialAmount,
					totalTokens,
					startTime,
					cliffTime,
					duration,
				} = distroInfo;
				const _balanceInfo = calcTokenInfo(
					initialAmount,
					totalTokens,
					tokenBalance,
					duration,
					cliffTime,
					startTime,
				);
				setBalanceInfo(_balanceInfo);
			}
		});
	}, [tokenBalance, network]);

	const calcUSD = (amount: string) => {
		const usd = (parseInt(amount.toString()) * price).toFixed(2);
		return usd;
	};

	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			// title='Your GIVgardens Rewards'
		>
			{state === States.Harvest && (
				<HarvestAllModalContainer>
					<HarvestAllModalTitleRow alignItems='center'>
						<HarvestAllModalTitle weight={700}>
							Your GIVgarden Rewards
						</HarvestAllModalTitle>
						<TitleIcon size={24} />
					</HarvestAllModalTitleRow>
					<SPTitle alignItems='center' gap='16px'>
						<StakingPoolImages title={poolStakingConfig.title} />
						<div>
							<StakingPoolLabel weight={900}>
								{poolStakingConfig.title}
							</StakingPoolLabel>
							<StakingPoolSubtitle>
								{poolStakingConfig.description}
							</StakingPoolSubtitle>
						</div>
					</SPTitle>
					{tokenInfo && (
						<>
							<GIVBoxWithPrice
								amount={tokenInfo.releasedReward}
								price={calcUSD(
									formatWeiHelper(
										tokenInfo.releasedReward,
										config.TOKEN_PRECISION,
									),
								)}
							/>
							<HelpRow alignItems='center'>
								<Caption>
									Added to your GIVstream flowrate
								</Caption>
								<IconHelp
									size={16}
									color={brandColors.deep[100]}
								/>
							</HelpRow>
							<RateRow alignItems='center'>
								<IconGIVStream size={24} />
								<GIVRate>
									{formatWeiHelper(
										tokenInfo.flowratePerWeek,
										config.TOKEN_PRECISION,
									)}
								</GIVRate>
								<Lead>GIV/week</Lead>
							</RateRow>
						</>
					)}
					{givBackInfo && givBackInfo.releasedReward.gt(0) && (
						<>
							<HelpRow alignItems='center'>
								<B>Claimable from GIVbacks</B>
								<IconHelp
									size={16}
									color={brandColors.deep[100]}
								/>
							</HelpRow>
							<GIVBoxWithPrice
								amount={givBackInfo.releasedReward}
								price={calcUSD(
									formatWeiHelper(
										givBackInfo.releasedReward,
										config.TOKEN_PRECISION,
									),
								)}
							/>
							<HelpRow alignItems='center'>
								<Caption>
									Added to your GIVstream flowrate
								</Caption>
								<IconHelp
									size={16}
									color={brandColors.deep[100]}
								/>
							</HelpRow>
							<RateRow alignItems='center'>
								<IconGIVStream size={24} />
								<GIVRate>
									{formatWeiHelper(
										givBackInfo.flowratePerWeek,
										config.TOKEN_PRECISION,
									)}
								</GIVRate>
								<Lead>GIV/week</Lead>
							</RateRow>
						</>
					)}
					{balanceInfo && (
						<>
							<GIVBoxWithPrice
								amount={balanceInfo.releasedReward}
								price={calcUSD(
									formatWeiHelper(
										balanceInfo.releasedReward,
										config.TOKEN_PRECISION,
									),
								)}
							/>
							<HelpRow alignItems='center'>
								<Caption>
									Added to your GIVstream flowrate
								</Caption>
								<IconHelp
									size={16}
									color={brandColors.deep[100]}
								/>
							</HelpRow>
							{/* <RateRow alignItems='center'>
								<IconGIVStream size={24} />
								<GIVRate>
									{formatWeiHelper(
										balanceInfo.flowratePerWeek,
										config.TOKEN_PRECISION,
									)}
								</GIVRate>
								<Lead>GIV/week</Lead>
							</RateRow> */}
						</>
					)}
					{/* <StyledGivethIcon>
						<IconGIV size={64} />
					</StyledGivethIcon>
					<GIVAmount>{257.9055}</GIVAmount>
					<USDAmount>~${348.74}</USDAmount> */}
					<HarvestButton
						label='HARVEST'
						size='medium'
						buttonType='primary'
						onClick={onHarvest}
					/>
					<CancelButton
						label='CANCEL'
						size='medium'
						buttonType='texty'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</HarvestAllModalContainer>
			)}
			{state === States.Waiting && (
				<WitingModalContainer>
					<Lottie
						options={loadingAnimationOptions}
						height={100}
						width={100}
					/>
					<WaitinMessage weight={700}>
						Please confirm transaction in your wallet
					</WaitinMessage>
					<CancelButton
						label='CANCEL'
						size='medium'
						buttonType='texty'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</WitingModalContainer>
			)}
			{state === States.Confirmed && (
				<ConfirmedModalContainer>
					<Lottie
						options={checkAnimationOptions}
						height={152}
						width={152}
					/>
					<ConfirmedMessage weight={700}>
						Transaction confirmed!
					</ConfirmedMessage>
					<ConfirmedData>
						<CDFirst>Claimed</CDFirst>
						<CDSecond>
							<CDInfo gap='4px'>
								<Lead>{257.9055}</Lead>
								<Lead>GIV</Lead>
							</CDInfo>
							<CDLink>View on Blockscout</CDLink>
						</CDSecond>
					</ConfirmedData>
					<ConfirmedData>
						<CDFirst>Added to GIVsteram</CDFirst>
						<CDSecond>
							<CDInfo gap='4px'>
								<Lead>{9.588}</Lead>
								<Lead>GIV/week</Lead>
							</CDInfo>
							<CDLink>View your GIVstream</CDLink>
						</CDSecond>
					</ConfirmedData>
					<DoneButton
						label='Done'
						size='medium'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</ConfirmedModalContainer>
			)}
		</Modal>
	);
};

interface IGIVBoxWithPriceProps {
	amount: BigNumber;
	price: string;
}

const GIVBoxWithPrice: FC<IGIVBoxWithPriceProps> = ({ amount, price }) => {
	return (
		<>
			<GIVBoxWithPriceContainer alignItems='center'>
				<GIVBoxWithPriceIcon size={40} />
				<GIVBoxWithPriceAmount>
					{formatWeiHelper(amount, config.TOKEN_PRECISION)}
				</GIVBoxWithPriceAmount>
				<GIVBoxWithPriceUSD>~${price}</GIVBoxWithPriceUSD>
			</GIVBoxWithPriceContainer>
		</>
	);
};

const GIVBoxWithPriceContainer = styled(Row)`
	background-color: ${brandColors.giv[500]}66;
	margin: 16px 0;
	border-radius: 8px;
	padding: 24px;
	gap: 8px;
`;

const GIVBoxWithPriceIcon = styled(IconGIV)``;

const GIVBoxWithPriceAmount = styled(Title)`
	margin-left: 8px;
	color: ${neutralColors.gray[100]};
`;

const GIVBoxWithPriceUSD = styled(P)`
	color: ${brandColors.deep[200]};
`;

const HarvestAllModalContainer = styled.div`
	width: 686px;
	padding: 24px;
`;

const HarvestAllModalTitleRow = styled(Row)`
	gap: 14px;
`;

const HarvestAllModalTitle = styled(H6)`
	color: ${neutralColors.gray[100]};
`;

const TitleIcon = styled(IconGIVGarden)``;

const StyledGivethIcon = styled.div`
	margin-top: 48px;
	margin-bottom: 23px;
`;

const GIVAmount = styled(Title)`
	color: ${neutralColors.gray[100]};
`;

const USDAmount = styled(P)`
	margin-bottom: 22px;
	color: ${brandColors.deep[200]};
`;

const HelpRow = styled(Row)`
	gap: 8px;
	margin-bottom: 4px;
`;

const RateRow = styled(Row)`
	gap: 4px;
	margin-bottom: 36px;
`;

const GIVRate = styled(Lead)`
	color: ${neutralColors.gray[100]};
`;

const HarvestButton = styled(Button)`
	display: block;
	width: 316px;
	margin: 0 auto 16px;
`;

const CancelButton = styled(Button)`
	width: 316px;
	margin: 0 auto 8px;
`;

const WitingModalContainer = styled.div`
	width: 546px;
	padding: 24px;
`;

const WaitinMessage = styled(H6)`
	color: ${neutralColors.gray[100]};
	padding: 24px;
	margin-top: 18px;
	margin-bottom: 40px;
`;

const ConfirmedModalContainer = styled.div`
	width: 522px;
	padding: 24px 86px;
`;

const ConfirmedMessage = styled(H6)`
	color: ${neutralColors.gray[100]};
	margin-top: 16px;
`;

const ConfirmedData = styled(Row)`
	margin-top: 32px;
`;

const CDFirst = styled(P)`
	color: ${neutralColors.gray[100]};
	text-align: left;
	flex: 1;
`;

const CDSecond = styled(P)`
	color: ${neutralColors.gray[100]};
	flex: 1;
`;

const CDInfo = styled(Row)`
	div:first-child {
		color: ${neutralColors.gray[100]};
	}
	div:last-child {
		color: ${brandColors.giv[300]};
	}
`;

const CDLink = styled(GLink)`
	text-align: left;
	display: block;
	color: ${brandColors.cyan[500]};
`;

const DoneButton = styled(OulineButton)`
	padding: 16px 135px;
	margin-top: 32px;
`;

export const SPTitle = styled(Row)`
	margin-top: 12px;
	margin-bottom: 24px;
	color: ${neutralColors.gray[100]};
	margin-left: -24px;
`;

export const StakingPoolLabel = styled(H5)``;

export const StakingPoolSubtitle = styled(Caption)``;

export const StakePoolInfoContainer = styled.div`
	padding: 0 24px;
`;
