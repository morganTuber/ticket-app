import { FC } from 'react'
import { CgArrowsExchange } from 'react-icons/cg'
import { IoBoatSharp } from 'react-icons/io5'

export interface BillingTicketProps {
    ticket: Record<string, string>
}
const generateArray = (length: number): number[] => {
    const arr: number[] = []
    for (let i = 0; i < length; i++) {
        arr.push(i)
    }
    return arr
}
export const BillingTicket: FC<BillingTicketProps> = ({ ticket }) => {
    const personArr = generateArray(+ticket.personCount)

    const renderedList = personArr.map(person => (
        <div
            key={person}
            className='print bg-white rounded-md p-4 shadow-sm space-y-4'
        >
            <IoBoatSharp size={200} className='mx-auto' />
            <h1 className='text-center text-4xl font-semibold'>Company Name</h1>
            <p className='text-center'>Kathmandu Nepal, 44600</p>
            <div className='flex items-center justify-between p-4 bg-gray-100 rounded-md'>
                <p>Token Placeholder</p>
                <p>Expiration Date Placeholder</p>
            </div>
            <div className='flex items-center justify-between'>
                <div className='text-center bg-gray-100 p-6 rounded-md shadow-sm'>
                    <h2 className='text-gray-400'>From</h2>
                    <p className='text-2xl mt-2 font-bold'>{ticket.from}</p>
                </div>
                <CgArrowsExchange className='text-6xl' />
                <div className='text-center bg-gray-100 px-10 py-6 rounded-md shadow-sm'>
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
                className='no-print btn bg-purple-700 text-white px-12'
                type='button'
                onClick={() => print()}
            >
                Print
            </button>
            {renderedList}
        </div>
    )
}
