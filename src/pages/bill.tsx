import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'
import { FC } from 'react'

import { BillingTicket, ClientOnly, Layout, Protected } from '../components'
import { ITicket } from '../typings'
import { fetchData } from '../utils/fetchData'

interface BillingPageProps {
    totalTickets: number
}

const BillingPage: FC<BillingPageProps> = ({ totalTickets }): JSX.Element => {
    const router = useRouter()
    const query = router.query as Record<string, string>

    return (
        <ClientOnly>
            <Protected>
                <Layout title='Tickets Overview'>
                    <section className='max-w-xl mx-auto my-6'>
                        <BillingTicket totalTickets={totalTickets} ticket={query} />
                    </section>
                </Layout>
            </Protected>
        </ClientOnly>
    )
}
export const getServerSideProps: GetServerSideProps = async context => {
    const session = await getSession(context)
    if (session && session.jwt) {
        const tickets = await fetchData<ITicket[]>('/tickets', session.jwt)
        const totalTickets = tickets.reduce((a, b) => a + b.personCount, 0)
        return {
            props: {
                totalTickets,
            },
        }
    }
    return {
        props: {
            totalTickets: 0,
        },
    }
}

export default BillingPage
