import { ITicketData } from '../context'
import { createStrapiAxios } from './strapi'

export const addTicket = async (data: ITicketData): Promise<void> => {
    try {
        await createStrapiAxios(data.token).post('/tickets', data)
    } catch (error) {
        const errorObj = error as Record<string, string>
        throw new Error(errorObj.message)
    }
}
