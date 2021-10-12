import { FC } from 'react'
import { CgArrowsExchange } from 'react-icons/cg'
import { IoBoatSharp } from 'react-icons/io5'

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
    const customers = ticket.customerName.split(',')
    const renderedList = personArr.map(person => (
        <div
            key={person}
            className='p-4 space-y-4 bg-white rounded-md shadow-sm print'
        >
            <IoBoatSharp size={200} className='mx-auto' />
            <h1 className='text-4xl font-semibold text-center'>
                Dantakali Jal Bihar Pvt. Ltd
            </h1>
            <p className='text-center'>Barahachhetra-2, Chatara</p>
            <div className='flex flex-col items-center justify-between p-4 space-y-2 bg-gray-100 border border-gray-200 rounded-md lg:space-y-0 lg:flex-row'>
                <p>
                    Token :{' '}
                    {`${new Date().toLocaleDateString()}_${
                        totalTickets + person + 1
                    }`}
                </p>
                <p>{customers[person]}</p>
            </div>
            <div className='flex items-center justify-between'>
                <div className='p-6 text-center bg-gray-100 border border-gray-200 rounded-md shadow-sm'>
                    <h2 className='text-gray-400'>From</h2>
                    <p className='mt-2 text-2xl font-bold'>{ticket.from}</p>
                </div>
                <CgArrowsExchange className='text-6xl' />
                <div className='px-10 py-6 text-center bg-gray-100 border border-gray-200 rounded-md shadow-sm'>
                    <h2 className='text-gray-400'>To</h2>
                    <p className='mt-2 text-2xl font-bold'>{ticket.to}</p>
                </div>
            </div>
            <p className='text-lg font-bold text-center'>
                Price: Rs {+ticket.totalPrice / +ticket.personCount}
            </p>
        </div>
    ))
    return (
        <div className='space-y-6'>
            <button
                className='block py-4 mx-auto text-lg text-white bg-purple-700 no-print btn px-14'
                type='button'
                onClick={() => print()}
            >
                Print
            </button>
            {renderedList}
        </div>
    )
}
