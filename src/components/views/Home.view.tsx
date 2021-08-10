import styled from "styled-components";

const H1 = styled.h1`
  max-width: 989px;
  font-size: 120px;
  font-style: normal;
  font-weight: 700;
  line-height: 132px;
  letter-spacing: -0.02em;
  text-align: left;
  color: #FFFFFF;
`;

const H2 = styled.h2`
  font-style: normal;
  font-weight: bold;
  font-size: 64px;
  line-height: 120%;
  color: #FFFFFF;
`;


const Section = styled.section`
  min-height: 100vh;
`;


interface TypographyProps {
  size?: "big"|"medium"|"small";
  wight?: "bold"|"normal";
  color?: string;
}

const P = styled.p<TypographyProps>`
  font-weight: normal;
  font-size: ${ props => {
    switch (props.size) {
      case "big":
        return '32px';
      case "medium":
        return '28px';
      case "small":
        return '24px';
      default:
        return '24px';
    }
  }};
  line-height: ${ props => {
    switch (props.size) {
      case "big":
        return '42px';
      case "medium":
        return '38px';
      case "small":
        return '32px';
      default:
        return '32px';
    }
  }};
  color: ${ props => props.color || "#FFFFFF" };
`;

function HomeView() {
  return (
    <>
      <Section>
        <H1>Welcome to the Giveth Economy</H1>
        <P size="big">The Giveth Economy is the collective of projects, donors,
           builders, and community members building the Future of Giving.</P>
        <H2>The Economy of Giving</H2>
        <P>
        Giveth is building a future in which giving is effortless and people
         all around the world are rewarded for creating positive change.
        </P>

      </Section>

    </>
  )
}


export default HomeView;