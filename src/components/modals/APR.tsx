import { FC } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
import {
	H6,
	GLink,
	IconCalculator,
	neutralColors,
	brandColors,
	SublineBold,
	Subline,
	B,
} from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { Row } from '../styled-components/Grid';
import { PoolStakingConfig } from '@/types/config';
import { USDInput } from '../USDInput';
import { useBalances } from '@/context/balance.context';
import { useTokenDistro } from '@/context/tokenDistro.context';
import Image from 'next/image';

interface IAPRModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	maxAmount: BigNumber;
}

export const APRModal: FC<IAPRModalProps> = ({
	showModal,
	setShowModal,
	poolStakingConfig,
	maxAmount,
}) => {
	const { tokenDistroHelper } = useTokenDistro();

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<APRModalContainer>
				<Row gap='8px' alignItems='center'>
					<APRLabel>APR</APRLabel>
					{/* <IconCalculator size={16} /> */}
				</Row>
				{/* <InputLabel size='big'>{`${poolStakingConfig.title} ${poolStakingConfig.unit} Staking`}</InputLabel>
				<USDInput
					maxAmount={maxAmount}
					poolStakingConfig={poolStakingConfig}
				/> */}
				<DescContainer>
					<AlertRow alignItems='flex-end'>
						<Image
							width={24}
							height={24}
							src='/images/alert.svg'
							alt='alert'
						/>
						<SublineBold>IMPORTANT</SublineBold>
					</AlertRow>
					<Desc>
						Part of your earnings from the GIVfarm go into
						increasing your GIVstream flowrate.
					</Desc>
					<DescTitle>Earnings breakdown </DescTitle>
					<Desc>
						Claimable immediately:{' '}
						{tokenDistroHelper.GlobalReleasePercentage}%
					</Desc>
					<Desc>
						Increasing your GIVstream:{' '}
						{100 - tokenDistroHelper.GlobalReleasePercentage}%
					</Desc>
				</DescContainer>
			</APRModalContainer>
		</Modal>
	);
};

const APRModalContainer = styled.div`
	width: 370px;
	padding: 16px 24px;
	margin-bottom: 22px;
`;

const APRLabel = styled(H6)``;

const InputLabel = styled(GLink)`
	text-align: left;
	color: ${neutralColors.gray[100]};
	margin-bottom: 8px;
`;

const DescContainer = styled.div`
	color: ${neutralColors.gray[100]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.mustard[800]};
	border-radius: 8px;
	padding: 18px;
	margin-top: 16px;
	margin-bottom: 16px;
`;

const AlertRow = styled(Row)`
	gap: 8px;
	margin-bottom: 8px;
`;

const Desc = styled(Subline)`
	// margin: 8px 0;
	text-align: justify;
`;

const DescTitle = styled(Subline)`
	font-weight: bold;
	margin-top: 8px;
	text-align: justify;
`;
