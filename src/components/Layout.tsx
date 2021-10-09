import { motion } from 'framer-motion'
import Head from 'next/head'

import { transition } from '../utils/transitions'

interface ILayout {
    title?: string
}
const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
}
export const Layout: React.FC<ILayout> = ({ children, title }): JSX.Element => {
    return (
        <motion.div
            initial='initial'
            animate='animate'
            exit='exit'
            variants={variants}
            transition={transition}
            className='max-w-full mx-auto mt-6 lg:mt-12 lg:max-w-2xl'
        >
            <Head>
                <title>{title ?? 'Ticket Booking'}</title>
            </Head>
            {children}
        </motion.div>
    )
}
