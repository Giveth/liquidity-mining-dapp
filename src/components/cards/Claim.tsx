import { FC } from "react";
import styled from "styled-components";
import { Button } from "../styled-components/Button";
import { Row } from "../styled-components/Grid";
import { H2, P } from "../styled-components/Typography";
import { Card, Header, ICardProps } from "./common";

const ClaimCardContainer = styled(Card)`
    ::before {
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

const ClaimHeader = styled(Header)`
    margin: 116px auto 48px auto;
    text-align: center;
`;

const ClaimButton = styled(Button)`
    width: 356px;
`;

const ClaimCard:FC<ICardProps> = ({activeIndex, index}) => {
    return (
        <ClaimCardContainer activeIndex={activeIndex} index={index}>
            <ClaimHeader>
                <H2 as="h1">Claim your GIVdrop</H2>
                <P size="small" color={"#CABAFF"}>Claim your tokens and put them to good use.</P>
            </ClaimHeader>
            <Row alignItems={"center"} justifyContent={"center"} >
                <ClaimButton secondary>CLAIM {3333} GIV Tokens</ClaimButton>
            </Row>
        </ClaimCardContainer>
    );
}

export default ClaimCard;