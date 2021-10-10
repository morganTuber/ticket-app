import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'
import { FC } from 'react'

import { BillingTicket, ClientOnly, Layout, Protected } from '../components'
import { ITicket } from '../typings'
import { fetchData } from '../utils/fetchData'

interface BillingPageProps {
    tickets: ITicket[]
}

const BillingPage: FC<BillingPageProps> = ({ tickets }): JSX.Element => {
    const router = useRouter()
    const query = router.query as Record<string, string>
    const totalTicketSold = tickets.reduce((a, b) => a + b.personCount, 0)
    return (
        <ClientOnly>
            <Protected>
                <Layout title='Tickets Overview'>
                    <section className='max-w-xl mx-auto my-6'>
                        <BillingTicket
                            totalTickets={totalTicketSold}
                            ticket={query}
                        />
                    </section>
                </Layout>
            </Protected>
        </ClientOnly>
    )
}
export const getServerSideProps: GetServerSideProps = async context => {
    const session = await getSession(context)
    if (session && session.jwt) {
        const tickets = await fetchData('/tickets', session.jwt)
        return {
            props: {
                tickets,
            },
        }
    }
    return {
        props: {
            tickets: [],
        },
    }
}

export default BillingPage
