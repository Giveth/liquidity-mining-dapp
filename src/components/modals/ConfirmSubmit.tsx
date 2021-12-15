import config from '@/configuration';
import {
	B,
	P,
	brandColors,
	Caption,
	GLink,
	H5,
	H6,
	IconExternalLink,
	neutralColors,
} from '@giveth/ui-design-system';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import TikAnimation from '../../animations/tik.json';
import ErrorAnimation from '../../animations/error.json';
import styled from 'styled-components';
import { FC } from 'react';

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const tikAnimationOptions = {
	loop: false,
	autoplay: true,
	animationData: TikAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const errorAnimationOptions = {
	loop: false,
	autoplay: true,
	animationData: ErrorAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

interface IConfirmSubmitProps {
	title: string;
	walletNetwork: number;
	txHash: string;
}

export const SubmittedInnerModal: FC<IConfirmSubmitProps> = ({
	title,
	walletNetwork,
	txHash,
}) => {
	return (
		<>
			<Caption>{title}</Caption>
			<Lottie
				options={loadingAnimationOptions}
				height={100}
				width={100}
			/>
			<TxSubmit weight={700}>
				{txHash && 'Transaction submitted'}
			</TxSubmit>
			{txHash && (
				<BlockExplorerLink
					href={`${
						walletNetwork === config.MAINNET_NETWORK_NUMBER
							? config.MAINNET_NETWORK.blockExplorerUrls
							: config.XDAI_NETWORK.blockExplorerUrls
					}
			/tx/${txHash}`}
					target='_blank'
					size='Big'
				>
					View on{' '}
					{walletNetwork === config.MAINNET_NETWORK_NUMBER
						? config.MAINNET_NETWORK.blockExplorerName
						: config.XDAI_NETWORK.blockExplorerName}
					&nbsp;
					<IconExternalLink size={16} color={'currentColor'} />
				</BlockExplorerLink>
			)}
		</>
	);
};

export const ConfirmedInnerModal: FC<IConfirmSubmitProps> = ({
	title,
	walletNetwork,
	txHash,
}) => {
	return (
		<>
			<B>{title}</B>
			<Lottie options={tikAnimationOptions} height={100} width={100} />
			<TxConfirm weight={700}>Transaction confirmed!</TxConfirm>
			<Info>It may take a few minutes for the UI to update</Info>
			<BlockExplorerLink
				href={`${
					walletNetwork === config.MAINNET_NETWORK_NUMBER
						? config.MAINNET_NETWORK.blockExplorerUrls
						: config.XDAI_NETWORK.blockExplorerUrls
				}
							/tx/${txHash}`}
				target='_blank'
				size='Big'
			>
				View on{' '}
				{walletNetwork === config.MAINNET_NETWORK_NUMBER
					? config.MAINNET_NETWORK.blockExplorerName
					: config.XDAI_NETWORK.blockExplorerName}
				&nbsp;
				<IconExternalLink size={16} color={'currentColor'} />
			</BlockExplorerLink>
		</>
	);
};

export const ErrorInnerModal: FC<IConfirmSubmitProps> = ({
	title,
	walletNetwork,
	txHash,
}) => {
	return (
		<>
			<Caption>{title}</Caption>
			<Lottie options={errorAnimationOptions} height={100} width={100} />
			<TxSubmit weight={700}>{txHash}</TxSubmit>
			{txHash && (
				<BlockExplorerLink
					href={`${
						walletNetwork === config.MAINNET_NETWORK_NUMBER
							? config.MAINNET_NETWORK.blockExplorerUrls
							: config.XDAI_NETWORK.blockExplorerUrls
					}
			/tx/${txHash}`}
					target='_blank'
					size='Big'
				>
					View on{' '}
					{walletNetwork === config.MAINNET_NETWORK_NUMBER
						? config.MAINNET_NETWORK.blockExplorerName
						: config.XDAI_NETWORK.blockExplorerName}
					&nbsp;
					<IconExternalLink size={16} color={'currentColor'} />
				</BlockExplorerLink>
			)}
		</>
	);
};

const TxSubmit = styled(H6)`
	color: ${neutralColors.gray[100]};
	margin-top: 18px;
	margin-bottom: 16px;
`;

const TxConfirm = styled(H5)`
	color: ${neutralColors.gray[100]};
	margin: 12px 0;
`;

const Info = styled(P)`
	margin-bottom: 12px;
`;

const BlockExplorerLink = styled(GLink)`
	width: 100%;
	color: ${brandColors.cyan[500]};
	&:hover {
		color: ${brandColors.cyan[300]};
	}
`;
