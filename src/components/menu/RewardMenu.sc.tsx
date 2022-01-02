import { brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

export const RewardMenuContainer = styled.div`
	position: absolute;
	top: 40%;
	right: 0;
	width: 260px;
	background-color: ${brandColors.giv[900]};
	border: 1px solid ${brandColors.giv[600]};
	border-radius: 10px 0 10px 10px;
	padding: 38px 24px;
	z-index: 0;
`;
