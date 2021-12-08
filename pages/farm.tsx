import GIVfarmView from '@/components/views/Farm.view';
import Head from 'next/head';

export default function GIVgardenRoute() {
	return (
		<>
			<Head>
				<title>GIVgarden</title>
			</Head>
			<GIVfarmView />
		</>
	);
}
