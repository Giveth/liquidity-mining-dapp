import { createContext, FC, ReactNode, useState } from 'react';
import { fetchClaimData, hasClaimed } from '../helpers/claim';
import { Zero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';

export interface IUserContext {
	userAddress: string;
	claimableAmount: BigNumber;
	submitUserAddress: (address: string) => void;
}
const initialValue = {
	userAddress: '',
	claimableAmount: Zero,
	submitUserAddress: () => {},
};
export const UserContext = createContext<IUserContext>(initialValue);

type Props = {
	children?: ReactNode;
};
export const UserProvider: FC<Props> = ({ children }) => {
	const [userAddress, setUserAddress] = useState<string>(
		initialValue.userAddress,
	);
	const [claimableAmount, setClaimableAmount] = useState<BigNumber>(
		initialValue.claimableAmount,
	);

	const submitUserAddress = async (address: string) => {
		setUserAddress(address);
		setClaimableAmount(Zero);

		const claimData = await fetchClaimData(address);
		if (claimData) {
			const _hasClaimed = await hasClaimed(address, claimData);
			console.log('hasClaimed:', _hasClaimed);
			if (!_hasClaimed) {
				setClaimableAmount(BigNumber.from(claimData.amount));
				return;
			}
		}

		setClaimableAmount(Zero);
	};

	return (
		<UserContext.Provider
			value={{
				userAddress,
				claimableAmount,
				submitUserAddress,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
