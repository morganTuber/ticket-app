import { createStrapiAxios } from './strapi'

export const fetchData = async <T>(url: string, token: string): Promise<T> => {
    try {
        const response = await createStrapiAxios(token).get<T>(url)
        return response.data
    } catch (error) {
        throw new Error('Something went wrong')
    }
}
