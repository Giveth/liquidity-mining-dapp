import { FC, useState, useEffect } from 'react';
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
import { ethers } from 'ethers';
import { GIVBoxWithPrice } from '../GIVBoxWithPrice';
import BigNumber from 'bignumber.js';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { useBalances } from '@/context';
import { Zero } from '@ethersproject/constants';

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
}

export const GIVdropHarvestModal: FC<IGIVdropHarvestModal> = ({
	showModal,
	setShowModal,
	claimState,
	network,
	txStatus,
	givdropAmount,
	onClaim,
}) => {
	const [price, setPrice] = useState(0);
	const [givBackLiquidPart, setGivBackLiquidPart] = useState(Zero);
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	const [givDropStream, setGivDropStream] = useState<BigNumber.Value>(0);
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
		const { totalTokens, initialAmount } = tokenDistroHelper;
		if (initialAmount.isZero()) return;

		const rate = totalTokens.div(initialAmount);
		setGivDropStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				givdropAmount.mul(rate),
			),
		);
	}, [givdropAmount, currentBalance, tokenDistroHelper]);

	const calcUSD = (amount: string) => {
		const usd = (parseInt(amount.toString()) * price).toFixed(2);
		return usd;
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			{claimState === ClaimState.UNKNOWN && (
				<HarvestAllModalContainer>
					<HarvestAllModalTitleRow alignItems='center'>
						<HarvestAllModalTitle weight={700}>
							GIVdrop
						</HarvestAllModalTitle>
					</HarvestAllModalTitleRow>
					{givdropAmount && givdropAmount.gt(0) && (
						<>
							<HelpRow alignItems='center'>
								<B>Claimable from GIVdrop</B>
								{/* <IconHelp
									size={16}
									color={brandColors.deep[100]}
								/> */}
							</HelpRow>
							<GIVBoxWithPrice
								amount={givdropAmount}
								price={calcUSD(formatWeiHelper(givdropAmount))}
							/>
							<HelpRow alignItems='center'>
								<Caption>
									Your initial GIVstream flowrate
								</Caption>
								{/* <IconWithTooltip
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
								</IconWithTooltip> */}
							</HelpRow>
							<RateRow alignItems='center'>
								<IconGIVStream size={24} />
								<GIVRate>
									{formatWeiHelper(givDropStream)}
								</GIVRate>
								<Lead>GIV/week</Lead>
							</RateRow>
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
										Increase you GIVstream flowrate when you
										claim liquid rewards!
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
					{!claimableNow.isZero() && (
						<>
							<HelpRow alignItems='center'>
								<B>Claimable from GIVstream</B>
							</HelpRow>
							<GIVBoxWithPrice
								amount={claimableNow.sub(givBackLiquidPart)}
								price={calcUSD(formatWeiHelper(claimableNow))}
							/>
						</>
					)}
					<HarvestAllDesc>
						When you harvest GIV rewards, all liquid GIV allocated
						to you is sent to your wallet.
					</HarvestAllDesc>
					<HarvestButton
						label='HARVEST'
						size='medium'
						buttonType='primary'
						onClick={() => {
							onClaim();
						}}
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
			{claimState === ClaimState.WAITING && (
				<SubmittedInnerModal
					title='Waiting confirmation.'
					walletNetwork={network}
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.SUBMITTING && (
				<SubmittedInnerModal
					title='Submitting transaction.'
					walletNetwork={network}
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.CLAIMED && (
				<ConfirmedInnerModal
					title='Successful transaction.'
					walletNetwork={network}
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.ERROR && (
				<ErrorInnerModal
					title='Something went wrong.'
					walletNetwork={network}
					txHash={txStatus?.hash}
				/>
			)}
		</Modal>
	);
};
