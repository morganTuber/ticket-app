import { format } from 'date-fns'
import { FC } from 'react'

import type { ITicket } from '../typings'
import { compareDate } from '../utils/compareDate'

interface SalesInfoProps {
    tickets: ITicket[]
}

export const SalesInfo: FC<SalesInfoProps> = ({ tickets }): JSX.Element => {
    const currentDate = format(new Date(), 'PPPP')
    const todayTickets = tickets.filter(ticket =>
        compareDate(new Date(ticket.created_at), new Date())
    )
    const totalTicketsSold = todayTickets
        .map(ticket => ticket.personCount)
        .reduce((prev, curr) => prev + curr, 0)
    const totalProfit = todayTickets
        .map(ticket => ticket.totalPrice)
        .reduce((prev, curr) => prev + curr, 0)
    const data = {
        'Total Tickets Sold': totalTicketsSold,
        'Total Profit': `Rs ${totalProfit}`,
    }
    return (
        <main className='max-w-xl mx-auto'>
            <h2 className='inline-block p-4 mb-4 text-center text-purple-500 bg-purple-200 rounded-md shadow-sm'>
                {currentDate}
            </h2>
            <div className='flex flex-col items-start justify-start space-y-4 lg:space-y-0 lg:items-center lg:space-x-12 lg:flex-row'>
                {Object.keys(data).map((key, index) => (
                    <div
                        key={index}
                        className='px-12 py-6 bg-white rounded-md shadow-sm'
                    >
                        <p className='text-gray-400'>{key}</p>
                        <h3 className='mt-2 text-4xl font-semibold'>
                            {data[key as keyof typeof data]}
                        </h3>
                    </div>
                ))}
            </div>
        </main>
    )
}
