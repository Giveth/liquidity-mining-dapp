import React from 'react';
import styled from 'styled-components';
import Header from '../Header';
import TabGIVgarden from '../homeTabs/GIVgarden';
import TabOverview from '../homeTabs/Overview';
import { Container } from '../styled-components/Grid';
import { H1, P } from '../styled-components/Typography';
import Tabs from '../Tabs';

const WelcomeSection = styled.div`
	background-image: url('/images/Giv.png');
	background-size: cover;
	background-repeat: no-repeat;
	min-height: calc(100vh - 228px);
	::before {
		content: url('/images/homebg1.png');
		position: absolute;
		top: 48px;
		left: 0;
	}
`;

const Title = styled(H1)`
	padding-top: 66px;
	padding-bottom: 42px;
	max-width: 989px;
`;

const SubTitle = styled(P)`
	max-width: 912px;
	padding-bottom: 288px;
`;

function HomeView() {
	return (
		<>
			<Header />
			<WelcomeSection>
				<Container>
					<Title>Welcome to the Giveth Economy</Title>
					<SubTitle size='large'>
						The Giveth Economy is the collective of projects,
						donors, builders, and community members building the
						Future of Giving.
					</SubTitle>
				</Container>
			</WelcomeSection>
			<Tabs
				tabs={[
					{ label: 'Overview', component: <TabOverview /> },
					{ label: 'GIVgarden', component: <TabGIVgarden /> },
					{ label: 'GIVfarm', component: <></> },
					{ label: 'GIVbacks', component: <></> },
					{ label: 'GIVstrem', component: <></> },
				]}
			></Tabs>
		</>
	);
}

export default HomeView;
