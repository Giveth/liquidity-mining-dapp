import { useState, ChangeEvent, FC, useContext } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import { H2, H4, P } from '../styled-components/Typography';
import { ArrowButton, Card, ICardProps, MaxGIV } from './common';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import { utils } from 'ethers';
import { UserContext } from '../../context/user.context';

const GovernCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/vote.png');
		position: absolute;
		width: 274px;
		height: 313px;
		bottom: 0;
		left: 0;
		z-index: 0;
	}
`;

const Header = styled.div`
	margin-bottom: 60px;
`;

const Title = styled(H2)`
	width: 750px;
	margin-left: 15%;
`;

const Desc = styled(P)`
	max-width: 650px;
	margin-top: 22px;
	margin-left: 15%;
`;

const GovernGIVToken = styled.div`
	padding: 20px 30px;
	height: 208px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const GovernLabel = styled.span`
	color: #cabaff;
	display: flex;
	gap: 6px;
`;

const GovernInput = styled.div`
	width: 392px;
`;

const YouCanEarn = styled(GovernGIVToken)`
	padding: 20px 5px;
	max-width: 380px;
`;

const GovernGIVEarn = styled.div`
	font-family: Red Hat Text;
	font-size: 48px;
	font-style: normal;
	font-weight: 700;
	line-height: 80px;
	letter-spacing: 0em;
	text-align: left;
`;

const GovernFooter = styled.div`
	max-width: 500px;
	font-size: 12px;
	line-height: 18px;
	margin-left: 20%;
`;

const GovernCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);

	const [stacked, setStacked] = useState(0);

	const stackedChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length === 0) {
			setStacked(0);
		} else if (isNaN(+e.target.value)) {
			setStacked(stacked);
		} else {
			setStacked(+e.target.value);
		}
	};

	return (
		<GovernCardContainer activeIndex={activeIndex} index={index}>
			<div
				style={{
					position: 'relative',
					height: 0,
					top: '15%',
					left: '-6%',
				}}
			>
				<Image
					src='/images/bee1.svg'
					height='81'
					width='112'
					alt='Image of a happy bee'
				/>
			</div>
			<Header>
				<Title as='h1'>How to use your GIV</Title>
				<Desc size='small' color={'#CABAFF'}>
					Participate in Giveth governance using the GIVgarden. Govern
					on proposals with GIV and earn rewards.
				</Desc>
			</Header>
			<Row alignItems={'center'} justifyContent={'flex-end'}>
				<GovernGIVToken>
					<H4 as='h2'>If you vote with GIV tokens</H4>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<GovernLabel>Amount of GIV wrapped</GovernLabel>
							<MaxGIV>{`Max ${utils.formatEther(
								claimableAmount,
							)} GIV`}</MaxGIV>
						</Row>
						<GovernInput>
							<InputWithUnit
								value={stacked}
								unit={'GIV'}
								onChange={stackedChangeHandler}
							/>
						</GovernInput>
					</div>
				</GovernGIVToken>
				<YouCanEarn>
					<H4 as='h2'>You will earn an estimated</H4>
					<Row alignItems={'center'} justifyContent={'space-between'}>
						<GovernGIVEarn>{stacked}</GovernGIVEarn>
						<GovernLabel>
							GIV/month{' '}
							<Image
								src='/images/icons/questionMark.svg'
								height='16'
								width='16'
								alt='Operations icon'
							/>
						</GovernLabel>
					</Row>
				</YouCanEarn>
			</Row>
			<Row>
				<GovernFooter>
					The following calculators demonstrate how you can use GIV to
					participate in the GIVeconomy!{' '}
					<b>These are just simulations.</b> To participate for real,
					claim your GIV.
				</GovernFooter>
			</Row>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</GovernCardContainer>
	);
};

export default GovernCard;
