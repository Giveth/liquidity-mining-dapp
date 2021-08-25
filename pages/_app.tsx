import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Onboard } from '../src/providers/onboard'
import { User } from '../src/providers/user'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<User>
			<Onboard>
				<Component {...pageProps} />
			</Onboard>
		</User>
	)
}
export default MyApp
