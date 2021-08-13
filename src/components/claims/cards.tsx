import { useState, ChangeEvent } from "react";
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
    background-image: url("/images/GIVGIVGIV.png");
    background-repeat: no-repeat;
    background-size: cover;
    margin: 10px auto;
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

const ImpactCard = styled.div`
    /* width: 399px; */
    padding: 20px 30px; 
    height: 208px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const PoolCard = styled.div`
    width: 399px;
    height: 208px;
    padding: 20px 30px;

    background: #FFFFFF;
    border-radius: 16px;
    color:#1B1657;
`;

const PoolItems = styled.div`
    padding: 12px 0;
`;

const PoolItem = styled.div`
    font-size: 16px;
    height: 40px;
    line-height: 40px;
`;

const PoolItemBold = styled.div`
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
`;

export const EarnCard = () => {
    const [deposite, setDopsite] = useState(0);

    const depositeChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            setDopsite(0);
        } else if (isNaN(+e.target.value)) {
            setDopsite(deposite);
        } else {
            setDopsite(+e.target.value);
        }
    }

    return (
        <EarnCardContainer>
            <Header>
                <H2 as="h1">Earn with GIVmining</H2>
                <P color={"#CABAFF"}>Provide liquidity or stake your GIV tokens to earn up to 140% APY</P>
            </Header>
            <Row alignItems={"flex-start"} justifyContent={"space-between"} >
                <ImpactCard>
                    <H4 as="h2">See your impact</H4>
                    <div>
                        <Row alignItems={"center"} justifyContent={"space-between"}>
                            <DepositeLable>Your deposit</DepositeLable>
                            <MaxGIV>{`Max ${333} GIV`}</MaxGIV>
                        </Row>
                        <DepositInput>
                            <InputWithUnit value={deposite} unit={'GIV'} onChange={depositeChangeHandler} />
                        </DepositInput>
                    </div>
                </ImpactCard>
                <PoolCard>
                    <H4 as="h2">Your Pool</H4>
                    <PoolItems>
                        <Row justifyContent="space-between">
                            <PoolItem>Your deposit</PoolItem>
                            <PoolItem>{deposite}</PoolItem>
                        </Row>
                        <Row justifyContent="space-between">
                            <PoolItem>Farm fee</PoolItem>
                            <PoolItem>Free</PoolItem>
                        </Row>
                        <Row justifyContent="space-between">
                            <PoolItem>Annual GIV earned</PoolItem>
                            <PoolItemBold>{0}</PoolItemBold>
                        </Row>
                    </PoolItems>
                    
                </PoolCard>
            </Row>
        </EarnCardContainer>
    );
}
