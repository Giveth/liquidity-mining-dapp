import {
	createContext,
	FC,
	ReactNode,
	useState,
	useEffect,
	useContext,
	SetStateAction,
} from 'react';
import { fetchAirDropClaimData, hasClaimedAirDrop } from '@/lib/claim';
import { Zero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { useOnboard } from '.';
import { Dispatch } from 'react';

export enum GiveDropStateType {
	notConnected,
	Success,
	Missed,
	Claimed,
}
export interface IUserContext {
	isloading: boolean;
	totalAmount: BigNumber;
	giveDropState: GiveDropStateType;
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
	goNextStep: () => void;
	goPreviousStep: () => void;
	getClaimData: () => Promise<void>;
	resetWallet: () => void;
}
const initialValue = {
	isloading: false,
	totalAmount: Zero,
	giveDropState: GiveDropStateType.notConnected,
	step: 0,
	setStep: () => {},
	goNextStep: () => {},
	goPreviousStep: () => {},
	getClaimData: async () => {},
	resetWallet: () => {},
};
export const UserContext = createContext<IUserContext>(initialValue);

type Props = {
	children?: ReactNode;
};
export const UserProvider: FC<Props> = ({ children }) => {
	const [step, setStep] = useState(0);
	const [isloading, setIsLoading] = useState(false);
	const [totalAmount, setTotalAmount] = useState<BigNumber>(
		initialValue.totalAmount,
	);

	const [giveDropState, setGiveDropState] = useState<GiveDropStateType>(
		GiveDropStateType.notConnected,
	);

	const { address, network } = useOnboard();

	const getClaimData = async () => {
		setTotalAmount(Zero);
		setStep(0);
		setIsLoading(true);
		const claimData = await fetchAirDropClaimData(address);
		if (claimData) {
			const _hasClaimed = await hasClaimedAirDrop(address);
			// const _hasClaimed = false;
			setTotalAmount(BigNumber.from(claimData.amount));
			setIsLoading(false);
			if (!_hasClaimed) {
				setGiveDropState(GiveDropStateType.Success);
			} else {
				setGiveDropState(GiveDropStateType.Claimed);
			}
			return;
		}
		setGiveDropState(GiveDropStateType.Missed);
		setTotalAmount(Zero);
	};

	const resetWallet = () => {
		setGiveDropState(GiveDropStateType.notConnected);
		setTotalAmount(Zero);
		setStep(0);
	};

	useEffect(() => {
		resetWallet();
	}, [address]);

	return (
		<UserContext.Provider
			value={{
				isloading,
				totalAmount,
				giveDropState,
				step,
				setStep,
				goNextStep: () => {
					setStep(step + 1);
				},
				goPreviousStep: () => {
					setStep(step - 1);
				},
				getClaimData,
				resetWallet,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export default function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('User context not found!');
	}

	return context;
}
