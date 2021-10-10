import Image from 'next/image'
import { FC, useMemo } from 'react'
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

// export const BillingTicket: FC<BillingTicketProps> = ({ ticket }): JSX.Element => {
//     const totalPersonArr = generateArray(+ticket.personCount)
//     const date = new Date()
//     const billingToken = `${date
//         .toLocaleDateString()
//         .split('/')
//         .reverse()
//         .join('-')}-${date.getTime()}`
//     const data: Record<string, string | number> = useMemo(
//         () => ({
//             billingToken,
//             from: ticket.from,
//             to: ticket.to,
//             price: +ticket.totalPrice / +ticket.personCount,
//         }),
//         [ticket, billingToken]
//     )
//     const renderedList = totalPersonArr.map(num => (
//         <article
//             className='mt-6 space-y-4 bg-white shadow-md overflow-hidden rounded-md'
//             key={num}
//         >
//             <Image
//                 src='/images/boat-image.jpg'
//                 width={640}
//                 height={360}
//                 alt='Placeholder for logo'
//             />
//             <h2 className='text-gray-600 text-center font-bold text-2xl tracking-wide'>
//                 Company Name Placeholder
//             </h2>
//             <table
//                 id={`ticket-${num}`}
//                 className='print table-auto w-full overflow-hidden'
//             >
//                 <thead className='bg-gray-900 text-white'>
//                     <tr>
//                         <th className='flex-1'>Token</th>
//                         <th>From</th>
//                         <th>To</th>
//                         <th>Price</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         {Object.keys(data).map((key, index) => (
//                             <td className='text-center p-2' key={index}>
//                                 {data[key]}
//                             </td>
//                         ))}
//                     </tr>
//                 </tbody>
//             </table>
//         </article>
//     ))
//     return (
//         <article>
//             <button
//                 onClick={() => print()}
//                 className='btn no-print focus-outline bg-purple-700 text-white px-12'
//             >
//                 Print
//             </button>

//             {renderedList}
//         </article>
//     )
// }
export const BillingTicket: FC<BillingTicketProps> = ({ ticket }) => {
    console.log(ticket)
    const personArr = generateArray(+ticket.personCount)

    const renderedList = personArr.map(person => (
        <div key={person} className='bg-white rounded-md p-4 shadow-sm space-y-4'>
            <IoBoatSharp size={200} className='mx-auto' />
            <h1 className='text-center text-4xl font-semibold'>Company Name</h1>
            <p className='text-center'>Kathmandu Nepal, 44600</p>
            <div className='flex items-center justify-between p-4 bg-gray-100 rounded-md'>
                <p>Token Placeholder</p>
                <p>Expiration Date Placeholder</p>
            </div>
            <div className='flex items-center justify-between'>
                <div className='text-center bg-gray-100 p-6 rounded-md shadow-sm'>
                    <h2>From</h2>
                    <p>{ticket.from}</p>
                </div>
                <CgArrowsExchange className='text-6xl' />
                <div className='text-center bg-gray-100 px-10 py-6 rounded-md shadow-sm'>
                    <h2>To</h2>
                    <p>{ticket.to}</p>
                </div>
            </div>
            <p className='text-center text-lg font-bold'>
                Price: Rs {+ticket.totalPrice / +ticket.personCount}
            </p>
            <p className='text-center text-xs'>
                *Purchased tickets cant be refunded and must be used before
                expiration time
            </p>
        </div>
    ))
    return <div className='space-y-6'>{renderedList}</div>
}
