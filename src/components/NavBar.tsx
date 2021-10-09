import { motion } from 'framer-motion'
import { AnimateSharedLayout } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { FC, useState } from 'react'

import { transition } from '../utils/transitions'

interface ItemProps {
    path: string
    pathName: string
    isSelected: boolean
    onClick: () => void
}
const routes = [
    {
        path: '/',
        pathName: 'Dashboard',
    },
    {
        path: '/regular',
        pathName: 'Regular',
    },
    {
        path: '/customised',
        pathName: 'Customised',
    },
]

const Item: FC<ItemProps> = ({ path, pathName, isSelected, onClick }) => {
    return (
        <Link href={path}>
            <a
                onClick={onClick}
                className={`relative btn w-full text-lg lg:w-auto z-10 ${
                    isSelected ? 'text-white' : 'text-gray-600'
                } transition-colors duration-700 `}
            >
                {pathName}
                {isSelected && (
                    <motion.div
                        layoutId='activeTabId'
                        initial={false}
                        animate={{ backgroundColor: '#6D28D9' }}
                        transition={transition}
                        className='active-tab'
                    />
                )}
            </a>
        </Link>
    )
}

export const NavBar = (): JSX.Element | null => {
    const { asPath } = useRouter()
    const [session] = useSession()
    const [route, setRoute] = useState(asPath)

    if (!session) return null
    return (
        <AnimateSharedLayout>
            <nav className='flex flex-col max-w-xl mx-auto bg-white p-4 shadow-sm rounded-md items-center justify-center space-y-4 no-print lg:space-y-0 lg:space-x-6 lg:flex-row'>
                {routes.map(({ path, pathName }) => (
                    <Item
                        key={pathName}
                        pathName={pathName}
                        path={path}
                        isSelected={path === route}
                        onClick={() => setRoute(path)}
                    />
                ))}
            </nav>
        </AnimateSharedLayout>
    )
}
