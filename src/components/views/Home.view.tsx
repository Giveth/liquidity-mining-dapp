import styled from "styled-components";
import { H1, H2, H3, P } from "../styled-components/Typography";
import { Row } from "../styled-components/Grid";
import { Button } from "../styled-components/Button";

const Section = styled.section`
  padding: 102px 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const GivCard = styled.div`
  padding-right: 180px;
  flex: 1;
`;

const Container = styled.div`
  margin: 0 140px;
`;

const ParticipateCard = styled.div`
  flex: 1;
  padding-right: 76px;
`;

const ParticipateButton = styled(Button)`
  width: 280px;
`;

const ParticipateDesc = styled(P)`
  height: 198px;
  width: 322px;
`;

const ParticipateSubDesc = styled.p`
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: left;
  color: #C4B2FF;
  width: 280px;
`;


const ClaimCard = styled.div`
  background-color: #3C14C5;
  padding: 105px 146px;
`;

const ClaimCardButton = styled(Button)`
  width: 300px;
`;

function HomeView() {
  return (
    <Container>
      <Section>
        <H1>Welcome to the Giveth Economy</H1>
        <P size="large">The Giveth Economy is the collective of projects, donors,
           builders, and community members building the Future of Giving.</P>
        <H2>The Economy of Giving</H2>
        <P>
        Giveth is building a future in which giving is effortless and people
         all around the world are rewarded for creating positive change.
        </P>
        <Row wrap={1}>
          <GivCard>
            <H3>GIV Token</H3>
            <P>DONATE, EARN, GOVERN</P>
            <P>
            GIV fuels and directs the Future of Giving,
             inspiring people to become Givers and participate in an ecosystem of collective support,
             abundance, and value-creation.
            </P>
          </GivCard>
          <GivCard>
            <H3>GIVbacks</H3>
            <P>GIVE AND RECEIVE</P>
            <P>
              GIVbacks is a revolutionary concept that
               incentives donations to verified projects on Giveth.
            </P>
          </GivCard>
        </Row>
      </Section>
      <Section>
        <H2>How to participate</H2>
        <Row wrap={1}>
        <ParticipateCard>
          <H3>Earn</H3>
          <ParticipateDesc>Participate in GIVmining by adding liquidity and generating even more GIV in rewards.</ParticipateDesc>
          <ParticipateButton>Add Liquidty and Earn</ParticipateButton>
          <ParticipateSubDesc>Earn GIV by providing liquidity. Up to 140% APR waits for you.</ParticipateSubDesc>
        </ParticipateCard>
        <ParticipateCard>
          <H3>Govern</H3>
          <ParticipateDesc>Stake GIV in the GIVgarden to participate in governance of the
            &nbsp;
            <strong>
              Giving Economy
            </strong>
            . Propose and vote to help shape the Future of Giving.</ParticipateDesc>
          <ParticipateButton>See proposals</ParticipateButton>
          <ParticipateSubDesc>Earn GIV by voting on proposals and participating in Giveth governance.</ParticipateSubDesc>
        </ParticipateCard>
        <ParticipateCard>
          <H3>Give</H3>
          <ParticipateDesc>Get GIVbacks by donating to verified projects on Giveth.
             Empower change-makers that are working hard to make a difference. </ParticipateDesc>
          <ParticipateButton>Donate to projects</ParticipateButton>
          <ParticipateSubDesc>Earn GIV by donating to verified projects on Giveth. </ParticipateSubDesc>
        </ParticipateCard>
        </Row>
      </Section>
      <Section>
        <ClaimCard>
          <H2>Claim your GIV tokens</H2>
          <P>Connect your wallet or check an ethereum address to see your rewards.</P>
          <ClaimCardButton secondary >CLAIM YOUR GIV</ClaimCardButton>
        </ClaimCard>
      </Section>
    </Container>
  )
}


export default HomeView;