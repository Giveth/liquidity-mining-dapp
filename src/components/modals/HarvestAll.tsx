import React, { FC, useContext, useEffect, useState } from 'react';
import { IModal, Modal } from './Modal';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import CheckAnimation from '../../animations/check.json';
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
	GIVBoxWithPriceAmount,
	GIVBoxWithPriceContainer,
	GIVBoxWithPriceIcon,
	GIVBoxWithPriceUSD,
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
	TitleIcon,
} from './HarvestAll.sc';
import { Zero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

interface IHarvestAllModalProps extends IModal {
	title: string;
	poolStakingConfig: PoolStakingConfig;
	claimable: ethers.BigNumber;
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
	const { currentBalance } = useBalances();
	const { tokenDistroMock } = useTokenDistro();
	const { address, provider } = useContext(OnboardContext);
	const { currentIncentive, stakedPositions } = useLiquidityPositions();
	const [txHash, setTxHash] = useState('');

	const [price, setPrice] = useState(0);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const [claimableNow, setClaimableNow] = useState(Zero);
	const [givBackLiquidPart, setGivBackLiquidPart] = useState(Zero);
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);

	useEffect(() => {
		setRewardLiquidPart(tokenDistroMock.getLiquidPart(claimable));
		setRewardStream(tokenDistroMock.getStreamPartTokenPerWeek(claimable));
		setClaimableNow(tokenDistroMock.getUserClaimableNow(currentBalance));
		setGivBackLiquidPart(
			tokenDistroMock.getLiquidPart(currentBalance.givback),
		);
		setGivBackStream(
			tokenDistroMock.getStreamPartTokenPerWeek(currentBalance.givback),
		);
	}, [claimable, currentBalance, tokenDistroMock]);

	useEffect(() => {
		getGIVPrice(network).then(price => {
			setPrice(price);
		});
	}, [network]);

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

	console.log(`state`, state);

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
					{claimable.gt(0) && (
						<>
							<GIVBoxWithPrice
								amount={rewardLiquidPart}
								price={calcUSD(
									formatWeiHelper(rewardLiquidPart),
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
									{formatWeiHelper(rewardStream)}
								</GIVRate>
								<Lead>GIV/week</Lead>
							</RateRow>
						</>
					)}
					{currentBalance.givback.gt(0) && (
						<>
							<HelpRow alignItems='center'>
								<B>Claimable from GIVbacks</B>
								<IconHelp
									size={16}
									color={brandColors.deep[100]}
								/>
							</HelpRow>
							<GIVBoxWithPrice
								amount={givBackLiquidPart}
								price={calcUSD(
									formatWeiHelper(givBackLiquidPart),
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
									{formatWeiHelper(givBackStream)}
								</GIVRate>
								<Lead>GIV/week</Lead>
							</RateRow>
						</>
					)}
					{!claimableNow.isZero() && (
						<>
							<GIVBoxWithPrice
								amount={claimableNow.sub(givBackLiquidPart)}
								price={calcUSD(formatWeiHelper(claimableNow))}
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
	amount: ethers.BigNumber;
	price: string;
}

const GIVBoxWithPrice: FC<IGIVBoxWithPriceProps> = ({ amount, price }) => {
	return (
		<>
			<GIVBoxWithPriceContainer alignItems='center'>
				<GIVBoxWithPriceIcon size={40} />
				<GIVBoxWithPriceAmount>
					{formatWeiHelper(amount)}
				</GIVBoxWithPriceAmount>
				<GIVBoxWithPriceUSD>~${price}</GIVBoxWithPriceUSD>
			</GIVBoxWithPriceContainer>
		</>
	);
};
