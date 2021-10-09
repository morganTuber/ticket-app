import axios, { AxiosInstance } from 'axios'

export const createStrapiAxios = (jwtToken?: string): AxiosInstance => {
    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: jwtToken && {
            Authorization: `Bearer ${jwtToken}`,
        },
    })
}
