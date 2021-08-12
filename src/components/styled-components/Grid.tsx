import styled from "styled-components";

interface IRowProps {
    wrap?: number;
    alignItems?: "stretch"|"center"|"flex-start"|"flex-end"|"baseline";
    justifyContent?: "flex-start"|"flex-end"|"center"|"space-between"|"space-around"|"space-evenly";
    direction?: "row"|"row-reverse"|"column"|"column-reverse";
}

export const Row = styled.div<IRowProps>`
  display:flex;
  direction: ${ props => props.direction ? props.direction : "initial"};
  flex-wrap: ${ props => props.wrap ? "wrap" : "nowrap"};
  align-items:  ${ props => props.alignItems ? props.alignItems : "initial"};
  justify-content:  ${ props => props.justifyContent ? props.justifyContent : "initial"};
`;