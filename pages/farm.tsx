import Head from 'next/head';
import FarmView from '../src/components/views/Farm.view';

export default function HomeRoute() {
	return (
		<>
			<Head>
				<title>Giveth Economy</title>
			</Head>
			<FarmView />
		</>
	);
}
