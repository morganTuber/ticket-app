import { IFormik } from '../components'
import { createStrapiAxios } from './strapi'

interface TicketData extends IFormik {
    totalPrice: number
}

export const addTicket = async (
    data: Partial<TicketData>,
    token: string
): Promise<void> => {
    try {
        await createStrapiAxios(token).post('/tickets', data)
    } catch (error) {
        const errorObj = error as Record<string, string>
        throw new Error(errorObj.message)
    }
}
