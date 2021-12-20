import React, { FC, useContext, useEffect, useState } from 'react';
import { IModal, Modal } from './Modal';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import {
	B,
	brandColors,
	Caption,
	IconGIVStream,
	IconHelp,
	Lead,
} from '@giveth/ui-design-system';
import { OnboardContext } from '@/context/onboard.context';
import { getGIVPrice } from '@/services/subgraph';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { formatWeiHelper } from '@/helpers/number';
import { useBalances } from '@/context/balance.context';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { harvestTokens } from '@/lib/stakingPool';
import { claimUnstakeStake } from '@/lib/stakingNFT';
import { useLiquidityPositions } from '@/context';
import { ConfirmedInnerModal, SubmittedInnerModal } from './ConfirmSubmit';
import {
	CancelButton,
	GIVRate,
	HarvestAllDesc,
	HarvestAllModalContainer,
	HarvestAllModalTitle,
	HarvestAllModalTitleRow,
	HarvestButton,
	HelpRow,
	Pending,
	RateRow,
	SPTitle,
	StakingPoolLabel,
	StakingPoolSubtitle,
	NothingToHarvest,
	TooltipContent,
	StyledScrollbars,
	HarvestBoxes,
} from './HarvestAll.sc';
import { Zero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { claimReward } from '@/lib/claim';
import config from '@/configuration';
import { IconWithTooltip } from '../IconWithToolTip';
import { GIVBoxWithPrice } from '../GIVBoxWithPrice';

interface IHarvestAllModalProps extends IModal {
	title: string;
	poolStakingConfig?: PoolStakingConfig;
	claimable?: ethers.BigNumber;
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
	const { currentBalance } = useBalances();
	const { tokenDistroHelper } = useTokenDistro();
	const {
		network: walletNetwork,
		address,
		provider,
	} = useContext(OnboardContext);
	const { currentIncentive, stakedPositions } = useLiquidityPositions();
	const [txHash, setTxHash] = useState('');

	const [price, setPrice] = useState(0);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const [claimableNow, setClaimableNow] = useState(Zero);
	const [givBackLiquidPart, setGivBackLiquidPart] = useState(Zero);
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	const [sum, setSum] = useState(Zero);

	useEffect(() => {
		if (claimable) {
			setRewardLiquidPart(tokenDistroHelper.getLiquidPart(claimable));
			setRewardStream(
				tokenDistroHelper.getStreamPartTokenPerWeek(claimable),
			);
		}
		setClaimableNow(tokenDistroHelper.getUserClaimableNow(currentBalance));
		setGivBackLiquidPart(
			tokenDistroHelper.getLiquidPart(currentBalance.givback),
		);
		setGivBackStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(currentBalance.givback),
		);
	}, [claimable, currentBalance, tokenDistroHelper]);

	useEffect(() => {
		let _sum = rewardLiquidPart.add(givBackLiquidPart);
		if (claimableNow) {
			_sum = _sum.add(claimableNow);
		}
		if (_sum.isZero()) {
		} else {
			setSum(_sum);
		}
	}, [rewardLiquidPart, givBackLiquidPart, claimableNow]);

	useEffect(() => {
		getGIVPrice(network).then(price => {
			setPrice(price);
		});
	}, [network]);

	const onHarvest = () => {
		if (!provider) return;
		setState(HarvestStates.HARVESTING);
		if (poolStakingConfig) {
			if (
				poolStakingConfig.hasOwnProperty(
					'NFT_POSITIONS_MANAGER_ADDRESS',
				)
			) {
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
		} else {
			claimReward(
				config.NETWORKS_CONFIG[network]?.TOKEN_DISTRO_ADDRESS,
				provider,
			)
				.then(txResponse => {
					if (txResponse) {
						setState(HarvestStates.SUBMITTED);
						setTxHash(txResponse.hash);
						txResponse.wait().then(data => {
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
			<>
				{(state === HarvestStates.HARVEST ||
					state === HarvestStates.HARVESTING) &&
					(sum.isZero() ? (
						<HarvestAllModalContainer>
							<HarvestAllModalTitleRow alignItems='center'>
								<HarvestAllModalTitle weight={700}>
									{title}
								</HarvestAllModalTitle>
							</HarvestAllModalTitleRow>
							<NothingToHarvest>
								You have nothing to claim
							</NothingToHarvest>
							<CancelButton
								disabled={state !== HarvestStates.HARVEST}
								label='OK'
								size='large'
								onClick={() => {
									setShowModal(false);
								}}
							/>
						</HarvestAllModalContainer>
					) : (
						<HarvestAllModalContainer>
							<HarvestAllModalTitleRow alignItems='center'>
								<HarvestAllModalTitle weight={700}>
									{title}
								</HarvestAllModalTitle>
								{/* <TitleIcon size={24} /> */}
							</HarvestAllModalTitleRow>
							<StyledScrollbars
								autoHeight
								autoHeightMin={'20Vh'}
								autoHeightMax={'70Vh'}
							>
								<HarvestBoxes>
									{poolStakingConfig && (
										<SPTitle alignItems='center' gap='16px'>
											<StakingPoolImages
												title={poolStakingConfig.title}
											/>
											<div>
												<StakingPoolLabel weight={900}>
													{poolStakingConfig.title}
												</StakingPoolLabel>
												<StakingPoolSubtitle>
													{
														poolStakingConfig.description
													}
												</StakingPoolSubtitle>
											</div>
										</SPTitle>
									)}
									{claimable && claimable.gt(0) && (
										<>
											<GIVBoxWithPrice
												amount={rewardLiquidPart}
												price={calcUSD(
													formatWeiHelper(
														rewardLiquidPart,
													),
												)}
											/>
											<HelpRow alignItems='center'>
												<Caption>
													Added to your GIVstream
													flowrate
												</Caption>
												<IconWithTooltip
													icon={
														<IconHelp
															size={16}
															color={
																brandColors
																	.deep[100]
															}
														/>
													}
													direction={'top'}
												>
													<TooltipContent>
														Increase you GIVstream
														flowrate when you claim
														liquid rewards!
													</TooltipContent>
												</IconWithTooltip>
											</HelpRow>
											<RateRow alignItems='center'>
												<IconGIVStream size={24} />
												<GIVRate>
													{formatWeiHelper(
														rewardStream,
													)}
												</GIVRate>
												<Lead>GIV/week</Lead>
											</RateRow>
										</>
									)}
									{currentBalance.givback.gt(0) && (
										<>
											<HelpRow alignItems='center'>
												<B>Claimable from GIVbacks</B>
											</HelpRow>
											<GIVBoxWithPrice
												amount={givBackLiquidPart}
												price={calcUSD(
													formatWeiHelper(
														givBackLiquidPart,
													),
												)}
											/>
											<HelpRow alignItems='center'>
												<Caption>
													Added to your GIVstream
													flowrate
												</Caption>
												<IconWithTooltip
													icon={
														<IconHelp
															size={16}
															color={
																brandColors
																	.deep[100]
															}
														/>
													}
													direction={'top'}
												>
													<TooltipContent>
														Increase you GIVstream
														flowrate when you claim
														liquid rewards!
													</TooltipContent>
												</IconWithTooltip>
											</HelpRow>
											<RateRow alignItems='center'>
												<IconGIVStream size={24} />
												<GIVRate>
													{formatWeiHelper(
														givBackStream,
													)}
												</GIVRate>
												<Lead>GIV/week</Lead>
											</RateRow>
										</>
									)}
									{!claimableNow.isZero() && (
										<>
											<HelpRow alignItems='center'>
												<B>Claimable from GIVstream</B>
											</HelpRow>
											<GIVBoxWithPrice
												amount={claimableNow.sub(
													givBackLiquidPart,
												)}
												price={calcUSD(
													formatWeiHelper(
														claimableNow,
													),
												)}
											/>
										</>
									)}
									<HarvestAllDesc>
										When you harvest GIV rewards, all liquid
										GIV allocated to you is sent to your
										wallet.
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
												options={
													loadingAnimationOptions
												}
												height={40}
												width={40}
											/>
											&nbsp;HARVEST PENDING
										</Pending>
									)}
									<CancelButton
										disabled={
											state !== HarvestStates.HARVEST
										}
										label='CANCEL'
										size='medium'
										buttonType='texty'
										onClick={() => {
											setShowModal(false);
										}}
									/>
								</HarvestBoxes>
							</StyledScrollbars>
						</HarvestAllModalContainer>
					))}
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
			</>
		</Modal>
	);
};
