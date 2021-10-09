import NextAuth from 'next-auth'
import { StrapiResponse } from './src/typings/strapiResponse'
declare module 'next-auth' {
    interface User extends StrapiResponse {}

    interface Session {
        jwt?: string
        user?: StrapiResponse
    }
}
declare module 'next-auth/jwt' {
    interface JWT {
        id?: number
        jwt?: string
    }
}
