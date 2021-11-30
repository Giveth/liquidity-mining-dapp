import { FC, useContext, useEffect, useState } from 'react';
import { Modal, IModal } from './Modal';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import CheckAnimation from '../../animations/check.json';
import {
	brandColors,
	neutralColors,
	Button,
	Caption,
	IconGIVStream,
	IconHelp,
	Lead,
	P,
	Title,
	H6,
	GLink,
	OulineButton,
	IconGIVGarden,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { IconGIV } from '../Icons/GIV';
import { BigNumber } from '@ethersproject/bignumber';
import { OnboardContext } from '@/context/onboard.context';
import { getGIVPrice } from '@/services/subgraph';
import { Zero } from '@/helpers/number';
interface IHarvestAllModalProps extends IModal {}

enum States {
	Harvest,
	Waiting,
	Confirmed,
}

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const checkAnimationOptions = {
	loop: false,
	autoplay: true,
	animationData: CheckAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

export const HarvestAllModal: FC<IHarvestAllModalProps> = ({
	showModal,
	setShowModal,
}) => {
	const [state, setState] = useState(States.Harvest);
	const [givBackAmount, setGivBackAmount] = useState<BigNumber>(
		BigNumber.from('10'),
	);
	const [price, setPrice] = useState(0);
	const { network: walletNetwork } = useContext(OnboardContext);

	useEffect(() => {
		getGIVPrice(walletNetwork).then(price => {
			setPrice(price);
		});
	}, [walletNetwork]);

	const calcUSD = (amount: BigNumber) => {
		const usd = (parseInt(amount.toString()) * price).toFixed(2);
		return usd;
	};

	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			// title='Your GIVgardens Rewards'
		>
			{state === States.Harvest && (
				<HarvestAllModalContainer>
					<HarvestAllModalTitleRow alignItems='center'>
						<HarvestAllModalTitle weight={700}>
							Your GIVgarden Rewards
						</HarvestAllModalTitle>
						<TitleIcon size={24} />
					</HarvestAllModalTitleRow>
					<GIVBoxWithPrice
						amount={givBackAmount}
						price={calcUSD(givBackAmount)}
					/>
					<StyledGivethIcon>
						<IconGIV size={64} />
					</StyledGivethIcon>
					<GIVAmount>{257.9055}</GIVAmount>
					<USDAmount>~${348.74}</USDAmount>
					<HelpRow
						alignItems='center'
						justifyContent='center'
						gap='8px'
					>
						<Caption>Your additional GIVstream flowrate</Caption>
						<IconHelp size={16} color={brandColors.deep[100]} />
					</HelpRow>
					<RateRow
						alignItems='center'
						justifyContent='center'
						gap='4px'
					>
						<IconGIVStream size={24} />
						<GIVRate>{9.588}</GIVRate>
						<Lead>GIV/week</Lead>
					</RateRow>
					<HarvestButton
						label='HARVEST'
						size='medium'
						buttonType='primary'
					/>
					<CancelButton
						label='CANCEL'
						size='medium'
						buttonType='texty'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</HarvestAllModalContainer>
			)}
			{state === States.Waiting && (
				<WitingModalContainer>
					<Lottie
						options={loadingAnimationOptions}
						height={100}
						width={100}
					/>
					<WaitinMessage weight={700}>
						Please confirm transaction in your wallet
					</WaitinMessage>
					<CancelButton
						label='CANCEL'
						size='medium'
						buttonType='texty'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</WitingModalContainer>
			)}
			{state === States.Confirmed && (
				<ConfirmedModalContainer>
					<Lottie
						options={checkAnimationOptions}
						height={152}
						width={152}
					/>
					<ConfirmedMessage weight={700}>
						Transaction confirmed!
					</ConfirmedMessage>
					<ConfirmedData>
						<CDFirst>Claimed</CDFirst>
						<CDSecond>
							<CDInfo gap='4px'>
								<Lead>{257.9055}</Lead>
								<Lead>GIV</Lead>
							</CDInfo>
							<CDLink>View on Blockscout</CDLink>
						</CDSecond>
					</ConfirmedData>
					<ConfirmedData>
						<CDFirst>Added to GIVsteram</CDFirst>
						<CDSecond>
							<CDInfo gap='4px'>
								<Lead>{9.588}</Lead>
								<Lead>GIV/week</Lead>
							</CDInfo>
							<CDLink>View your GIVstream</CDLink>
						</CDSecond>
					</ConfirmedData>
					<DoneButton
						label='Done'
						size='medium'
						onClick={() => {
							setShowModal(false);
						}}
					/>
				</ConfirmedModalContainer>
			)}
		</Modal>
	);
};

interface IGIVBoxWithPriceProps {
	amount: BigNumber;
	price: string;
}

const GIVBoxWithPrice: FC<IGIVBoxWithPriceProps> = ({ amount, price }) => {
	return (
		<>
			<GIVBoxWithPriceContainer alignItems='center'>
				<GIVBoxWithPriceIcon size={40} />
				<GIVBoxWithPriceAmount>
					{amount.toString()}
				</GIVBoxWithPriceAmount>
				<GIVBoxWithPriceUSD>~{price}</GIVBoxWithPriceUSD>
			</GIVBoxWithPriceContainer>
		</>
	);
};

const GIVBoxWithPriceContainer = styled(Row)`
	background-color: ${brandColors.giv[500]}66;
	margin: 16px 0;
	border-radius: 8px;
	padding: 24px;
	gap: 8px;
`;

const GIVBoxWithPriceIcon = styled(IconGIV)``;

const GIVBoxWithPriceAmount = styled(Title)`
	margin-left: 8px;
	color: ${neutralColors.gray[100]};
`;

const GIVBoxWithPriceUSD = styled(P)`
	color: ${brandColors.deep[200]};
`;

const HarvestAllModalContainer = styled.div`
	width: 686px;
	padding: 24px;
`;

const HarvestAllModalTitleRow = styled(Row)`
	gap: 14px;
`;

const HarvestAllModalTitle = styled(H6)`
	color: ${neutralColors.gray[100]};
`;

const TitleIcon = styled(IconGIVGarden)``;

const StyledGivethIcon = styled.div`
	margin-top: 48px;
	margin-bottom: 23px;
`;

const GIVAmount = styled(Title)`
	color: ${neutralColors.gray[100]};
`;

const USDAmount = styled(P)`
	margin-bottom: 22px;
	color: ${brandColors.deep[200]};
`;

const HelpRow = styled(Row)`
	margin-bottom: 16px;
`;

const RateRow = styled(Row)`
	margin-bottom: 36px;
`;

const GIVRate = styled(Lead)`
	color: ${neutralColors.gray[100]};
`;

const HarvestButton = styled(Button)`
	display: block;
	width: 316px;
	margin: 0 auto 16px;
`;

const CancelButton = styled(Button)`
	width: 316px;
	margin: 0 auto 8px;
`;

const WitingModalContainer = styled.div`
	width: 546px;
	padding: 24px;
`;

const WaitinMessage = styled(H6)`
	color: ${neutralColors.gray[100]};
	padding: 24px;
	margin-top: 18px;
	margin-bottom: 40px;
`;

const ConfirmedModalContainer = styled.div`
	width: 522px;
	padding: 24px 86px;
`;

const ConfirmedMessage = styled(H6)`
	color: ${neutralColors.gray[100]};
	margin-top: 16px;
`;

const ConfirmedData = styled(Row)`
	margin-top: 32px;
`;

const CDFirst = styled(P)`
	color: ${neutralColors.gray[100]};
	text-align: left;
	flex: 1;
`;

const CDSecond = styled(P)`
	color: ${neutralColors.gray[100]};
	flex: 1;
`;

const CDInfo = styled(Row)`
	div:first-child {
		color: ${neutralColors.gray[100]};
	}
	div:last-child {
		color: ${brandColors.giv[300]};
	}
`;

const CDLink = styled(GLink)`
	text-align: left;
	display: block;
	color: ${brandColors.cyan[500]};
`;

const DoneButton = styled(OulineButton)`
	padding: 16px 135px;
	margin-top: 32px;
`;
