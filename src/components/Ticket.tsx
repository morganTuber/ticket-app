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
import { FormField } from '.'

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
const initialValues = (from: string, to: string, customerType: string): IFormik => ({
    from,
    to,
    customerType,
    personCount: 1,
    paymentMethod: PaymentMethodEnum.Cash,
    discount: 0,
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
            destinations[0].destination1,
            customers ? customers[0].type : ''
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
                <FormField
                    data={{
                        id: 'customerType',
                        label: 'Customer Type',
                        options: [...customers.map(customer => customer.type)],
                    }}
                    touched={touched.customerType}
                    error={errors.customerType}
                    formikProps={getFieldProps('customerType')}
                />
            ) : null}
            <div className='flex items-center gap-4 form-control'>
                <FormField
                    data={{ id: 'from', options: [...destinationList] }}
                    touched={touched.from}
                    error={errors.from}
                    formikProps={getFieldProps('from')}
                />
                <FormField
                    data={{ id: 'to', options: [...destinationList] }}
                    touched={touched.to}
                    error={errors.to}
                    formikProps={getFieldProps('to')}
                />
            </div>
            <FormField
                data={{
                    id: 'personCount',
                    label: 'Number of People',
                    className: 'form-control',
                    type: 'number',
                }}
                touched={touched.personCount}
                error={errors.personCount}
                formikProps={getFieldProps('personCount')}
            />
            <FormField
                data={{
                    id: 'customerName',
                    label: `Customer Name (Separated by ,)`,
                    className: 'form-control',
                }}
                touched={touched.customerName}
                error={errors.customerName}
                formikProps={getFieldProps('customerName')}
            />
            <div className='flex flex-wrap items-center gap-4 form-control'>
                <FormField
                    data={{
                        id: 'paymentMethod',
                        className: 'flex-1',
                        options: [
                            ...(Object.keys(PaymentMethodEnum) as Array<
                                keyof typeof PaymentMethodEnum
                            >),
                        ],
                    }}
                    touched={touched.paymentMethod}
                    error={errors.paymentMethod}
                    formikProps={getFieldProps('paymentMethod')}
                />
                {isOnline && (
                    <FormField
                        data={{
                            id: 'referenceToken',
                            label: 'Reference Token',
                        }}
                        error={errors.referenceToken}
                        touched={touched.referenceToken}
                        formikProps={getFieldProps('referenceToken')}
                    />
                )}
                {values.paymentMethod !== PaymentMethodEnum.Cash && (
                    <FormField
                        data={{ id: 'discount' }}
                        touched={touched.discount}
                        error={errors.discount}
                        formikProps={getFieldProps('discount')}
                    />
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
