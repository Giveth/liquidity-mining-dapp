import { FC, useState } from 'react';
import { Modal, IModal } from './Modal';
import {
	neutralColors,
	brandColors,
	Button,
	Caption,
	H4,
	Overline,
	B,
	IconHelp,
	IconGIVStream,
	Lead,
} from '@giveth/ui-design-system';
import {
	CancelButton,
	HarvestButton,
	HelpRow,
	Pending,
	RateRow,
	GIVRate,
	TooltipContent,
	StyledScrollbars,
} from './HarvestAll.sc';
import Lottie from 'react-lottie';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import V3StakingCard from '../cards/PositionCard';
import { useLiquidityPositions, useOnboard, useSubgraph } from '@/context';
import { GIVBoxWithPrice } from '../GIVBoxWithPrice';
import { IconWithTooltip } from '../IconWithToolTip';
import LoadingAnimation from '@/animations/loading.json';
import { transfer, exit, getReward } from '@/lib/stakingNFT';
import { ethers, BigNumber, constants, utils } from 'ethers';
import {
	ConfirmedInnerModal,
	SubmittedInnerModal,
	ErrorInnerModal,
} from './ConfirmSubmit';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { formatWeiHelper } from '@/helpers/number';
import { getUniswapV3StakerContract } from '@/lib/contracts';
import { Scrollbars } from 'react-custom-scrollbars';

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

export enum StakeState {
	UNKNOWN,
	UNSTAKING,
	CONFIRM_UNSTAKE,
	CONFIRMING,
	CONFIRMED,
	REJECT,
	SUBMITTING,
	ERROR,
}

interface IV3StakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	isUnstakingModal?: boolean;
}

export const V3StakeModal: FC<IV3StakeModalProps> = ({
	poolStakingConfig,
	isUnstakingModal,
	showModal,
	setShowModal,
}) => {
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { tokenDistroHelper } = useTokenDistro();
	const { network, provider, address } = useOnboard();
	const {
		unstakedPositions,
		stakedPositions,
		currentIncentive,
		loadPositions,
	} = useLiquidityPositions();
	const positions = isUnstakingModal ? stakedPositions : unstakedPositions;
	const { title } = poolStakingConfig;
	const [stakeStatus, setStakeStatus] = useState<StakeState>(
		StakeState.UNKNOWN,
	);
	const [txStatus, setTxStatus] = useState<any>();
	const [tokenIdState, setTokenId] = useState<number>(0);
	const [reward, setReward] = useState<BigNumber>(constants.Zero);
	const [stream, setStream] = useState<BigNumber>(constants.Zero);
	const [claimableNow, setClaimableNow] = useState<BigNumber>(constants.Zero);
	const [givBackLiquidPart, setGivBackLiquidPart] = useState<BigNumber>(
		constants.Zero,
	);

	const handleStakeUnstake = async (tokenId: number) => {
		if (!provider) return;

		if (!isUnstakingModal) {
			setStakeStatus(StakeState.CONFIRMING);
			setTokenId(tokenId);
		} else {
			setStakeStatus(StakeState.CONFIRM_UNSTAKE);
		}

		const tx = isUnstakingModal
			? await exit(
					tokenIdState,
					address,
					provider,
					currentIncentive,
					setStakeStatus,
			  )
			: await transfer(
					tokenId,
					address,
					provider,
					currentIncentive,
					setStakeStatus,
			  );
		setTxStatus(tx);
		try {
			const { status } = await tx.wait();
			if (status) {
				setStakeStatus(StakeState.CONFIRMED);
			} else {
				setStakeStatus(StakeState.ERROR);
			}
			loadPositions();
		} catch {
			setStakeStatus(StakeState.UNKNOWN);
		}
	};

	const handleAction = async (tokenId: number) => {
		const uniswapV3StakerContract = getUniswapV3StakerContract(provider);
		if (!provider || !uniswapV3StakerContract) return;

		const _reward = await getReward(
			tokenId,
			uniswapV3StakerContract,
			currentIncentive.key,
		);

		const liquidReward = tokenDistroHelper.getLiquidPart(_reward);
		const streamPerWeek =
			tokenDistroHelper.getStreamPartTokenPerWeek(_reward);
		setTokenId(tokenId);
		setReward(liquidReward);
		setStream(BigNumber.from(streamPerWeek.toFixed(0)));
		setClaimableNow(tokenDistroHelper.getUserClaimableNow(balances));
		setGivBackLiquidPart(tokenDistroHelper.getLiquidPart(balances.givback));
		setStakeStatus(StakeState.UNSTAKING);
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<StakeModalContainer>
				{(stakeStatus === StakeState.UNKNOWN ||
					stakeStatus === StakeState.CONFIRMING ||
					stakeStatus === StakeState.UNSTAKING ||
					stakeStatus === StakeState.CONFIRM_UNSTAKE) && (
					<StakeModalTitle alignItems='center'>
						<StakingPoolImages title={title} />
						<StakeModalTitleText weight={700}>
							{title}
						</StakeModalTitleText>
					</StakeModalTitle>
				)}
				{(stakeStatus === StakeState.UNKNOWN ||
					stakeStatus === StakeState.CONFIRMING) && (
					<StyledScrollbars
						autoHeight
						autoHeightMin={'20Vh'}
						autoHeightMax={'70Vh'}
					>
						<InnerModalPositions>
							{positions.map(position => (
								<V3StakingCard
									key={position.tokenId.toString()}
									position={position}
									isUnstaking={isUnstakingModal}
									handleAction={
										isUnstakingModal
											? handleAction
											: handleStakeUnstake
									}
									isConfirming={
										stakeStatus === StakeState.CONFIRMING
									}
									selectedPosition={
										position.tokenId === tokenIdState
									}
								/>
							))}
						</InnerModalPositions>
					</StyledScrollbars>
				)}
				{(stakeStatus === StakeState.UNSTAKING ||
					stakeStatus === StakeState.CONFIRM_UNSTAKE) && (
					<Scrollbars
						autoHeight
						autoHeightMin={'20Vh'}
						autoHeightMax={'70Vh'}
					>
						<HarvestContainer>
							<HelpRow alignItems='center'>
								<Caption>Rewards earned by your NFT</Caption>
								<IconWithTooltip
									icon={
										<IconHelp
											size={16}
											color={brandColors.deep[100]}
										/>
									}
									direction={'top'}
								>
									<TooltipContent>
										When you unstake an NFT from this pool,
										you also harvest any corresponding
										rewards
									</TooltipContent>
								</IconWithTooltip>
							</HelpRow>
							<GIVBoxWithPrice amount={reward} />
							<HelpRow alignItems='center'>
								<Caption>
									Added to your GIVstream flowrate
								</Caption>
								<IconWithTooltip
									icon={
										<IconHelp
											size={16}
											color={brandColors.deep[100]}
										/>
									}
									direction={'top'}
								>
									<TooltipContent>
										Increase you GIVstream flowrate when you
										claim liquid rewards!
									</TooltipContent>
								</IconWithTooltip>
							</HelpRow>
							<RateRow alignItems='center'>
								<IconGIVStream size={24} />
								<GIVRate>{formatWeiHelper(stream)}</GIVRate>
								<Lead>GIV/week</Lead>
							</RateRow>
							<HelpRow alignItems='center'>
								<B>Claimable from GIVstream</B>
							</HelpRow>
							<GIVBoxWithPrice
								amount={claimableNow.sub(givBackLiquidPart)}
							/>
							<HarvestButtonContainer>
								{stakeStatus === StakeState.CONFIRM_UNSTAKE ? (
									<Pending>
										<Lottie
											options={loadingAnimationOptions}
											height={40}
											width={40}
										/>
										&nbsp; PENDING
									</Pending>
								) : (
									<HarvestButton
										label='UNSTAKE &amp; HARVEST'
										size='medium'
										buttonType='primary'
										onClick={() => {
											handleStakeUnstake(0);
										}}
									/>
								)}
								<CancelButton
									label='CANCEL'
									size='medium'
									buttonType='texty'
									onClick={() => {
										setShowModal(false);
									}}
									// disabled={claimState === ClaimState.WAITING}
								/>
							</HarvestButtonContainer>
						</HarvestContainer>
					</Scrollbars>
				)}
				<InnerModalStates>
					{stakeStatus === StakeState.REJECT && (
						<ErrorInnerModal
							title='You rejected the transaction.'
							walletNetwork={network}
							txHash={txStatus?.hash}
						/>
					)}
					{stakeStatus === StakeState.SUBMITTING && (
						<SubmittedInnerModal
							title={title}
							walletNetwork={network}
							txHash={txStatus?.hash}
						/>
					)}
					{stakeStatus === StakeState.CONFIRMED && (
						<ConfirmedInnerModal
							title='Successful transaction.'
							walletNetwork={network}
							txHash={txStatus?.hash}
						/>
					)}
					{stakeStatus === StakeState.ERROR && (
						<ErrorInnerModal
							title='Something went wrong!'
							walletNetwork={network}
							txHash={txStatus?.hash}
						/>
					)}
				</InnerModalStates>
			</StakeModalContainer>
		</Modal>
	);
};

const StakeModalContainer = styled.div`
	padding: 24px 0;
`;

const StakeModalTitle = styled(Row)`
	margin-bottom: 42px;
`;

const StakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
`;

const InnerModalPositions = styled.div`
	width: 630px;
	display: flex;
	flex-direction: column;
	padding: 24px;
	gap: 36px;
`;

const InnerModalStates = styled.div`
	width: 370px;
`;

export const PositionContainer = styled.div`
	display: flex;
	justify-content: space-between;
	border-radius: 8px;
	padding: 12px 24px;
	background: ${brandColors.giv[400]};
	color: ${neutralColors.gray[100]};
`;

export const PositionInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: ${neutralColors.gray[100]};
`;

export const PositionInfoRow = styled(Row)`
	align-items: center;
	gap: 8px;
`;

export const TokenAmountRow = styled(Row)`
	align-items: center;
	gap: 4px;
`;

export const StyledOverline = styled(Overline)`
	color: ${brandColors.deep[100]};
`;

const RoundedInfo = styled.div`
	background: ${brandColors.giv[600]};
	border-radius: 28px;
	font-weight: bold;
	padding: 4px 10px;
`;

export const TokenValue = styled(B)``;

export const PositionActions = styled.div`
	display: flex;
	width: 180px;
	flex-direction: column;
	gap: 12px;
`;

export const FullWidthButton = styled(Button)`
	width: 100%;
`;

export const HarvestContainer = styled.div`
	margin: auto;
	padding: 0 24px;
	width: 630px;
`;

export const HarvestButtonContainer = styled.div`
	margin-top: 36px;
`;
