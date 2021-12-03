import React, { FC, useContext, useEffect, useState } from 'react';
import { Modal, IModal } from './Modal';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import CheckAnimation from '../../animations/check.json';
import {
	brandColors,
	Caption,
	IconGIVStream,
	IconHelp,
	Lead,
	B,
} from '@giveth/ui-design-system';
import { BigNumber } from '@ethersproject/bignumber';
import { OnboardContext } from '@/context/onboard.context';
import {
	fetchBalances,
	getGIVPrice,
	getTokenDistroInfo,
} from '@/services/subgraph';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { calcTokenInfo, ITokenInfo } from '@/lib/helpers';
import { formatWeiHelper } from '@/helpers/number';
import config from '@/configuration';
import { TokenBalanceContext } from '@/context/tokenBalance.context';
import { harvestTokens } from '@/lib/stakingPool';
import { claimUnstakeStake } from '@/lib/stakingNFT';
import { useLiquidityPositions } from '@/context';
import { SubmittedInnerModal, ConfirmedInnerModal } from './ConfirmSubmit';
import {
	HarvestAllModalContainer,
	HarvestAllModalTitleRow,
	HarvestAllModalTitle,
	TitleIcon,
	SPTitle,
	StakingPoolLabel,
	StakingPoolSubtitle,
	HelpRow,
	RateRow,
	GIVRate,
	HarvestAllDesc,
	HarvestButton,
	Pending,
	CancelButton,
	GIVBoxWithPriceContainer,
	GIVBoxWithPriceIcon,
	GIVBoxWithPriceAmount,
	GIVBoxWithPriceUSD,
} from './HarvestAll.sc';

interface IHarvestAllModalProps extends IModal {
	title: string;
	poolStakingConfig: PoolStakingConfig;
	claimable: BigNumber;
	network: number;
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

enum HarvestStates {
	HARVEST = 'HARVEST',
	HARVESTING = 'HARVESTING',
	SUBMITTED = 'SUBMITTED',
	CONFIRMED = 'CONFIRMED',
}

export const HarvestAllModal: FC<IHarvestAllModalProps> = ({
	title,
	showModal,
	setShowModal,
	poolStakingConfig,
	claimable,
	network,
}) => {
	const [state, setState] = useState(HarvestStates.HARVEST);
	const [tokenInfo, setTokenInfo] = useState<ITokenInfo>();
	const [givBackInfo, setGivBackInfo] = useState<ITokenInfo>();
	const [balanceInfo, setBalanceInfo] = useState<ITokenInfo>();
	const { tokenDistroBalance } = useContext(TokenBalanceContext);
	const { address, provider } = useContext(OnboardContext);
	const { currentIncentive, stakedPositions } = useLiquidityPositions();
	const [txHash, setTxHash] = useState('');

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

	// useEffect(() => {
	// 	getTokenDistroInfo(network).then(distroInfo => {
	// 		if (distroInfo) {
	// 			const {
	// 				initialAmount,
	// 				totalTokens,
	// 				startTime,
	// 				cliffTime,
	// 				duration,
	// 			} = distroInfo;
	// 			const _balanceInfo = calcTokenInfo(
	// 				initialAmount,
	// 				totalTokens,
	// 				tokenDistroBalance.claimable,
	// 				duration,
	// 				cliffTime,
	// 				startTime,
	// 			);
	// 			setBalanceInfo(_balanceInfo);
	// 		}
	// 	});
	// }, [tokenDistroBalance, network]);

	const onHarvest = () => {
		if (!provider) return;
		setState(HarvestStates.HARVESTING);
		if (poolStakingConfig.hasOwnProperty('NFT_POSITIONS_MANAGER_ADDRESS')) {
			//NFT Harvest
			claimUnstakeStake(
				address,
				provider,
				currentIncentive,
				stakedPositions,
			).then(res => {
				setState(HarvestStates.CONFIRMED);
			});
		} else {
			// LP Harvest
			harvestTokens(poolStakingConfig.LM_ADDRESS, provider)
				.then(txResponse => {
					if (txResponse) {
						setState(HarvestStates.SUBMITTED);
						setTxHash(txResponse.hash);
						txResponse.wait().then(data => {
							const { status } = data;
							console.log('status', status);
							setState(HarvestStates.CONFIRMED);
						});
					} else {
						setState(HarvestStates.HARVEST);
					}
				})
				.catch(err => {
					setState(HarvestStates.HARVEST);
				});
		}
	};

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
			{(state === HarvestStates.HARVEST ||
				state === HarvestStates.HARVESTING) && (
				<HarvestAllModalContainer>
					<HarvestAllModalTitleRow alignItems='center'>
						<HarvestAllModalTitle weight={700}>
							{title}
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
					{tokenDistroBalance && (
						<>
							<GIVBoxWithPrice
								amount={tokenDistroBalance.claimable.sub(
									givBackInfo?.releasedReward || 0,
								)}
								price={calcUSD(
									formatWeiHelper(
										tokenDistroBalance.claimable,
										config.TOKEN_PRECISION,
									),
								)}
							/>
							{/* <HelpRow alignItems='center'>
								<Caption>
									Added to your GIVstream flowrate
								</Caption>
								<IconHelp
									size={16}
									color={brandColors.deep[100]}
								/>
							</HelpRow> */}
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
					<HarvestAllDesc>
						When you claim rewards from GIVbacks, you also claim any
						other liquid GIV allocated to you in the token distro.
					</HarvestAllDesc>
					{state === HarvestStates.HARVEST && (
						<HarvestButton
							label='HARVEST'
							size='medium'
							buttonType='primary'
							onClick={onHarvest}
						/>
					)}
					{state === HarvestStates.HARVESTING && (
						<Pending>
							<Lottie
								options={loadingAnimationOptions}
								height={40}
								width={40}
							/>
							&nbsp;HARVEST PENDING
						</Pending>
					)}
					<CancelButton
						disabled={state !== HarvestStates.HARVEST}
						label='CANCEL'
						size='medium'
						buttonType='texty'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</HarvestAllModalContainer>
			)}
			{state === HarvestStates.SUBMITTED && (
				<HarvestAllModalContainer>
					<SubmittedInnerModal
						title={title}
						walletNetwork={network}
						txHash={txHash}
					/>
				</HarvestAllModalContainer>
			)}
			{state === HarvestStates.CONFIRMED && (
				<HarvestAllModalContainer>
					<ConfirmedInnerModal
						title={title}
						walletNetwork={network}
						txHash={txHash}
					/>
				</HarvestAllModalContainer>
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
