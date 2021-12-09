import { FC } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
import {
	H6,
	GLink,
	IconCalculator,
	neutralColors,
} from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { Row } from '../styled-components/Grid';
import { PoolStakingConfig } from '@/types/config';
import { USDInput } from '../USDInput';
interface IAPRModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	maxAmount: BigNumber;
}

export const APRModal: FC<IAPRModalProps> = ({
	showModal,
	setShowModal,
	poolStakingConfig,
	maxAmount,
}) => {
	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<APRModalContainer>
				<Row gap='8px' alignItems='center'>
					<APRLabel>APR</APRLabel>
					<IconCalculator size={16} />
				</Row>
				<InputLabel size='big'>{`${poolStakingConfig.title} ${poolStakingConfig.unit} Staking`}</InputLabel>
				<USDInput
					maxAmount={maxAmount}
					poolStakingConfig={poolStakingConfig}
				/>
			</APRModalContainer>
		</Modal>
	);
};

const APRModalContainer = styled.div`
	width: 370px;
	padding: 16px 24px;
	margin-bottom: 22px;
`;

const APRLabel = styled(H6)``;

const InputLabel = styled(GLink)`
	text-align: left;
	color: ${neutralColors.gray[100]};
	margin-bottom: 8px;
`;
