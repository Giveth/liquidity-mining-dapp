import { brandColors, GLink } from '@giveth/ui-design-system';
import styled from 'styled-components';

export const TabContainer = styled.div``;

export const TopContainer = styled(TabContainer)`
	background-image: url('/images/backgrounds/givup.svg');
	background-size: cover;
	height: 370px;
`;

export const ExtLink = styled(GLink)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
`;
