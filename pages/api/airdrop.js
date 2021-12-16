import airdrops from './merkle_distributor_xdai_result.json';
const handler = (req, res) => {
	const { body, method } = req;
	if (method === 'POST') {
		const claim = airdrops.claims[body.address];
		if (claim) {
			res.status(200).json(claim);
		} else {
			res.status(404).json();
		}
	}
};

export default handler;
