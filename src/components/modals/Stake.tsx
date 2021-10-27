import { FC, useCallback, useState, useContext } from 'react';
import { Modal, IModal } from './Modal';
import {
	neutralColors,
	Button,
	OulineButton,
	H4,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { PoolStakingConfig } from '../../types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { ethers } from 'ethers';
import { AmountInput } from '../AmountInput';
import {
	harvestTokens,
	stakeTokens,
	withdrawTokens,
} from '../../lib/stakingPool';
import { OnboardContext } from '../../context/onboard.context';

interface IStakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	maxAmount: ethers.BigNumber;
}

export const StakeModal: FC<IStakeModalProps> = ({
	poolStakingConfig,
	maxAmount,
	showModal,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [label, setLabel] = useState('APPROVE');
	const { network: walletNetwork, provider } = useContext(OnboardContext);

	const {
		type,
		title,
		description,
		provideLiquidityLink,
		LM_ADDRESS,
		POOL_ADDRESS,
	} = poolStakingConfig;

	const onApprove = () => {
		console.log('onApprove called');
		setLabel('PENDING APPROVAL');
		const promises = stakeTokens(amount, POOL_ADDRESS, LM_ADDRESS, provider)
			.then(data => {
				console.log('data: ', data);
				if (data) {
					setShowModal(false);
				} else {
					setLabel('APPROVE');
				}
			})
			.catch(err => {
				setLabel('APPROVE');
			});
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<StakeModalContainer>
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
					/>
					<ApproveButton
						label={label}
						onClick={onApprove}
						disabled={amount == '0' || maxAmount.lt(amount)}
					/>
					<CancelButton
						buttonType='texty'
						label='CANCEL'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</InnerModal>
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

const ApproveButton = styled(OulineButton)`
	width: 100%;
	margin-top: 32px;
	margin-bottom: 8px;
`;

const CancelButton = styled(Button)`
	width: 100%;
`;
