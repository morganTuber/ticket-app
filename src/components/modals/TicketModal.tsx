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
        //TODO
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
                <motion.div className='fixed inset-0 flex items-center justify-center bg-gray-100 z-50'>
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleSubmit}
                        className='bg-white shadow-sm max-w-md w-full p-6 rounded-md space-y-4'
                    >
                        <h3 className='text-xl text-center font-semibold tracking-wider'>
                            Ticket Details
                        </h3>
                        <div className='h-px w-full bg-gray-200'></div>
                        {renderedList(data)}
                        <div className='h-px w-full bg-gray-200'></div>
                        <div className='flex items-center justify-end space-x-2 text-white text-sm'>
                            <button
                                type='button'
                                onClick={() => setData(null)}
                                className='btn bg-red-700'
                            >
                                Cancel
                            </button>
                            <button type='submit' className='btn bg-purple-700'>
                                Confirm
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
