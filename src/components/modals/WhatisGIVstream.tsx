import config from '@/configuration';
import {
	P,
	B,
	H5,
	neutralColors,
	IconGIVStream,
	Title,
	GLink,
	brandColors,
	IconExternalLink,
	OulineButton,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { Row } from '../styled-components/Grid';
import { Modal, IModal } from './Modal';
import Link from 'next/link';

interface IWhatisGIVstreamModal extends IModal {}

export const WhatisGIVstreamModal: FC<IWhatisGIVstreamModal> = ({
	showModal,
	setShowModal,
}) => {
	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<WhatisGIVstreamContainer>
				<TitleRow alignItems='center' justifyContent='center'>
					<IconGIVStream size={24} />
					<Title>What is GIVstream?</Title>
				</TitleRow>
				<Desc>
					Welcome to the expanding GIViverse! The GIVstream aligns
					community members with the long term success of Giveth and
					the GIVeconomy.
				</Desc>
				<H5 weight={900}>How it Works? </H5>
				<Desc>
					When you earn GIV, part will be liquid and part will add to
					your GIVstream flowrate after you claim. As time passes and
					the GIVstream flows, a greater percentage of the total GIV
					you earn is liquid. The GIVstream flows until November 23,
					2026 at which point the GIVeconomy will be full power!
				</Desc>
				<LinksRow alignItems='center' justifyContent='center'>
					<Link href='/givstream' passHref>
						<GLink>
							<LinksRow justifyContent='center'>
								View Your GIVstream{' '}
								<IconExternalLink
									size={16}
									color={'currentColor'}
								/>
							</LinksRow>
						</GLink>
					</Link>
				</LinksRow>
				<GotItButton
					label='GOT IT'
					onClick={() => {
						setShowModal(false);
					}}
				/>
			</WhatisGIVstreamContainer>
		</Modal>
	);
};

const WhatisGIVstreamContainer = styled.div`
	padding: 56px 24px 24px;
	background-image: url('/images/stream1.svg');
	background-repeat: no-repeat;
	width: 570px;
	color: ${neutralColors.gray[100]};
`;

const TitleRow = styled(Row)`
	gap: 16px;
	margin-bottom: 41px;
`;

const Desc = styled(P)`
	margin-bottom: 41px;
`;

const LinksRow = styled(Row)`
	gap: 8px;
	color: ${brandColors.cyan[500]};
	margin-bottom: 24px;
`;

const GotItButton = styled(OulineButton)`
	width: 316px;
	margin: 0 auto;
`;
