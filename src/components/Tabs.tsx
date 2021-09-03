import styled from 'styled-components';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Container, Row } from './styled-components/Grid';

const labelsContainer = styled(Row)``;

interface ITabs {
	label: string;
	component: ReactNode;
}

interface ITabsProps {
	tabs: ITabs[];
}

interface ILabelProps {
	isActive: boolean;
}

const Label = styled.div<ILabelProps>`
	font-family: red-hat;
	font-size: 28px;
	font-style: normal;
	font-weight: 700;
	line-height: 34px;
	letter-spacing: 0em;
	text-align: left;
	padding: 24px;
	transition: color 0.1s ease-out;
	color: ${props => (props.isActive ? '#2fc8e0' : '#235d8e')};
	position: relative;
	cursor: pointer;
	::after {
		content: '';
		position: absolute;
		background: #2fc8e0;
		left: 0;
		right: 0;
		bottom: ${props => (props.isActive ? 0 : '-8px')};
		height: 8px;
		z-index: 1;
		transition: bottom 0.1s ease-out;
	}
`;

const LabelsContainer = styled.div`
	overflow: hidden;
	position: relative;
	::after {
		content: '';
		position: absolute;
		background: #0c0840;
		left: 0;
		right: 0;
		bottom: 0;
		height: 8px;
	}
	& > div {
		& > div {
			height: 100px;
		}
	}
`;

const Tabs: FC<ITabsProps> = ({ tabs }) => {
	const [index, setIndex] = useState(0);
	const TabRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (TabRef) {
			TabRef?.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [index]);

	return (
		<>
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
								{tab.label}
							</Label>
						))}
					</Row>
				</Container>
			</LabelsContainer>
			<div>{tabs[index].component}</div>
		</>
	);
};

export default Tabs;
