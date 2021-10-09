/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions, User } from 'next-auth'
import Providers from 'next-auth/providers'

import { createStrapiAxios } from '../../../utils/strapi'

const options: NextAuthOptions = {
    providers: [
        Providers.Credentials({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize({ identifier, password }) {
                try {
                    const { data } = await createStrapiAxios().post<User>(
                        '/auth/local',
                        {
                            identifier,
                            password,
                        }
                    )
                    return data ? data : null
                } catch (error) {
                    throw new Error(JSON.stringify(error, null, 2))
                }
            },
        }),
    ],
    session: {
        jwt: true,
    },

    callbacks: {
        jwt: async (token, user) => {
            if (user) {
                (token.jwt = user.jwt),
                    (token.id = user.user.id),
                    (token.name = user.user.username),
                    (token.email = user.user.email)
            }
            return Promise.resolve(token)
        },
        session: async (session, user) => {
            session.jwt = user.jwt
            session.id = user.id
            return Promise.resolve(session)
        },
    },
    theme: 'light',
}
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
): void | Promise<void> {
    return NextAuth(req, res, options)
}
