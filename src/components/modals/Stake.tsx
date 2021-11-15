import { FC, useState, useContext, useEffect } from 'react';
import { Modal, IModal } from './Modal';
import {
	neutralColors,
	Button,
	OulineButton,
	B,
	H4,
	H5,
	H6,
	Caption,
	GLink,
	IconExternalLink,
	brandColors,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { PoolStakingConfig } from '../../types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { ethers } from 'ethers';
import { AmountInput } from '../AmountInput';
import {
	approveERC20tokenTransfer,
	stakeTokens,
	wrapToken,
} from '../../lib/stakingPool';
import { OnboardContext } from '../../context/onboard.context';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import TikAnimation from '../../animations/tik.json';
import config from 'src/configuration';

interface IStakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	maxAmount: ethers.BigNumber;
}

enum StakeStates {
	UNKNOWN = 'UNKNOWN',
	APPROVE = 'APPROVE',
	APPROVING = 'APPROVING',
	WRAP = 'WRAP',
	WRAPPING = 'WRAPPING',
	STAKE = 'STAKE',
	STAKING = 'STAKING',
	SUBMITTED = 'SUBMITTED',
	CONFIRMED = 'CONFIRMED',
}

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const tikAnimationOptions = {
	loop: false,
	autoplay: true,
	animationData: TikAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

export const StakeModal: FC<IStakeModalProps> = ({
	poolStakingConfig,
	maxAmount,
	showModal,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [txHash, setTxHash] = useState('');
	const [stakeState, setStakeState] = useState(StakeStates.UNKNOWN);
	const { network: walletNetwork, provider } = useContext(OnboardContext);

	const { title, LM_ADDRESS, POOL_ADDRESS, GARDEN_ADDRESS } =
		poolStakingConfig;

	useEffect(() => {
		if (GARDEN_ADDRESS) {
			setStakeState(StakeStates.APPROVE);
		} else {
			setStakeState(StakeStates.STAKE);
		}
	}, [GARDEN_ADDRESS]);

	useEffect(() => {
		if (stakeState == StakeStates.WRAP) {
			setStakeState(StakeStates.APPROVE);
		}
	}, [amount]);

	const onApprove = async () => {
		if (amount === '0') return;
		if (!provider) {
			console.error('Provider is null');
			return;
		}
		if (!GARDEN_ADDRESS) {
			console.error('GARDEN_ADDRESS is null');
			return;
		}

		setStakeState(StakeStates.APPROVING);

		const signer = provider.getSigner();

		const userAddress = await signer.getAddress();

		const isApproved = await approveERC20tokenTransfer(
			amount,
			userAddress,
			GARDEN_ADDRESS,
			POOL_ADDRESS,
			provider,
		);

		if (isApproved) {
			setStakeState(StakeStates.WRAP);
		} else {
			setStakeState(StakeStates.APPROVE);
		}
	};

	const onStake = () => {
		setStakeState(StakeStates.STAKING);
		stakeTokens(amount, POOL_ADDRESS, LM_ADDRESS, provider)
			.then(txResponse => {
				if (txResponse) {
					setStakeState(StakeStates.SUBMITTED);
					if (txResponse) {
						txResponse.wait().then(data => {
							const { status } = data;
							console.log('status', status);
							setStakeState(StakeStates.CONFIRMED);
						});
					}
				} else {
					setStakeState(StakeStates.STAKE);
				}
			})
			.catch(err => {
				setStakeState(StakeStates.STAKE);
			});
	};

	const onWrap = () => {
		if (!GARDEN_ADDRESS) {
			console.error('GARDEN_ADDRESS is null');
			return;
		}
		setStakeState(StakeStates.WRAPPING);
		wrapToken(amount, POOL_ADDRESS, GARDEN_ADDRESS, provider)
			.then(txResponse => {
				if (txResponse) {
					setTxHash(txResponse.hash);
					setStakeState(StakeStates.SUBMITTED);
					if (txResponse) {
						txResponse.wait().then(data => {
							const { status } = data;
							console.log('data', data);
							setStakeState(StakeStates.CONFIRMED);
						});
					}
				} else {
					setStakeState(StakeStates.WRAP);
				}
			})
			.catch(err => {
				setStakeState(StakeStates.WRAP);
			});
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<StakeModalContainer>
				{stakeState !== StakeStates.SUBMITTED &&
					stakeState !== StakeStates.CONFIRMED && (
						<>
							<StakeModalTitle alignItems='center'>
								<StakingPoolImages title={title} />
								<StakeModalTitleText weight={700}>
									Stake
								</StakeModalTitleText>
							</StakeModalTitle>
							<InnerModal>
								<AmountInput
									setAmount={setAmount}
									maxAmount={maxAmount}
									poolStakingConfig={poolStakingConfig}
									disabled={
										!(
											stakeState ===
												StakeStates.APPROVE ||
											stakeState === StakeStates.STAKE
										)
									}
								/>
								{stakeState === StakeStates.APPROVE && (
									<ConfirmButton
										label={'APPROVE'}
										onClick={onApprove}
										disabled={
											amount == '0' ||
											maxAmount.lt(amount)
										}
									/>
								)}
								{stakeState === StakeStates.APPROVING && (
									<Pending>APPROVE PENDING</Pending>
								)}
								{stakeState === StakeStates.WRAP && (
									<ConfirmButton
										label={'WRAP'}
										onClick={onWrap}
										disabled={
											amount == '0' ||
											maxAmount.lt(amount)
										}
									/>
								)}
								{stakeState === StakeStates.WRAPPING && (
									<Pending>WRAP PENDING</Pending>
								)}
								{stakeState === StakeStates.STAKE && (
									<ConfirmButton
										label={'STAKE'}
										onClick={onStake}
										disabled={
											amount == '0' ||
											maxAmount.lt(amount)
										}
									/>
								)}
								{stakeState === StakeStates.STAKING && (
									<Pending>STAKE PENDING</Pending>
								)}
								<CancelButton
									buttonType='texty'
									label='CANCEL'
									onClick={() => {
										setShowModal(false);
									}}
								/>
							</InnerModal>
						</>
					)}
				{stakeState === StakeStates.SUBMITTED && (
					<>
						<Caption>{title}</Caption>
						<Lottie
							options={loadingAnimationOptions}
							height={100}
							width={100}
						/>
						<TxSubmit weight={700}>Transaction submitted</TxSubmit>
						<BlockExplorerLink
							href={`${
								walletNetwork === config.MAINNET_NETWORK_NUMBER
									? config.MAINNET_NETWORK.blockExplorerUrls
									: config.XDAI_NETWORK.blockExplorerUrls
							}
							/tx/${txHash}`}
							target='_blank'
							size='Big'
						>
							View on Blockscout&nbsp;
							<IconExternalLink
								size={16}
								color={'currentColor'}
							/>
						</BlockExplorerLink>
					</>
				)}
				{stakeState === StakeStates.CONFIRMED && (
					<>
						<B>{title}</B>
						<Lottie
							options={tikAnimationOptions}
							height={100}
							width={100}
						/>
						<TxConfirm weight={700}>
							Transaction confirmed!
						</TxConfirm>
						<BlockExplorerLink
							href={`${
								walletNetwork === config.MAINNET_NETWORK_NUMBER
									? config.MAINNET_NETWORK.blockExplorerUrls
									: config.XDAI_NETWORK.blockExplorerUrls
							}
							/tx/${txHash}`}
							target='_blank'
							size='Big'
						>
							View on Blockscout&nbsp;
							<IconExternalLink
								size={16}
								color={'currentColor'}
							/>
						</BlockExplorerLink>
					</>
				)}
			</StakeModalContainer>
		</Modal>
	);
};

const StakeModalContainer = styled.div`
	width: 370px;
	padding: 24px 0;
`;

const StakeModalTitle = styled(Row)`
	margin-bottom: 42px;
`;

const StakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
`;

const InnerModal = styled.div`
	padding: 0 24px;
`;

const ConfirmButton = styled(OulineButton)`
	width: 100%;
	margin-top: 32px;
	margin-bottom: 8px;
`;

const Pending = styled.div`
	margin-top: 32px;
	margin-bottom: 8px;
	line-height: 50px;
	height: 50px;
`;

const TxSubmit = styled(H6)`
	color: ${neutralColors.gray[100]};
	margin-top: 18px;
	margin-bottom: 16px;
`;

const TxConfirm = styled(H5)`
	color: ${neutralColors.gray[100]};
	margin-top: 18px;
	margin-bottom: 16px;
`;

const BlockExplorerLink = styled(GLink)`
	width: 100%;
	color: ${brandColors.cyan[500]};
	&:hover {
		color: ${brandColors.cyan[300]};
	}
`;

const CancelButton = styled(Button)`
	width: 100%;
`;
