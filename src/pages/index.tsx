import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'

import { Layout, SalesInfo } from '../components'
import { Protected } from '../components/Protected'
import { ITicket } from '../typings'
import { fetchData } from '../utils/fetchData'

interface HomepageProps {
    tickets: ITicket[]
}
const HomePage: NextPage<HomepageProps> = ({ tickets }): JSX.Element => {
    return (
        <Protected>
            <Layout title='Dashboard'>
                <SalesInfo tickets={tickets} />
            </Layout>
        </Protected>
    )
}
export const getServerSideProps: GetServerSideProps = async context => {
    const session = await getSession(context)
    if (session && session.jwt) {
        const tickets = await fetchData<ITicket[]>('/tickets', session.jwt)
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

export default HomePage
