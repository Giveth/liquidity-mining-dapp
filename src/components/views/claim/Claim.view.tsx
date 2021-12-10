import React, { FC, useState } from 'react';
import styled from 'styled-components';
import CongratulationsCard from '../../cards/Congratulations';
import ClaimCard from '../../cards/Claim';
import { ConnectCard } from '../../cards/Connect';
import { DonateCard } from '../../cards/Donate';
import { StreamCard } from '../../cards/Stream';
import GovernCard from '../../cards/Govern';
import InvestCard from '../../cards/Stake';
import { Row } from '../../styled-components/Grid';
import { number } from 'prop-types';

const stepsTitle = ['Connect', 'Stake', 'Govern', 'Donate', 'Stream', 'Claim'];

const Steps = styled(Row)`
	height: 80px;
`;

interface IStepTitleProps {
	isActive: boolean;
}

const StepTitle = styled.div<IStepTitleProps>`
	width: 104px;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 19px;
	color: #2fc8e0;
	opacity: ${props => (props.isActive ? 1 : 0.2)};
	position: relative;
	padding: 8px 0;
	margin: 4px;
	cursor: pointer;
	::before {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 0;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background-color: #2fc8e0;
	}
`;

interface IStepProps {
	title: string;
	isActive: boolean;
	onClick: any;
}

const Step: FC<IStepProps> = ({ title, isActive, onClick }) => {
	return (
		<StepTitle isActive={isActive} onClick={onClick}>
			{title}
		</StepTitle>
	);
};

const ClaimViewContainer = styled.div`
	background-image: url('/images/cardsbg1.png'), url('/images/cardsbg.png');
	background-repeat: repeat-x, no-repeat;
	background-position-y: bottom, top;
`;

const ClaimCarouselContainer = styled.div`
	overflow-x: hidden;
	position: relative;
	height: calc(100vh - 80px);
`;

interface IClaimViewContext {
	activeIndex: number;
	goNextStep: () => void;
	goFirstStep: () => void;
}

export interface IClaimViewCardProps {
	index: number;
}

export const ClaimViewContext = React.createContext<IClaimViewContext>({
	activeIndex: 0,
	goNextStep: () => {},
	goFirstStep: () => {},
});

const ClaimView = () => {
	const [step, setStep] = useState(0);
	return step < 6 ? (
		<ClaimViewContainer>
			<Steps justifyContent='center' alignItems='center'>
				{stepsTitle.map((title, idx) => (
					<Step
						title={title}
						isActive={step === idx}
						key={idx}
						onClick={() => {
							setStep(idx);
						}}
					/>
				))}
			</Steps>
			<ClaimCarouselContainer>
				<ClaimViewContext.Provider
					value={{
						activeIndex: step,
						goNextStep: () => {
							setStep(step + 1);
						},
						goFirstStep: () => {
							setStep(0);
						},
					}}
				>
					<ConnectCard index={0} />
					<InvestCard index={1} />
					<GovernCard index={2} />
					<DonateCard index={3} />
					<StreamCard index={4} />
					<ClaimCard index={5} />
				</ClaimViewContext.Provider>
			</ClaimCarouselContainer>
		</ClaimViewContainer>
	) : (
		<CongratulationsCard />
	);
};

export default ClaimView;
