import styled from "styled-components";
import { InputWithButton } from "../input";
import { Button } from "../styled-components/Button";
import { Row } from "../styled-components/Grid";
import { H2, P } from "../styled-components/Typography";

const Card = styled.div`
    position: relative;
    width: 1120px;
    height: 582px;
    background: #3C14C5;
    padding: 96px 80px;
`;

const ConnectCardContainer = styled(Card)`
    ::before {
        content: "";
        position: absolute;
    }
`;

const ConenctButton = styled(Button)`
    width: 300px;
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

const Header = styled.div`
    margin-bottom: 92px;
`;

export const ConnectCard = () => {
    return (
        <ConnectCardContainer>
            <Header>
                <H2 as="h1">Claim your GIVdrop</H2>
                <P color={"#CABAFF"}>Connect your wallet or check an ethereum address to see your rewards.</P>
            </Header>
            <Row alignItems={"center"} justifyContent={"space-between"} >
                <ConenctButton secondary>CONNECT WALLET</ConenctButton>
                <Span>or</Span>
                <InputWithButtonContainer>
                    <InputWithButton />
                </InputWithButtonContainer>
            </Row>
        </ConnectCardContainer>
    );
}
