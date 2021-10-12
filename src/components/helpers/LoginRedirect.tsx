import Image from 'next/image'
import Link from 'next/link'

/**
 * Returns user to login page if not authenticated
 */
export const LoginRedirect = (): JSX.Element => {
    return (
        <div className='max-w-lg mx-auto space-y-4 text-center'>
            <Image
                src='/images/auth.svg'
                width={600}
                height={300}
                alt='Not logged in svg'
            />
            <h3 className='text-lg text-red-700'>
                You must be authenticated to view this page
            </h3>
            <Link href='/login'>
                <a className='text-white bg-red-700 btn'>Login</a>
            </Link>
        </div>
    )
}
