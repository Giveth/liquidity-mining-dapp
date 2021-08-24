import React, { FC, useState } from "react";
import styled from "styled-components";
import CongratulationsCard from "../../cards/Congratulations";
import ClaimCard from "../../cards/Claim";
import { ConnectCard } from "../../cards/Connect";
import { DonateCard } from "../../cards/Donate";
import GovernCard from "../../cards/Govern"; "../../cards/Govern";
import InvestCard from "../../cards/Invest";
import { Row } from "../../styled-components/Grid";

const stepsTitle =["Connect", "Invest", "Govern", "Donate", "Claim"]

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
    onClick: any;
}

const Step: FC<IStepProps> = ({title, isActive,onClick}) => {
    return (
        <StepTitle isActive={isActive} onClick={onClick}>{title}</StepTitle>
    );
}

const ClaimViewContainer = styled.div`
    background-image: url("/images/cardsbg1.png"),url("/images/cardsbg.png");
    background-repeat: repeat-x, no-repeat;
    background-position-y: bottom, top;
`;

const ClaimCarouselContainer = styled.div`
    overflow-x: hidden;
    position: relative;
    height: calc(100vh - 80px);
`;

const ClaimView = () => {
    const [step,setStep] = useState(0);
    return step < 5 ? 
        <ClaimViewContainer>
            <Steps justifyContent="center" alignItems="center">
                {stepsTitle.map((title, idx)=>
                    <Step title={title} isActive={step === idx} key={idx} onClick={()=>{setStep(idx)}} />
                )}
            </Steps>
            <ClaimCarouselContainer>
                <ConnectCard activeIndex={step} index={0}/>
                <InvestCard activeIndex={step} index={1}/>
                <GovernCard activeIndex={step} index={2}/>
                <DonateCard activeIndex={step} index={3}/>
                <ClaimCard activeIndex={step} index={4}/>
            </ClaimCarouselContainer>
        </ClaimViewContainer>
    :
    <CongratulationsCard />
}

export default ClaimView;