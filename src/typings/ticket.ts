import { PaymentMethodEnum } from './paymentEnum'

export interface ITicket {
    id: number
    from: string
    to: string
    personCount: number
    paymentMethod: PaymentMethodEnum
    discount: number
    customerType: string | null
    referenceToken: string | null
    totalPrice: number
    published_at: string
    created_at: string
    updated_at: string
}
