import { useState, ChangeEvent, FC, useContext, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import { H2, H4, P } from '../styled-components/Typography';
import {
	APRRow,
	ArrowButton,
	Card,
	Header,
	ICardProps,
	ImpactCard,
	ImpactCardInput,
	ImpactCardLabel,
	MaxGIV,
	MaxStakeGIV,
	PoolCard,
	PoolCardContainer,
	PoolCardFooter,
	PoolItem,
	PoolItemBold,
	PoolItems,
} from './common';
import {
	ClaimViewContext,
	IClaimViewCardProps,
} from '../views/claim/Claim.view';
import { UserContext } from '../../context/user.context';
import { utils, BigNumber as EthersBigNumber, constants } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { formatEthHelper, formatWeiHelper, Zero } from '../../helpers/number';
import BigNumber from 'bignumber.js';
import { Subline, neutralColors, IconHelp } from '@giveth/ui-design-system';
import { IconWithTooltip } from '../IconWithToolTip';
const DonateCardContainer = styled(Card)`
	padding-right: 154px;
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
const GdropDonateTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 260px;
`;

const Title = styled.span`
	font-size: 58px;
	margin: 7px 0px 10px 0px;
	width: 700px;
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
	font-weight: 700;
`;

const Desc = styled(P)`
	width: 700px;
	margin-top: 22px;
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;

export const DonateCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { activeIndex, goNextStep } = useContext(ClaimViewContext);
	const { claimableAmount } = useContext(UserContext);

	const [donation, setDonation] = useState<any>(0);
	const [potentialClaim, setPotentialClaim] = useState<EthersBigNumber>(
		constants.Zero,
	);
	const [earnEstimate, setEarnEstimate] = useState<BigNumber>(Zero);
	const { tokenDistroHelper } = useTokenDistro();

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
		let _donation = 0;
		if (!isNaN(donation)) {
			_donation = donation;
		}
		const donationWithGivBacks = _donation * 0.75;
		const convertedStackedWithApr = EthersBigNumber.from(
			donationWithGivBacks.toFixed(0),
		).mul(constants.WeiPerEther);
		setPotentialClaim(
			tokenDistroHelper.getLiquidPart(convertedStackedWithApr),
		);
		setEarnEstimate(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				convertedStackedWithApr,
			),
		);
		// setPotentialClaim(donationWithGivBacks * 0.1);
		// setEarnEstimate((donationWithGivBacks * 0.9) / (52 * 5));
	}, [donation]);

	return (
		<DonateCardContainer activeIndex={activeIndex} index={index}>
			<Header>
				<Title>Donate & get GIV back</Title>
				<Desc size='small' color={'#CABAFF'}>
					Donate to verified projects to get GIV with GIVbacks. The
					project gets 100% of your donation, and you get rewarded by
					Giveth with GIV!
				</Desc>
			</Header>
			<APRRow alignItems={'center'} justifyContent={'space-between'}>
				<ImpactCard>
					<H4 as='h2'>If you donate your GIVdrop</H4>
					<div>
						<Row justifyContent={'space-between'}>
							<ImpactCardLabel>
								Your donation
								<IconWithTooltip
									icon={<IconHelp size={16} />}
									direction={'top'}
								>
									<GdropDonateTooltip>
										Donations made in most tokens are
										eligible for GIVbacks.
									</GdropDonateTooltip>
								</IconWithTooltip>
							</ImpactCardLabel>
							<MaxStakeGIV
								onClick={() =>
									setDonation(
										Number(
											utils.formatEther(claimableAmount),
										),
									)
								}
							>{`Max ${utils.formatEther(
								claimableAmount,
							)} GIV`}</MaxStakeGIV>
						</Row>
						<ImpactCardInput>
							<InputWithUnit
								type='number'
								value={donation}
								unit={'GIV'}
								onChange={stackedChangeHandler}
							/>
						</ImpactCardInput>
					</div>
				</ImpactCard>
				<PoolCardContainer>
					<PoolCard>
						<PoolItems>
							<Row justifyContent='space-between'>
								<PoolItem>GIVbacks</PoolItem>
								<PoolItemBold>
									{formatWeiHelper(potentialClaim)} GIV
								</PoolItemBold>
							</Row>
							<Row justifyContent='space-between'>
								<PoolItem>Streaming</PoolItem>
								<PoolItemBold>
									{formatWeiHelper(earnEstimate)} GIV/week
								</PoolItemBold>
							</Row>
						</PoolItems>
					</PoolCard>
				</PoolCardContainer>
			</APRRow>
			<PoolCardFooter>
				The following calculators demonstrate how you can use GIV to
				participate in the GIVeconomy!{' '}
				<b>These are just simulations.</b> To participate for real,
				claim your GIV.
			</PoolCardFooter>
			{activeIndex === index && <ArrowButton onClick={goNextStep} />}
		</DonateCardContainer>
	);
};
