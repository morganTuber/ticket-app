import { useRouter } from 'next/router'

import { BillingTicket, ClientOnly, Protected } from '../components'

const BillingPage = (): JSX.Element => {
    const router = useRouter()
    const query = router.query as Record<string, string>
    return (
        <ClientOnly>
            <Protected>
                <section className='max-w-xl mx-auto my-12'>
                    <BillingTicket ticket={query} />
                </section>
            </Protected>
        </ClientOnly>
    )
}

export default BillingPage
