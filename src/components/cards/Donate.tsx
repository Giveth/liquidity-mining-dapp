import { useState, ChangeEvent, FC, useContext, useEffect } from 'react';
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
import { UserContext } from '../../context/user.context';
import { utils } from 'ethers';

const DonateCardContainer = styled(Card)`
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
	margin-top: 22px;
`;

const DonateRow = styled(Row)`
	padding: 20px 0;
	height: 208px;
`;

const DonateLabel = styled.span`
	color: #cabaff;
	display: flex;
	gap: 6px;
`;

const DonateInput = styled.div`
	width: 392px;
`;

const MaxDonateGIV = styled(MaxGIV)`
	cursor: pointer;
`;

const GetBack = styled(DonateRow)`
	padding-left: 124px;
`;

const DonateGIVEarn = styled.div`
	font-family: Red Hat Text;
	font-size: 48px;
	font-style: normal;
	font-weight: 700;
	line-height: 80px;
	letter-spacing: 0em;
	text-align: left;
`;

const PoolCardContainer = styled.div`
	z-index: 1;
`;

const PoolCardTitle = styled.div`
	font-size: 16px;
	padding-bottom: 12px;
`;

const PoolCard = styled.div`
	width: 350px;
	height: 164px;
	padding: 10px 30px;

	background: #211985;
	border-radius: 16px;
	z-index: 1;
`;

const PoolItems = styled.div`
	padding: 12px 0;
`;

const PoolItem = styled.div`
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	display: flex;
	gap: 6px;
`;

const PoolItemBold = styled.div`
	font-size: 16px;
	font-weight: 500;
	line-height: 40px;
	display: flex;
	gap: 6px;
`;

const DonateFooter = styled.div`
	max-width: 500px;
	font-size: 12px;
	line-height: 18px;
`;

export const DonateCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);

	const [donation, setDonation] = useState<any>(0);
	const [potentialClaim, setPotentialClaim] = useState<number>(0);
	const [earnEstimate, setEarnEstimate] = useState<number>(0);

	const stackedChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length === 0) {
			setDonation(undefined);
		} else if (isNaN(+e.target.value)) {
			setDonation(donation);
		} else {
			if (claimableAmount.gte(utils.parseEther(e.target.value)))
				setDonation(+e.target.value);
		}
	};

	useEffect(() => {
		if (claimableAmount) {
			setDonation(utils.formatEther(claimableAmount));
		}
	}, [claimableAmount]);

	useEffect(() => {
		const donationWithGivBacks = donation * 0.75;
		setPotentialClaim(donationWithGivBacks * 0.1);
		setEarnEstimate((donationWithGivBacks * 0.9) / (52 * 5));
	}, [donation]);

	return (
		<DonateCardContainer activeIndex={activeIndex} index={index}>
			<Header>
				<Title as='h1'>How to use your GIV</Title>
				<Desc size='small' color={'#CABAFF'}>
					Donate to verified projects to get GIV with GIVbacks. The
					project gets 100% of your donation, and you get GIV back
					from Giveth!
				</Desc>
			</Header>
			<Row alignItems={'center'} justifyContent={'space-between'}>
				<DonateRow
					flexDirection='column'
					justifyContent='space-between'
				>
					<H4 as='h2'>If you donate GIV</H4>
					<div>
						<Row
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<DonateLabel>Your donation</DonateLabel>
							<MaxDonateGIV
								onClick={() =>
									setDonation(
										Number(
											utils.formatEther(claimableAmount),
										),
									)
								}
							>{`Max ${utils.formatEther(
								claimableAmount,
							)} GIV`}</MaxDonateGIV>
						</Row>
						<DonateInput>
							<InputWithUnit
								type='number'
								value={donation}
								unit={'GIV'}
								onChange={stackedChangeHandler}
							/>
						</DonateInput>
					</div>
				</DonateRow>
				<PoolCardContainer>
					<PoolCard>
						<PoolItems>
							<Row justifyContent='space-between'>
								<PoolItem>GIVbacks</PoolItem>
								<PoolItemBold>
									<Image
										src='/images/icons/star.svg'
										height='16'
										width='16'
										alt='Star icon'
									/>
									75%
								</PoolItemBold>
							</Row>
							<Row justifyContent='space-between'>
								<PoolItem>Claimable</PoolItem>
								<PoolItemBold>
									{potentialClaim.toFixed(2)} GIV
								</PoolItemBold>
							</Row>
							<Row justifyContent='space-between'>
								<PoolItem>Streaming</PoolItem>
								<PoolItemBold>
									{earnEstimate.toFixed(2)} GIV/week
								</PoolItemBold>
							</Row>
						</PoolItems>
					</PoolCard>
				</PoolCardContainer>
			</Row>
			<Row>
				<DonateFooter>
					The following calculators demonstrate how you can use GIV to
					participate in the GIVeconomy!{' '}
					<b>These are just simulations.</b> To participate for real,
					claim your GIV.
				</DonateFooter>
			</Row>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</DonateCardContainer>
	);
};
