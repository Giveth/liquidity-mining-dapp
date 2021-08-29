export const fetchMerkleResults = async (): Promise<any> => {
	const response = await fetch(`/merkle_distributor_result_xdai.json`);
	return await response.json();
};
