import { FC } from "react";
import styled from "styled-components";

interface IHasBG{
    bg?: string;
}

const InputContainer = styled.div<IHasBG>`
    background: ${props => props.bg ? props.bg : "#310BB5"};
    border-radius: 34px;
    padding: 10px 10px 10px 32px;
    height: 68px;
    display: flex;
    width: 100%;
    align-items: center;
    margin: 8px 0;
`;

const Input = styled.input<IHasBG>`
    border: 0;
    background: ${props => props.bg ? props.bg : "#310BB5"};
    color: white;
    flex: 1;
    font-size: 18px;
    line-height: 160%;
    ::placeholder {
        color: white;
    }
`;

const Button = styled.button<IHasBG>`
    border: 0;
    border-radius: 24px;  
    height: 48px;
    background: ${props => props.bg ? props.bg : "#1B1657"};
    color: #FFFFFF;
    padding: 16px 32px;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 13px;
`;

interface IInputWithButtonProps{
    placeholder?: string;
    btnLable?: string;
    onClick?: (e: any)=>{};
}

export const InputWithButton:FC<IInputWithButtonProps> = ({placeholder, btnLable, onClick})=>{
    return (
        <InputContainer>
            <Input placeholder={placeholder} />
            <Button onClick={onClick}>{btnLable}</Button>
        </InputContainer>
    );
}


const Unit = styled.span`
    padding-right: 10px;
    color: #CABAFF;
`;

interface IInputWithUnitProps{
    placeholder?: string;
    unit: string;
    defaultValue: string | number;
    onChange?: ()=>{}
}

export const InputWithUnit:FC<IInputWithUnitProps> = ({placeholder, unit, defaultValue})=>{
    return (
        <InputContainer>
            <Input placeholder={placeholder} defaultValue={defaultValue} />
            <Unit>{unit}</Unit>
        </InputContainer>
    );
}