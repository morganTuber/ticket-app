import { FC, useEffect, useState } from 'react'

export const ClientOnly: FC = ({ children }): JSX.Element => {
    const [isBrowser, setIsBrowser] = useState<boolean>(false)
    useEffect(() => {
        setIsBrowser(true)
    }, [])
    if (!isBrowser) {
        return (
            <div className='fixed inset-0 bg-black/75 flex items-center justify-center'>
                <div className='h-54 w-54 rounded-full bg-transparent border-8 border-purple-700 animate-spin'></div>
            </div>
        )
    }
    return <>{children}</>
}
