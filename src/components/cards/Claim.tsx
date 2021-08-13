import styled from "styled-components";
import { InputWithButton } from "../input";
import { Button } from "../styled-components/Button";
import { Row } from "../styled-components/Grid";
import { H2, P } from "../styled-components/Typography";
import { Card, Header } from "./common";

const ClaimCardContainer = styled(Card)`
    ::after {
        content: "";
        background-image: url("/images/wave.png");
        position: absolute;
        height: 143px;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 0;
    }
`;

const ClaimButton = styled(Button)`
    width: 356px;
`;

const Span = styled.div`
    display: inline-block;
    font-size: 20px;
    line-height: 26px;
    text-transform: uppercase;
`;

const InputWithButtonContainer = styled.div`
    width: 588px;
`;

const ClaimCard = () => {
    return (
        <ClaimCardContainer>
            <Header>
                <H2 as="h1">Claim your GIVdrop</H2>
                <P color={"#CABAFF"}>Claim your wallet or check an ethereum address to see your rewards.</P>
            </Header>
            <Row alignItems={"center"} justifyContent={"space-between"} >
                <ClaimButton secondary>CONNECT WALLET</ClaimButton>
                <Span>or</Span>
                <InputWithButtonContainer>
                    <InputWithButton btnLable="Check" placeholder="Enter an address to check your GIVdrop" />
                </InputWithButtonContainer>
            </Row>
        </ClaimCardContainer>
    );
}

export default ClaimCard;