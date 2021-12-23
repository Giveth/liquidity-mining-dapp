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
	totalAmount: BigNumber;
	giveDropState: GiveDropStateType;
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
	goNextStep: () => void;
	goPreviousStep: () => void;
}
const initialValue = {
	totalAmount: Zero,
	giveDropState: GiveDropStateType.notConnected,
	step: 0,
	setStep: () => {},
	goNextStep: () => {},
	goPreviousStep: () => {},
};
export const UserContext = createContext<IUserContext>(initialValue);

type Props = {
	children?: ReactNode;
};
export const UserProvider: FC<Props> = ({ children }) => {
	const [step, setStep] = useState(0);
	const [totalAmount, setTotalAmount] = useState<BigNumber>(
		initialValue.totalAmount,
	);

	const [giveDropState, setGiveDropState] = useState<GiveDropStateType>(
		GiveDropStateType.notConnected,
	);

	const { address, network } = useOnboard();

	useEffect(() => {
		const getClaimData = async () => {
			setTotalAmount(Zero);
			setStep(0);

			const claimData = await fetchAirDropClaimData(address);
			if (claimData) {
				const _hasClaimed = await hasClaimedAirDrop(address);
				// const _hasClaimed = false;
				console.log('hasClaimed:', _hasClaimed);
				if (!_hasClaimed) {
					setTotalAmount(BigNumber.from(claimData.amount));
					setGiveDropState(GiveDropStateType.Success);
					return;
				} else {
					setGiveDropState(GiveDropStateType.Claimed);
					return;
				}
			}
			setGiveDropState(GiveDropStateType.Missed);
			setTotalAmount(Zero);
		};

		setGiveDropState(GiveDropStateType.notConnected);
		if (address) {
			getClaimData();
		}
	}, [address, network]);

	return (
		<UserContext.Provider
			value={{
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
