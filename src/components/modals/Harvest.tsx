import { FC, useState } from 'react';
import { Modal, IModal } from './Modal';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import {
	brandColors,
	neutralColors,
	Button,
	Caption,
	IconGiveth,
	IconGIVStream,
	IconHelp,
	Lead,
	P,
	Title,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
interface IHarvesModalProps extends IModal {}

enum States {
	Harvest,
	Waiting,
	Confirmd,
}

export const HarvestModal: FC<IHarvesModalProps> = ({
	showModal,
	setShowModal,
}) => {
	const [state, setState] = useState(States.Harvest);
	const animationOptions = {
		loop: true,
		autoplay: true,
		animationData: LoadingAnimation,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};
	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			title='Your GIVgardens Rewards'
		>
			{state === States.Harvest && (
				<HarvestModalContainer>
					<StyledGivethIcon>
						<IconGiveth size={64} />
					</StyledGivethIcon>
					<GIVAmount>{257.9055}</GIVAmount>
					<USDAmount>~${348.74}</USDAmount>
					<HelpRow
						alignItems='center'
						justifyContent='center'
						gap='8px'
					>
						<Caption>Your additional GIVstream flowrate</Caption>
						<IconHelp size={16} color={brandColors.deep[100]} />
					</HelpRow>
					<RateRow
						alignItems='center'
						justifyContent='center'
						gap='4px'
					>
						<IconGIVStream size={24} />
						<GIVRate>{9.588}</GIVRate>
						<Lead>GIV/week</Lead>
					</RateRow>
					<HarvestButton
						label='HARVEST'
						size='medium'
						buttonType='primary'
					/>
					<CancelButton
						label='CANCEL'
						size='medium'
						buttonType='texty'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</HarvestModalContainer>
			)}
			{state === States.Waiting && (
				<Lottie options={animationOptions} height={100} width={100} />
			)}
		</Modal>
	);
};

const HarvestModalContainer = styled.div`
	width: 710px;
`;

const StyledGivethIcon = styled.div`
	margin-top: 48px;
	margin-bottom: 23px;
`;

const GIVAmount = styled(Title)`
	color: ${neutralColors.gray[100]};
`;

const USDAmount = styled(P)`
	margin-bottom: 22px;
	color: ${brandColors.deep[200]};
`;

const HelpRow = styled(Row)`
	margin-bottom: 16px;
`;

const RateRow = styled(Row)`
	margin-bottom: 36px;
`;

const GIVRate = styled(Lead)`
	color: ${neutralColors.gray[100]};
`;

const HarvestButton = styled(Button)`
	display: block;
	width: 316px;
	margin: 0 auto 16px;
`;

const CancelButton = styled(Button)`
	width: 316px;
	margin: 0 auto 8px;
`;
