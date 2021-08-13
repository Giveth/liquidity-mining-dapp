import styled from "styled-components";

interface IRowProps {
    wrap?: number;
    alignItems?: "stretch"|"center"|"flex-start"|"flex-end"|"baseline";
    justifyContent?: "flex-start"|"flex-end"|"center"|"space-between"|"space-around"|"space-evenly";
    flexDirection?: "row"|"row-reverse"|"column"|"column-reverse";
}

export const Row = styled.div<IRowProps>`
  display:flex;
  flex-direction: ${ props => props.flexDirection ? props.flexDirection : "initial"};
  flex-wrap: ${ props => props.wrap ? "wrap" : "nowrap"};
  align-items:  ${ props => props.alignItems ? props.alignItems : "initial"};
  justify-content:  ${ props => props.justifyContent ? props.justifyContent : "initial"};
`;