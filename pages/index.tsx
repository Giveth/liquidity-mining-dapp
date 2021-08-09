import Head from 'next/head'
import HomeView from '../src/components/views/Home.view'

export default function HomeRoute() {
  return (
    <>
     <Head>
        <title>Giveth Economy</title>
     </Head>
     <HomeView />
    </>
  )
}
