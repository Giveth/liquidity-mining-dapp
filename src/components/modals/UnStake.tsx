import { FC, useState, useContext } from 'react';
import Lottie from 'react-lottie';
import { Modal, IModal } from './Modal';
import { neutralColors, Button, H4 } from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { PoolStakingConfig } from '../../types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { BigNumber } from 'ethers';
import { AmountInput } from '../AmountInput';
import { unwrapToken, withdrawTokens } from '../../lib/stakingPool';
import { OnboardContext } from '../../context/onboard.context';
import LoadingAnimation from '@/animations/loading.json';

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};
interface IUnStakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	maxAmount: BigNumber;
}

export const UnStakeModal: FC<IUnStakeModalProps> = ({
	poolStakingConfig,
	maxAmount,
	showModal,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [label, setLabel] = useState('UNSTAKE');
	const { provider } = useContext(OnboardContext);

	const { title, LM_ADDRESS, GARDEN_ADDRESS } = poolStakingConfig;

	const onWithdraw = () => {
		console.log('onApprove called');
		setLabel('PENDING UNSTAKE');
		const promise = GARDEN_ADDRESS
			? unwrapToken(amount, GARDEN_ADDRESS, provider)
			: withdrawTokens(amount, LM_ADDRESS, provider);
		promise
			.then(data => {
				console.log('data: ', data);
				if (data) {
					setShowModal(false);
				} else {
					setLabel('UNSTAKE');
				}
			})
			.catch(err => {
				setLabel('UNSTAKE');
			});
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<UnStakeModalContainer>
				<UnStakeModalTitle alignItems='center'>
					<StakingPoolImages title={title} />
					<UnStakeModalTitleText weight={700}>
						Unstake
					</UnStakeModalTitleText>
				</UnStakeModalTitle>
				<InnerModal>
					<AmountInput
						setAmount={setAmount}
						maxAmount={maxAmount}
						poolStakingConfig={poolStakingConfig}
					/>
					{label === 'UNSTAKE' && (
						<UnStakeButton
							label={label}
							onClick={onWithdraw}
							buttonType='primary'
							disabled={amount == '0' || maxAmount.lt(amount)}
						/>
					)}

					{label === 'PENDING UNSTAKE' && (
						<Pending>
							<Lottie
								options={loadingAnimationOptions}
								height={40}
								width={40}
							/>
							&nbsp;UNSTAKE PENDING
						</Pending>
					)}
					<CancelButton
						buttonType='texty'
						label='CANCEL'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</InnerModal>
			</UnStakeModalContainer>
		</Modal>
	);
};

const UnStakeModalContainer = styled.div`
	width: 370px;
	padding: 24px 0;
`;

const UnStakeModalTitle = styled(Row)`
	margin-bottom: 42px;
`;

const UnStakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
`;

const InnerModal = styled.div`
	padding: 0 24px;
`;

const UnStakeButton = styled(Button)`
	width: 100%;
	margin-top: 32px;
	margin-bottom: 8px;
`;

const Pending = styled(Row)`
	margin-top: 32px;
	margin-bottom: 8px;
	line-height: 46px;
	height: 46px;
	border: 2px solid ${neutralColors.gray[100]};
	border-radius: 48px;
	color: ${neutralColors.gray[100]};
	gap: 8px;
	justify-content: center;
	align-items: center;
	& > div {
		margin: 0 !important;
	}
`;

const CancelButton = styled(Button)`
	width: 100%;
`;
