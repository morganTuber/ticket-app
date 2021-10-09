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
        <main>
            <h2 className='inline-block text-center mb-4 p-4 rounded-md bg-purple-200 text-purple-500 shadow-sm'>
                {currentDate}
            </h2>
            <div className='flex flex-col items-start justify-start space-y-4 lg:space-y-0 lg:items-center lg:space-x-12 lg:flex-row'>
                {Object.keys(data).map((key, index) => (
                    <div
                        key={index}
                        className='bg-white shadow-sm rounded-md px-12 py-6'
                    >
                        <p className='text-gray-400'>{key}</p>
                        <h3 className='text-4xl font-semibold mt-2'>
                            {data[key as keyof typeof data]}
                        </h3>
                    </div>
                ))}
            </div>
        </main>
    )
}
