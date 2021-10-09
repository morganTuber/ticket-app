import { useRouter } from 'next/router'
import progressBar from 'nprogress'
import { createContext, FC, useEffect } from 'react'

const loadingContext = createContext(null)

const LoadingContextProvider: FC = ({ children }): JSX.Element => {
    const router = useRouter()

    useEffect(() => {
        router.events.on('routeChangeStart', () => {
            progressBar.start()
        })
        router.events.on('routeChangeComplete', () => {
            progressBar.done()
        })
    }, [router])

    return <loadingContext.Provider value={null}>{children}</loadingContext.Provider>
}
export { loadingContext, LoadingContextProvider }
