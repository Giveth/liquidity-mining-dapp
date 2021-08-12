import { FC, useState } from "react";
import styled from "styled-components";
import ClaimCarousel from "./steps-carousel";

const stepsTitle =["Connect", "Invest", "Govern", "Donate", "Claim"]

const Steps = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
    color: #2FC8E0;
    opacity: ${props => props.isActive ? 1 : 0.2};
    position: relative;
    padding: 8px 0;
    margin: 4px;
    ::before {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 0;
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background-color: #2FC8E0;
    }
`;

interface IStepProps {
    title: string;
    isActive: boolean;
}

const Step: FC<IStepProps> = ({title, isActive}) => {
    return (
        <StepTitle isActive={isActive}>{title}</StepTitle>
    );
}

const ClaimView = () => {
    const [step,setStep] = useState(0);
    return (
        <div>
            <Steps>
                {stepsTitle.map((title, idx)=>
                    <Step title={title} isActive={step === idx} key={idx} />
                )}
            </Steps>
            <ClaimCarousel />
        </div>
    );
}

export default ClaimView;