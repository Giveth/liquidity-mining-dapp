import { createContext, FC, ReactNode, useState, useContext } from 'react';
import { fetchAirDropClaimData, hasClaimedAirDrop } from '@/lib/claim';
import { Zero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';

export enum GiveDropStateType {
	notConnected,
	Success,
	Missed,
	Claimed,
}
export interface IUserContext {
	userAddress: string;
	totalAmount: BigNumber;
	giveDropState: GiveDropStateType;
	submitUserAddress: (address: string) => void;
	resetWallet: () => void;
}
const initialValue = {
	userAddress: '',
	totalAmount: Zero,
	giveDropState: GiveDropStateType.notConnected,
	submitUserAddress: () => {},
	resetWallet: () => {},
};
export const UserContext = createContext<IUserContext>(initialValue);

type Props = {
	children?: ReactNode;
};
export const UserProvider: FC<Props> = ({ children }) => {
	const [userAddress, setUserAddress] = useState<string>(
		initialValue.userAddress,
	);
	const [totalAmount, setTotalAmount] = useState<BigNumber>(
		initialValue.totalAmount,
	);

	const [giveDropState, setGiveDropState] = useState<GiveDropStateType>(
		GiveDropStateType.notConnected,
	);

	const submitUserAddress = async (address: string) => {
		setUserAddress(address);
		setTotalAmount(Zero);

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

	const resetWallet = () => {
		setGiveDropState(GiveDropStateType.notConnected);
	};

	return (
		<UserContext.Provider
			value={{
				userAddress,
				totalAmount,
				giveDropState,
				resetWallet,
				submitUserAddress,
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
