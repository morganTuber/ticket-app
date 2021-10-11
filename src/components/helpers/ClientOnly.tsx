import { FC, useEffect, useState } from 'react'

export const ClientOnly: FC = ({ children }): JSX.Element => {
    const [isBrowser, setIsBrowser] = useState<boolean>(false)
    useEffect(() => {
        setIsBrowser(true)
    }, [])
    if (isBrowser) {
        return (
            <div className='fixed inset-0 bg-white flex items-center justify-center'>
                <div className='loader'></div>
            </div>
        )
    }
    return <>{children}</>
}
