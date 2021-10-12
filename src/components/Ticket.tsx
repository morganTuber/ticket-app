import { useFormik } from 'formik'
import { pickBy } from 'lodash'
import { useSession } from 'next-auth/client'
import { FC, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

import { useTicketModalContext } from '../context'
import { ICustomer, IDestination, PaymentMethodEnum } from '../typings'
import { calculateDiscount } from '../utils/calculateDiscount'
import { getBoatRoute } from '../utils/getBoatRoute'

//* FORM INITIAL VALUES TYPE
export interface IFormik {
    from: string
    to: string
    personCount: number
    paymentMethod: PaymentMethodEnum
    discount: number
    customerName: string
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
    customerName: '',
})

const validationSchema = Yup.object().shape({
    from: Yup.string().required(),
    to: Yup.string().required(),
    personCount: Yup.number().required().min(1).max(20),
    discount: Yup.number().min(0).max(100),
    referenceToken: Yup.string().min(6),
    customerName: Yup.string().required().min(4),
})
const errorClass = 'text-red-500 font-medium mt-2'
export const Ticket: FC<TicketProps> = ({
    isCustomised,
    destinations,
    customers,
}): JSX.Element => {
    const [session] = useSession()
    const { setData } = useTicketModalContext()
    const destinationList = useMemo(
        () => [
            'Chatara',
            ...destinations.map(
                destination => (destination.destination1, destination.destination2)
            ),
        ],
        [destinations]
    )
    const { getFieldProps, handleSubmit, values, touched, errors } = useFormik({
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
            } else if (
                values.customerName.split(',').length !== values.personCount
            ) {
                toast.error('Customer name and total customer didnt match')
            } else if (session && session.jwt) {
                const totalPrice = calculateDiscount(
                    route.price * (filtered.personCount ?? 1),
                    filtered.discount ?? 0,
                    values.customerType
                )
                setData({ ...filtered, token: session.jwt, totalPrice })
            }
        },
    })
    const [isOnline, setIsOnline] = useState<boolean>(
        values.paymentMethod !== 'Cash'
    )
    useEffect(() => {
        setIsOnline(values.paymentMethod !== PaymentMethodEnum.Cash)
        if (values.paymentMethod === PaymentMethodEnum.Cash) {
            values.referenceToken = ''
            values.discount = 0
        }
    }, [values])
    return (
        <form
            className='max-w-xl p-4 mx-auto bg-white rounded-md shadow-sm'
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
            <div className='flex items-center gap-4 form-control'>
                <div>
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
                <div>
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
                <label className='label' htmlFor='customerName'>
                    Customer Name{' '}
                    <span className='text-purple-700'>(*Seperated by ,)</span>
                </label>
                <input
                    type='text'
                    className='input'
                    id='customerName'
                    {...getFieldProps('customerName')}
                />
                {touched.customerName && errors.customerName ? (
                    <p className={errorClass}>{errors.customerName}</p>
                ) : null}
            </div>
            <div className='flex flex-wrap items-center gap-4 form-control'>
                <div className='flex-1'>
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
                    <div>
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
                    <div>
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
            </div>
            <button
                type='submit'
                className='flex items-center justify-center mt-4 ml-auto text-lg text-white bg-purple-700 btn focus'
            >
                Create Ticket
            </button>
        </form>
    )
}
