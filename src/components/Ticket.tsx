import { useFormik } from 'formik'
import { pickBy } from 'lodash'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import queryString from 'query-string'
import { FC, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { HiPlus } from 'react-icons/hi'
import * as Yup from 'yup'

import { ICustomer, IDestination, PaymentMethodEnum } from '../typings'
import { addTicket } from '../utils/addTicket'
import { calculateDiscount } from '../utils/calculateDiscount'
import { getBoatRoute } from '../utils/getBoatRoute'

//* FORM INITIAL VALUES TYPE
export interface IFormik {
    from: string
    to: string
    personCount: number
    paymentMethod: PaymentMethodEnum
    discount: number
    customerType?: string
    referenceToken?: string
}
//* TICKET PROPS
interface TicketProps {
    isCustomised?: boolean
    destinations: IDestination[]
    customers?: ICustomer[]
}
const initialValues = (from: string, to: string): IFormik => ({
    from,
    to,
    personCount: 1,
    paymentMethod: PaymentMethodEnum.Cash,
    discount: 0,
    customerType: '',
    referenceToken: '',
})

const validationSchema = Yup.object().shape({
    from: Yup.string().required(),
    to: Yup.string().required(),
    personCount: Yup.number().required().min(1).max(20),
    discount: Yup.number().min(0).max(100),
    referenceToken: Yup.string().min(6),
})
const errorClass = 'text-red-500 font-medium mt-2'
export const Ticket: FC<TicketProps> = ({
    isCustomised,
    destinations,
    customers,
}): JSX.Element => {
    const [session] = useSession()
    const router = useRouter()
    const destinationList = useMemo(
        () => [
            'Chatara',
            ...destinations.map(
                destination => (destination.destination1, destination.destination2)
            ),
        ],
        [destinations]
    )
    const { getFieldProps, handleSubmit, values, touched, errors, resetForm } =
        useFormik({
            initialValues: initialValues(
                destinations[0].destination1,
                destinations[0].destination1
            ),
            validationSchema,
            enableReinitialize: true,
            onSubmit: values => {
                const route = getBoatRoute(destinations, values.from, values.to)
                const filtered = pickBy(values, value => value)
                if (!route) {
                    toast.error('Invalid Route')
                } else if (session && session.jwt) {
                    const totalPrice = calculateDiscount(
                        route.price * (filtered.personCount ?? 1),
                        filtered.discount ?? 0,
                        values.customerType
                    )
                    addTicket(
                        {
                            ...filtered,
                            totalPrice,
                        },
                        session.jwt
                    )
                        .then(() => {
                            toast.success('Successfully created a new ticket')

                            const query = queryString.stringify({
                                billToken: nanoid(),
                                ...filtered,
                                totalPrice,
                            })
                            void router.push({ pathname: '/bill', query })
                            resetForm()
                        })
                        .catch(error =>
                            toast.error((error as Record<string, string>).message)
                        )
                }
            },
        })
    const [isOnline, setIsOnline] = useState<boolean>(
        values.paymentMethod !== 'Cash'
    )
    useEffect(() => {
        setIsOnline(values.paymentMethod !== PaymentMethodEnum.Cash)
    }, [values.paymentMethod])
    return (
        <form
            className='bg-white p-4 shadow-sm rounded-md max-w-md mx-auto'
            onSubmit={handleSubmit}
        >
            {isCustomised && customers ? (
                <div className='form-control'>
                    <label className='label' htmlFor='customerType'>
                        Customer Type
                    </label>
                    <select
                        {...getFieldProps('customerType')}
                        className='input'
                        id='customerType'
                    >
                        {customers.map((customerType, index) => (
                            <option
                                key={index}
                                value={customerType.type.toLowerCase()}
                            >
                                {customerType.type}
                            </option>
                        ))}
                    </select>
                </div>
            ) : null}
            <div className='form-control'>
                <label className='label' htmlFor='from'>
                    From
                </label>
                <select className='input' {...getFieldProps('from')} id='from'>
                    {destinationList.map((destination, index) => (
                        <option key={index} value={destination.toLowerCase()}>
                            {destination.toLowerCase()}
                        </option>
                    ))}
                </select>
                {touched.from && errors.from ? (
                    <p className={errorClass}>{errors.from}</p>
                ) : null}
            </div>
            <div className='form-control'>
                <label className='label' htmlFor='to'>
                    To
                </label>
                <select className='input' {...getFieldProps('to')} id='to'>
                    {destinationList.map((destination, index) => (
                        <option key={index} value={destination.toLowerCase()}>
                            {destination.toLowerCase()}
                        </option>
                    ))}
                </select>
                {touched.to && errors.to ? (
                    <p className={errorClass}>{errors.to}</p>
                ) : null}
            </div>
            <div className='form-control'>
                <label className='label' htmlFor='personCount'>
                    Number of People
                </label>
                <input
                    className='input'
                    {...getFieldProps('personCount')}
                    type='number'
                    id='personCount'
                />

                {touched.personCount && errors.personCount ? (
                    <p className={errorClass}>{errors.personCount}</p>
                ) : (
                    ''
                )}
            </div>
            <div className='form-control'>
                <label className='label' htmlFor='paymentMethod'>
                    Select method of Payment
                </label>
                <select
                    {...getFieldProps('paymentMethod')}
                    className='input'
                    id='paymentMethod'
                >
                    {(
                        Object.keys(PaymentMethodEnum) as Array<
                            keyof typeof PaymentMethodEnum
                        >
                    ).map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            {isOnline && (
                <div className='form-control'>
                    <label className='label' htmlFor='reference'>
                        Reference Code
                    </label>
                    <input
                        type='input'
                        className='input'
                        id='reference'
                        {...getFieldProps('referenceToken')}
                        required
                    />
                    {touched.referenceToken && errors.referenceToken ? (
                        <p className={errorClass}>{errors.referenceToken}</p>
                    ) : null}
                </div>
            )}
            {values.paymentMethod !== PaymentMethodEnum.Cash && (
                <div className='form-control'>
                    <label className='label' htmlFor='discount'>
                        Discount
                    </label>
                    <input
                        {...getFieldProps('discount')}
                        id='discount'
                        className='input'
                        type='number'
                    />
                    {touched.discount && errors.discount ? (
                        <p className={errorClass}>{errors.discount}</p>
                    ) : null}
                </div>
            )}
            <button
                type='submit'
                className='btn flex items-center justify-center w-full bg-purple-700 text-lg text-white mt-4 focus'
            >
                <HiPlus />
                <span>Create Ticket</span>
            </button>
        </form>
    )
}
