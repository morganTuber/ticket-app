import { useFormik } from 'formik'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import { getCsrfToken, signIn, useSession } from 'next-auth/client'
import { FC, useEffect } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

interface IFormik {
    identifier: string
    password: string
}
interface ILogin {
    csrfToken: string
}
const initialValues: IFormik = {
    identifier: '',
    password: '',
}
const validationSchema = Yup.object().shape({
    identifier: Yup.string().required(),
    password: Yup.string().required(),
})

const Login: FC<ILogin> = ({ csrfToken }): JSX.Element => {
    const router = useRouter()
    const [data] = useSession()
    const { handleSubmit, getFieldProps, touched, errors } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: ({ identifier, password }) => {
            try {
                signIn('credentials', { identifier, password })
                    .then(() => {
                        void router.push('/')
                    })
                    .catch(error => {
                        throw new Error(error)
                    })
            } catch {
                toast.error('Invalid username or password')
            }
        },
    })
    useEffect(() => {
        if (data && data.jwt) {
            void router.push('/')
        }
    }, [router, data])
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-50'>
            <form
                className='min-w-[25rem] bg-white shadow-sm px-4 py-6 rounded-md'
                method='post'
                action='/api/auth/callback/credentials'
                onSubmit={handleSubmit}
            >
                <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
                <h3 className='mb-4 text-2xl font-bold text-center'>Login</h3>
                <div className='form-control'>
                    <label htmlFor='identifier'>Username</label>
                    <input
                        className='input'
                        type='text'
                        id='identifier'
                        {...getFieldProps('identifier')}
                    />
                    {touched.identifier && errors.identifier ? (
                        <p className='mt-2 text-red-500'>{errors.identifier}</p>
                    ) : (
                        ''
                    )}
                </div>
                <div className='form-control'>
                    <label htmlFor='password'>Password</label>
                    <input
                        className='input'
                        type='password'
                        id='password'
                        {...getFieldProps('password')}
                    />
                    {touched.password && errors.password ? (
                        <p className='mt-2 text-red-500'>{errors.password}</p>
                    ) : (
                        ''
                    )}
                </div>
                <button
                    type='submit'
                    className='w-full mt-4 text-white bg-purple-700 shadow-none btn'
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            csrfToken: await getCsrfToken(),
        },
    }
}
