import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { IModal, Modal } from './Modal';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
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
	TooltipContent,
} from './HarvestAll.sc';
import { formatWeiHelper } from '@/helpers/number';
import {
	B,
	IconHelp,
	brandColors,
	Caption,
	IconGIVStream,
	Lead,
} from '@giveth/ui-design-system';
import { IconWithTooltip } from '../IconWithToolTip';
import { ethers, constants } from 'ethers';
import { GIVBoxWithPrice } from '../GIVBoxWithPrice';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { useBalances } from '@/context';
import { Zero } from '@ethersproject/constants';
import BigNumber from 'bignumber.js';
import Lottie from 'react-lottie';
import LoadingAnimation from '@/animations/loading.json';

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

enum ClaimState {
	UNKNOWN,
	WAITING,
	SUBMITTING,
	CLAIMED,
	ERROR,
}

interface IGIVdropHarvestModal extends IModal {
	claimState: ClaimState;
	network: number;
	txStatus: any;
	givdropAmount: ethers.BigNumber;
	onClaim: any;
	setClaimState: Dispatch<SetStateAction<ClaimState>>;
}

export const GIVdropHarvestModal: FC<IGIVdropHarvestModal> = ({
	showModal,
	setShowModal,
	claimState,
	setClaimState,
	network,
	txStatus,
	givdropAmount,
	onClaim,
}) => {
	const [price, setPrice] = useState(0);
	const [givBackLiquidPart, setGivBackLiquidPart] = useState(Zero);
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	const [givDropStream, setGivDropStream] = useState<BigNumber.Value>(0);
	const [givDropAccStream, setGivDropAccStream] = useState<ethers.BigNumber>(
		constants.Zero,
	);
	const [claimableNow, setClaimableNow] = useState(Zero);
	const { tokenDistroHelper } = useTokenDistro();
	const { currentBalance } = useBalances();

	useEffect(() => {
		setClaimableNow(tokenDistroHelper.getUserClaimableNow(currentBalance));
		setGivBackLiquidPart(
			tokenDistroHelper.getLiquidPart(currentBalance.givback),
		);
		setGivBackStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(currentBalance.givback),
		);
	}, [currentBalance, tokenDistroHelper]);

	useEffect(() => {
		setGivDropStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(givdropAmount),
		);
		const amount = new BigNumber(givdropAmount.mul(9).div(10).toString());
		const percent = new BigNumber(tokenDistroHelper.percent / 100);
		const givDropAcc = amount
			.times(percent)
			.toFixed(0, BigNumber.ROUND_DOWN);
		let _givDropAcc = ethers.BigNumber.from(givDropAcc);
		if (!claimableNow.isZero()) {
			_givDropAcc = _givDropAcc.add(claimableNow).sub(givBackLiquidPart);
		}
		setGivDropAccStream(_givDropAcc);
	}, [givdropAmount, currentBalance, tokenDistroHelper]);

	const calcUSD = (amount: string) => {
		const usd = (parseInt(amount.toString()) * price).toFixed(2);
		return usd;
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<HarvestAllModalContainer>
				{(claimState === ClaimState.UNKNOWN ||
					claimState === ClaimState.WAITING) && (
					<>
						<HarvestAllModalTitleRow alignItems='center'>
							<HarvestAllModalTitle weight={700}>
								GIVdrop
							</HarvestAllModalTitle>
						</HarvestAllModalTitleRow>
						{givdropAmount && givdropAmount.gt(0) && (
							<>
								<HelpRow alignItems='center'>
									<B>Claimable from GIVdrop</B>
								</HelpRow>
								<GIVBoxWithPrice
									amount={givdropAmount.div(10)}
									price={calcUSD(
										formatWeiHelper(givdropAmount.div(10)),
									)}
								/>
								<HelpRow alignItems='center'>
									<Caption>
										Your initial GIVstream flowrate
									</Caption>
								</HelpRow>
								<RateRow alignItems='center'>
									<IconGIVStream size={24} />
									<GIVRate>
										{formatWeiHelper(givDropStream)}
									</GIVRate>
									<Lead>GIV/week</Lead>
								</RateRow>
								<HelpRow alignItems='center'>
									<B>Claimable from GIVstream</B>
								</HelpRow>
								<GIVBoxWithPrice
									amount={givDropAccStream}
									price={calcUSD(
										formatWeiHelper(givDropAccStream),
									)}
								/>
							</>
						)}
						{!currentBalance.givback.isZero() && (
							<>
								<HelpRow alignItems='center'>
									<B>Claimable from GIVbacks</B>
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
											Increase you GIVstream flowrate when
											you claim liquid rewards!
										</TooltipContent>
									</IconWithTooltip>
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
						<HarvestAllDesc>
							When you harvest GIV rewards, all liquid GIV
							allocated to you is sent to your wallet.
						</HarvestAllDesc>
						{claimState === ClaimState.WAITING ? (
							<Pending>
								<Lottie
									options={loadingAnimationOptions}
									height={40}
									width={40}
								/>
								&nbsp;HARVEST PENDING
							</Pending>
						) : (
							<HarvestButton
								label='HARVEST'
								size='medium'
								buttonType='primary'
								onClick={() => {
									onClaim();
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
							disabled={claimState === ClaimState.WAITING}
						/>
					</>
				)}
				{claimState === ClaimState.SUBMITTING && (
					<SubmittedInnerModal
						title='GIV'
						walletNetwork={network}
						txHash={txStatus?.hash}
					/>
				)}
				{claimState === ClaimState.CLAIMED && (
					<ConfirmedInnerModal
						title='GIV'
						walletNetwork={network}
						txHash={txStatus?.hash}
					/>
				)}
				{claimState === ClaimState.ERROR && (
					<>
						{' '}
						<ErrorInnerModal
							title='GIV'
							walletNetwork={network}
							txHash={txStatus?.hash}
						/>
						<CancelButton
							label='CLOSE'
							size='medium'
							buttonType='texty'
							onClick={() => {
								setShowModal(false);
								setClaimState(ClaimState.UNKNOWN);
							}}
						/>
					</>
				)}
			</HarvestAllModalContainer>
		</Modal>
	);
};
