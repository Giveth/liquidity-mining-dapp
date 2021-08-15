import styled from "styled-components";

export interface ICardProps {
    activeIndex: number;
    index: number;
}

export const Card = styled.div<ICardProps>`
    position: absolute;
    width: 1120px;
    height: 582px;
    background: #3C14C5;
    padding: 96px 80px;
    background-image: url("/images/GIVGIVGIV.png");
    background-repeat: no-repeat;
    background-size: cover;
    margin: 10px auto;
    top: 10px;
    left: ${props => `${(props.index - props.activeIndex) * 100 + 50}%` };
    transform: translateX(-50%);
    transition: left 0.3s ease-out;
`;

export const Header = styled.div`
    margin-bottom: 92px;
`;

export const MaxGIV = styled.span`
    color: #FED670;
`;