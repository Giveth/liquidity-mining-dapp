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
`;

// interface IInputProps {
//     placeHolder: string;
    
// }

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

export const InputWithButton = ()=>{
    return (
        <InputContainer>
            <Input placeholder="Enter an address to check your GIVdrop" onClick={()=>{console.log("Salam")}} />
            <Button>Check</Button>
        </InputContainer>
    );
}