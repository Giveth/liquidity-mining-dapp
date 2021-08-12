import styled from "styled-components";
import { InputWithButton, InputWithUnit } from "../input";
import { Button } from "../styled-components/Button";
import { Row } from "../styled-components/Grid";
import { H2, H4,P } from "../styled-components/Typography";

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
                    <InputWithButton btnLable="Check" placeholder="Enter an address to check your GIVdrop" />
                </InputWithButtonContainer>
            </Row>
        </ConnectCardContainer>
    );
}

const EarnCardContainer = styled(Card)`
    ::before {
        content: "";
        position: absolute;
    }
`;

const MaxGIV = styled.span`
    color: #FED670;
`;


const DepositeLable = styled.span`
    color: #CABAFF;
`;

const DepositInput = styled.div`
    width: 392px;
`;

export const EarnCard = () => {
    return (
        <EarnCardContainer>
            <Header>
                <H2 as="h1">Earn with GIVmining</H2>
                <P color={"#CABAFF"}>Provide liquidity or stake your GIV tokens to earn up to 140% APY</P>
            </Header>
            <Row alignItems={"center"} justifyContent={"space-between"} >
                <div>
                    <H4>See your impact</H4>
                    <div>
                        <Row alignItems={"center"} justifyContent={"space-between"}>
                            <DepositeLable>Your deposit</DepositeLable>
                            <MaxGIV>{`Max ${333} GIV`}</MaxGIV>
                        </Row>
                        <DepositInput>
                            <InputWithUnit defaultValue={0} unit={'GIV'} />
                        </DepositInput>
                    </div>
                </div>
            </Row>
        </EarnCardContainer>
    );
}