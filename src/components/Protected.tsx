import { useSession } from 'next-auth/client'

import { LoginRedirect } from './helpers/LoginRedirect'

export const Protected: React.FC = ({ children }): JSX.Element => {
    const [data] = useSession()
    return <>{!data ? <LoginRedirect /> : children}</>
}
