import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'

import { Layout, Ticket } from '../components'
import { Protected } from '../components/Protected'
import { IDestination } from '../typings'
import { fetchData } from '../utils/fetchData'

interface IRegular {
    destinations: IDestination[]
}

const Regular: NextPage<IRegular> = ({ destinations }): JSX.Element => {
    return (
        <Protected>
            <Layout title='Regular Ticket'>
                <Ticket destinations={destinations} />
            </Layout>
        </Protected>
    )
}

export default Regular

export const getServerSideProps: GetServerSideProps = async context => {
    const session = await getSession(context)

    if (session && session.jwt) {
        const destinations = await fetchData<IDestination[]>(
            '/destinations',
            session.jwt
        )
        return {
            props: {
                destinations,
            },
        }
    }
    return {
        props: {
            destinations: [],
        },
    }
}
