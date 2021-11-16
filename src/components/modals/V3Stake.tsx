import { FC } from 'react';
import { Modal, IModal } from './Modal';
import {
	neutralColors,
	brandColors,
	Button,
	H4,
	Overline,
	B,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import V3StakingCard from '../cards/PositionCard';
import { useLiquidityPositions } from '@/context';
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
	const { unstakedPositions, stakedPositions } = useLiquidityPositions();
	console.log(unstakedPositions, stakedPositions);
	const positions = isUnstakingModal ? stakedPositions : unstakedPositions;
	console.log(positions);
	const { title } = poolStakingConfig;

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<StakeModalContainer>
				<StakeModalTitle alignItems='center'>
					<StakingPoolImages title={title} />
					<StakeModalTitleText weight={700}>
						{title}
					</StakeModalTitleText>
				</StakeModalTitle>
				<InnerModal>
					{positions.map(position => (
						<V3StakingCard
							position={position}
							isUnstaking={isUnstakingModal}
							key={position.tokenId.toString()}
						/>
					))}
					<FullWidthButton
						buttonType='texty'
						label='CLOSE'
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
	width: 630px;
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
	display: flex;
	flex-direction: column;
	padding: 0 24px;
	gap: 36px;
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
