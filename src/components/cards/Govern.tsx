import { useState, ChangeEvent, FC } from "react";
import styled from "styled-components";
import { InputWithUnit } from "../input";
import { Row } from "../styled-components/Grid";
import { H2, H4,P } from "../styled-components/Typography";
import { Card, Header, ICardProps, MaxGIV } from "./common";

const GovernCardContainer = styled(Card)`
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

const GovernGIVToken = styled.div`
    padding: 20px 38px; 
    height: 208px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const GovernLabel = styled.span`
    color: #CABAFF;
`;

const GovernInput = styled.div`
    width: 392px;
`;


const YouCanEarn = styled(GovernGIVToken)``;

const GovernGIVEarn = styled.div`
    font-family: Red Hat Text;
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: 80px;
    letter-spacing: 0em;
    text-align: left;
`;

const GovernCard:FC<ICardProps> = ({activeIndex, index}) => {
    const [stacked, setStacked] = useState(0);

    const stackedChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            setStacked(0);
        } else if (isNaN(+e.target.value)) {
            setStacked(stacked);
        } else {
            setStacked(+e.target.value);
        }
    }

    return (
        <GovernCardContainer activeIndex={activeIndex} index={index}>
            <Header>
                <H2 as="h1">Govern in the GIVgarden</H2>
                <P size="small" color={"#CABAFF"}>Participate in Giveth governance using the GIVgarden. Govern on proposals with GIV and earn rewards.</P>
            </Header>
            <Row alignItems={"center"} justifyContent={"flex-end"} >
                <GovernGIVToken>
                    <H4 as="h2">If you vote with GIV tokens</H4>
                    <div>
                        <Row alignItems={"center"} justifyContent={"space-between"}>
                            <GovernLabel>Amount staked on proposals</GovernLabel>
                            <MaxGIV>{`Max ${333} GIV`}</MaxGIV>
                        </Row>
                        <GovernInput>
                            <InputWithUnit value={stacked} unit={'GIV'} onChange={stackedChangeHandler} />
                        </GovernInput>
                    </div>
                </GovernGIVToken>
                <YouCanEarn>
                    <H4 as="h2">You can earn</H4>
                    <div>
                        <GovernLabel>GIV Token</GovernLabel>
                        <GovernGIVEarn>{stacked}</GovernGIVEarn>
                    </div>
                </YouCanEarn>
            </Row>
        </GovernCardContainer>
    );
}

export default GovernCard;