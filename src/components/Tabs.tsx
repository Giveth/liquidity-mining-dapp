import styled from 'styled-components';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import {
	brandColors,
	Container,
	GLink,
	neutralColors,
} from '@giveth/ui-design-system';
import { Row } from './styled-components/Grid';

const labelsContainer = styled(Row)``;

interface ITabs {
	label: string;
	topComponent: ReactNode;
	bottomComponent: ReactNode;
}

interface ITabsProps {
	tabs: ITabs[];
}

interface ILabelProps {
	isActive: boolean;
}

const Label = styled.div<ILabelProps>`
	width: 176px;
	padding: 12px;
	text-align: center;
	color: ${props =>
		props.isActive ? neutralColors.gray[100] : brandColors.deep[100]};
	background-color: ${props =>
		props.isActive ? brandColors.giv[600] : 'unset'};
	border: 1px solid ${brandColors.giv[600]};
	box-sizing: border-box;
	border-radius: 54px;

	cursor: pointer;
`;

const LabelsContainer = styled.div`
	padding: 42px 0;
`;

const Tabs: FC<ITabsProps> = ({ tabs }) => {
	const [index, setIndex] = useState(0);
	const TabRef = useRef<HTMLDivElement>(null);

	// useEffect(() => {
	// 	if (TabRef && TabRef.current) {
	// 		TabRef.current.scrollIntoView({ behavior: 'smooth' });
	// 	}
	// }, [index]);

	return (
		<>
			<div>{tabs[index].topComponent}</div>
			<LabelsContainer ref={TabRef}>
				<Container>
					<Row justifyContent='space-between' alignItems='flex-end'>
						{tabs.map((tab, idx) => (
							<Label
								key={idx}
								isActive={idx === index}
								onClick={() => {
									setIndex(idx);
								}}
							>
								<GLink size='Big'>{tab.label}</GLink>
							</Label>
						))}
					</Row>
				</Container>
			</LabelsContainer>
			<div>{tabs[index].bottomComponent}</div>
		</>
	);
};

export default Tabs;
