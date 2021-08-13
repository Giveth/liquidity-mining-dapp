import { useState, ChangeEvent } from "react";
import styled from "styled-components";
import { InputWithUnit } from "../input";
import { Row } from "../styled-components/Grid";
import { H2, H4,P } from "../styled-components/Typography";
import { Card, Header, MaxGIV } from "./common";

const DonateCardContainer = styled(Card)`
    ::before {
        content: "";
        background-image: url("/images/vote.png");
        position: absolute;
        width: 274px;
        height: 313px;
        bottom: 0;
        left: 0;
        z-index: 0;
    }
`;


const DonateGIVToken = styled.div`
    padding: 20px 38px; 
    height: 208px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const DonateLabel = styled.span`
    color: #CABAFF;
`;

const DonateInput = styled.div`
    width: 392px;
`;


const YouCanEarn = styled(DonateGIVToken)``;

const DonateGIVEarn = styled.div`
    font-family: Red Hat Text;
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: 80px;
    letter-spacing: 0em;
    text-align: left;
`;


export const DonateCard = () => {
    const [donation, setDonation] = useState(0);

    const stackedChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            setDonation(0);
        } else if (isNaN(+e.target.value)) {
            setDonation(donation);
        } else {
            setDonation(+e.target.value);
        }
    }

    return (
        <DonateCardContainer>
            <Header>
                <H2 as="h1">Donate in the GIVgarden</H2>
                <P color={"#CABAFF"}>Participate in Giveth governance using the GIVgarden. Donate on proposals with GIV and earn rewards.</P>
            </Header>
            <Row alignItems={"center"} justifyContent={"flex-end"} >
                <DonateGIVToken>
                    <H4 as="h2">If you vote with GIV tokens</H4>
                    <div>
                        <Row alignItems={"center"} justifyContent={"space-between"}>
                            <DonateLabel>Amount staked on proposals</DonateLabel>
                            <MaxGIV>{`Max ${333} GIV`}</MaxGIV>
                        </Row>
                        <DonateInput>
                            <InputWithUnit value={donation} unit={'GIV'} onChange={stackedChangeHandler} />
                        </DonateInput>
                    </div>
                </DonateGIVToken>
                <YouCanEarn>
                    <H4 as="h2">You can earn</H4>
                    <div>
                        <DonateLabel>GIV Token</DonateLabel>
                        <DonateGIVEarn>{donation}</DonateGIVEarn>
                    </div>
                </YouCanEarn>
            </Row>
        </DonateCardContainer>
    );
}