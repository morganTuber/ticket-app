import { AnimatePresence, motion } from 'framer-motion'
import { omit } from 'lodash'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import React from 'react'
import toast from 'react-hot-toast'

import { ITicketData, useTicketModalContext } from '../../context'
import { addTicket } from '../../utils/addTicket'

export const TicketModal = (): JSX.Element => {
    const { data, setData } = useTicketModalContext()
    const router = useRouter()
    const renderedList = (item: ITicketData): JSX.Element[] => {
        return Object.keys(omit(item, 'token')).map(key => (
            <div key={key} className='flex items-center justify-between capitalize'>
                <p>{key}</p>
                <p>{item[key as keyof ITicketData]}</p>
            </div>
        ))
    }
    const generateMessage = (totalPerson: number) => {
        return totalPerson > 1
            ? `Successfully created ${totalPerson} new tickets`
            : `Successfully created a new ticket`
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (data) {
            addTicket(data)
                .then(() => {
                    const query = queryString.stringify(data)
                    const promise = router.push({ pathname: '/bill', query })
                    toast
                        .promise(promise, {
                            loading: 'Creating new ticket....',
                            success: generateMessage(data.personCount ?? 1),
                            error: 'Something went wrong',
                        })
                        .then(() => {
                            setData(null)
                        })
                        .catch(error => {
                            throw new Error(error)
                        })
                })
                .catch(err => {
                    const error = err as Record<string, string>
                    toast.error(error.message)
                })
        }
    }
    return (
        <AnimatePresence>
            {data && (
                <motion.div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleSubmit}
                        className='w-full max-w-md p-6 space-y-4 bg-white rounded-md shadow-sm'
                    >
                        <h3 className='text-xl font-semibold tracking-wider text-center'>
                            Ticket Details
                        </h3>
                        <div className='w-full h-px bg-gray-200'></div>
                        {renderedList(data)}
                        <div className='w-full h-px bg-gray-200'></div>
                        <div className='flex items-center justify-end space-x-2 text-sm text-white'>
                            <button
                                type='button'
                                onClick={() => setData(null)}
                                className='bg-red-700 btn'
                            >
                                Cancel
                            </button>
                            <button type='submit' className='bg-purple-700 btn'>
                                Confirm
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
