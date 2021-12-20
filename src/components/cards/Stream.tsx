import { useState, ChangeEvent, FC, useContext, useEffect } from 'react';
import Image from 'next/image';
import { utils } from 'ethers';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import { H2, H4, P } from '../styled-components/Typography';
import { ArrowButton, Card, Header, ICardProps, MaxGIV } from './common';
import { UserContext } from '../../context/user.context';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';

import { useTokenDistro } from '@/context/tokenDistro.context';
import { formatWeiHelper } from '@/helpers/number';

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
	@media only screen and (max-width: 1360px) {
		padding-right: 112px;
		::before {
			width: 240px;
			background-size: contain;
			background-repeat: no-repeat;
		}
	}
	@media only screen and (max-width: 1120px) {
		padding: 8px;
		::before {
			background-image: none;
		}
	}
`;

const Title = styled(H2)`
	width: 700px;
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;

const Desc = styled(P)`
	width: 700px;
	margin-top: 22px;
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
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

export const StreamCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);
	const [streamValue, setStreamValue] = useState<string>('0');

	const { tokenDistroHelper } = useTokenDistro();

	useEffect(() => {
		setStreamValue(
			formatWeiHelper(
				tokenDistroHelper.getStreamPartTokenPerWeek(claimableAmount),
			),
		);
	}, [claimableAmount, claimableAmount, tokenDistroHelper]);

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
					<StreamPlaceholder>GIV/week</StreamPlaceholder>
				</StreamValueContainer>
			</StreamRow>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</StreamCardContainer>
	);
};
