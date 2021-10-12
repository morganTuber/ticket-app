import { FC, useEffect, useState } from 'react'

export const ClientOnly: FC = ({ children }): JSX.Element => {
    const [isBrowser, setIsBrowser] = useState<boolean>(false)
    useEffect(() => {
        setIsBrowser(true)
    }, [])
    if (!isBrowser) {
        return (
            <div className='fixed inset-0 flex items-center justify-center bg-white'>
                <div className='loader'></div>
            </div>
        )
    }
    return <>{children}</>
}
