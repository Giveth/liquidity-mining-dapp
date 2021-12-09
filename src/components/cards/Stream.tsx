import { useState, ChangeEvent, FC, useContext, useEffect } from 'react';
import Image from 'next/image';
import { utils } from 'ethers';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import { H2, H4, P } from '../styled-components/Typography';
import { ArrowButton, Card, ICardProps, MaxGIV } from './common';
import { UserContext } from '../../context/user.context';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';

const StreamCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/donate.png');
		position: absolute;
		width: 305px;
		height: 333px;
		top: 0;
		right: 0;
		z-index: 0;
	}
`;

const Header = styled.div`
	margin-bottom: 60px;
`;

const Title = styled(H2)`
	width: 700px;
`;

const Desc = styled(P)`
	width: 760px;
	margin-top: 22px;
`;

const StreamRow = styled(Row)`
	padding: 20px 0;
	height: 208px;
`;

const StreamSubtitle = styled.div`
	margin-top: 16px;
	font-size: 16px;
`;

const StreamContainer = styled(Row)`
	padding: 20px 0px;
`;

const StreamValueContainer = styled(Row)`
	padding: 20px 60px;
	gap: 12px;
`;

const StreamValue = styled.div`
	font-size: 66px;
	font-weight: 500;
	line-height: 66px;
`;

const StreamPlaceholder = styled(Row)`
	font-size: 32px;
	color: #b9a7ff;
	align-self: flex-end;
	gap: 6px;
`;

const StreamLabel = styled.span`
	color: #cabaff;
`;

const StreamInput = styled.div`
	width: 392px;
`;

const GetBack = styled(StreamRow)`
	padding-left: 124px;
`;

const StreamGIVEarn = styled.div`
	font-family: Red Hat Text;
	font-size: 48px;
	font-style: normal;
	font-weight: 700;
	line-height: 80px;
	letter-spacing: 0em;
	text-align: left;
`;

const StreamFooter = styled.div`
	max-width: 500px;
	font-size: 12px;
	line-height: 18px;
`;

export const StreamCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);
	const [streamValue, setStreamValue] = useState<string>('0');

	useEffect(() => {
		const value = utils.formatEther(claimableAmount.mul(9).div(52 * 5));
		setStreamValue((+value).toFixed(2));
	}, [claimableAmount]);

	return (
		<StreamCardContainer activeIndex={activeIndex} index={index}>
			<Header>
				<Title as='h1'>How to use your GIV</Title>
				<Desc size='small' color={'#CABAFF'}>
					Welcome to the expanding GIViverse! The GIVstream aligns
					community members with the long-term success of Giveth and
					the GIVeconomy.
				</Desc>
			</Header>
			<StreamRow alignItems={'center'}>
				<StreamContainer flexDirection='column'>
					<H4 as='h2'>Your flowrate</H4>
					<StreamSubtitle>Time remaining: 4y 23d 16h</StreamSubtitle>
				</StreamContainer>
				<StreamValueContainer alignItems={'center'}>
					<Image
						src='/images/icons/thunder.svg'
						height='56'
						width='32'
						alt='Thunder image'
					/>
					<StreamValue>{streamValue}</StreamValue>
					<StreamPlaceholder>
						GIV/week
						<Image
							src='/images/icons/questionMark.svg'
							height='16'
							width='16'
							alt='Question mark icon'
						/>
					</StreamPlaceholder>
				</StreamValueContainer>
			</StreamRow>
			<Row>
				<StreamFooter>
					The following calculators demonstrate how you can use GIV to
					participate in the GIVeconomy!{' '}
					<b>These are just simulations.</b> To participate for real,
					claim your GIV.
				</StreamFooter>
			</Row>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</StreamCardContainer>
	);
};
