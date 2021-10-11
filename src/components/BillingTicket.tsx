import { FC } from 'react'
import { CgArrowsExchange } from 'react-icons/cg'
import { IoBoatSharp } from 'react-icons/io5'

import { getExpiryDate } from '../utils/getExpiryDate'

export interface BillingTicketProps {
    ticket: Record<string, string>
    totalTickets: number
}
const generateArray = (length: number): number[] => {
    const arr: number[] = []
    for (let i = 0; i < length; i++) {
        arr.push(i)
    }
    return arr
}
export const BillingTicket: FC<BillingTicketProps> = ({ ticket, totalTickets }) => {
    const personArr = generateArray(+ticket.personCount)

    const renderedList = personArr.map(person => (
        <div
            key={person}
            className='print bg-white rounded-md p-4 shadow-sm space-y-4'
        >
            <IoBoatSharp size={200} className='mx-auto' />
            <h1 className='text-center text-4xl font-semibold'>
                Dantakali Jal bihar Pvt. Ltd
            </h1>
            <p className='text-center'>Barahachhetr-2, Chatara</p>
            <div className='flex items-center flex-col justify-between p-4 bg-gray-100 rounded-md border border-gray-200 space-y-2 lg:space-y-0 lg:flex-row'>
                <p>
                    Token :{' '}
                    {`${new Date().toLocaleDateString()}_${
                        totalTickets + person + 1
                    }`}
                </p>
                <p>Expiration Date: {getExpiryDate(1).toLocaleDateString()}</p>
            </div>
            <div className='flex items-center justify-between'>
                <div className='text-center bg-gray-100 p-6 rounded-md shadow-sm border border-gray-200'>
                    <h2 className='text-gray-400'>From</h2>
                    <p className='text-2xl mt-2 font-bold'>{ticket.from}</p>
                </div>
                <CgArrowsExchange className='text-6xl' />
                <div className='text-center bg-gray-100 px-10 py-6 rounded-md shadow-sm border border-gray-200'>
                    <h2 className='text-gray-400'>To</h2>
                    <p className='text-2xl mt-2 font-bold'>{ticket.to}</p>
                </div>
            </div>
            <p className='text-center text-lg font-bold'>
                Price: Rs {+ticket.totalPrice / +ticket.personCount}
            </p>
            <p className='text-center text-xs text-gray-400'>
                *Purchased tickets cant be refunded and must be used before
                expiration time
            </p>
        </div>
    ))
    return (
        <div className='space-y-6'>
            <button
                className='no-print block btn bg-purple-700 text-white text-lg px-14 py-4 mx-auto'
                type='button'
                onClick={() => print()}
            >
                Print
            </button>
            {renderedList}
        </div>
    )
}
