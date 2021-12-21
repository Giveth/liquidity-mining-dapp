import styled from 'styled-components';
import { Button } from '../styled-components/Button';
import { useContext } from 'react';
import { UserContext } from '../../context/user.context';
import { utils } from 'ethers';
import { H2, Lead, P } from '@giveth/ui-design-system';

const CongratulationsView = styled.div`
	min-height: 100vh;
	background-color: #3c14c5;
	background-image: url('/images/bgCong.png');
	background-size: cover;
`;

const CongratulationsContainer = styled.div`
	width: 700px;
	margin: auto;
	text-align: center;
`;

const CongHeader = styled.div`
	text-align: center;
	padding-top: 164px;
	position: relative;
	margin-bottom: 80px;
	::before {
		content: '';
		background-image: url('/images/congratulation.png');
		position: absolute;
		width: 252px;
		height: 226px;
		bottom: 0;
		left: -110px;
	}
`;

const Description = styled.div`
	padding: 16px 10px 90px 164px;
	text-align: left;
`;

const Rate = styled(P)`
	color: #fed670;
	display: inline-block;
	padding: 10px;
`;

const CongratsButton = styled(Button)`
	width: 356px;
	text-transform: uppercase;
	font-size: 16px;
	font-weight: 700;
	line-height: 18px;
	letter-spacing: 0.04em;
	margin-top: 36px;
`;

export const CongratulationsCard = () => {
	const { totalAmount } = useContext(UserContext);
	return (
		<CongratulationsView>
			<CongratulationsContainer>
				<CongHeader>
					<H2 as='h1' weight={700}>
						Congratulations!
					</H2>
					<Description>
						<Lead>
							You have successfully claimed{' '}
							{utils.formatEther(totalAmount.div(10))} GIV tokens.
						</Lead>
						<Lead>Add GIV to Metamask</Lead>
					</Description>
				</CongHeader>
				<Lead>
					And you&apos;re getting an additional
					<Rate size='xlarge'>{10} GIV</Rate>
					per second.
				</Lead>
				<Lead>Watch your GIVstream flow!</Lead>
				<CongratsButton secondary>GIV me more</CongratsButton>
			</CongratulationsContainer>
		</CongratulationsView>
	);
};
