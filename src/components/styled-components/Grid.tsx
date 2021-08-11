import styled from "styled-components";

interface IRowProps {
    wrap?: number;
}

export const Row = styled.div<IRowProps>`
  display:flex;
  flex-wrap: ${ props => props.wrap ? "wrap" : "nowrap"};
`;