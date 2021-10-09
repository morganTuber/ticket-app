import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'

import { Layout, Protected, Ticket } from '../components'
import { ICustomer, IDestination } from '../typings'
import { fetchData } from '../utils/fetchData'

interface ICustomised {
    combinedData: {
        destinations: IDestination[]
        customers: ICustomer[]
    }
}

const Customised: NextPage<ICustomised> = ({ combinedData }): JSX.Element => {
    const { customers, destinations } = combinedData
    return (
        <Protected>
            <Layout title='Customised Ticket'>
                <Ticket
                    isCustomised={true}
                    destinations={destinations}
                    customers={customers}
                />
            </Layout>
        </Protected>
    )
}

export default Customised

export const getServerSideProps: GetServerSideProps = async context => {
    const session = await getSession(context)
    if (session && session.jwt) {
        const [destinations, customers] = await Promise.all([
            fetchData<IDestination[]>('/destinations', session.jwt),
            fetchData<ICustomer[]>('/customers', session.jwt),
        ])
        const combinedData = {
            destinations,
            customers,
        }
        return {
            props: {
                combinedData,
            },
        }
    }
    return {
        props: {
            combinedData: {
                destinations: [],
                customers: [],
            },
        },
    }
}
