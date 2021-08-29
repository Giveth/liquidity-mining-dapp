import styled from 'styled-components';
import { FC } from 'react';

const StackCardContainer = styled.div`
	background: rgba(255, 255, 255, 0.9);
	box-shadow: -10px 48.5967px 140px rgba(126, 123, 160, 0.2);
	border-radius: 10px;
`;

enum StackCardType {
	UNISSWAP,
	HONEYSWAP,
}
interface IStackCardProps {
	type: StackCardType;
}

const StackCard: FC<IStackCardProps> = () => {
	return (
		<StackCardContainer>
			<div></div>
		</StackCardContainer>
	);
};

export default StackCard;
