/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import '../styles/globals.css'
import '../styles/styles.css'

import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import { Toaster } from 'react-hot-toast'

import { ClientOnly, NavBar } from '../components'
import { LoadingContextProvider } from '../context/loadingContext'

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
    return (
        <ClientOnly>
            <div className='my-6 lg:my-12'>
                <Toaster />
                <Provider session={pageProps.session}>
                    <LoadingContextProvider>
                        <NavBar />
                        <AnimatePresence key={router.pathname}>
                            <Component {...pageProps} />
                        </AnimatePresence>
                    </LoadingContextProvider>
                </Provider>
            </div>
        </ClientOnly>
    )
}
export default MyApp
