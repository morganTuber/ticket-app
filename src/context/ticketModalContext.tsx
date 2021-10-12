import {
    createContext,
    Dispatch,
    FC,
    SetStateAction,
    useContext,
    useState,
} from 'react'

import { IFormik } from '../components'

export interface ITicketData extends Partial<IFormik> {
    token: string
    totalPrice: number
}

interface ITicketModalContext {
    /* Ticket data for ticket confirmation dialog */
    data: ITicketData | null
    /* Set Ticket data for showing the ticket confirmation modal */
    setData: Dispatch<SetStateAction<ITicketData | null>>
}

const ticketModalContext = createContext<ITicketModalContext | null>(null)

export const TicketModalContextProvider: FC = ({ children }) => {
    const [data, setData] = useState<ITicketData | null>(null)

    const value: ITicketModalContext = {
        data,
        setData,
    }
    return (
        <ticketModalContext.Provider value={value}>
            {children}
        </ticketModalContext.Provider>
    )
}
export const useTicketModalContext = (): ITicketModalContext => {
    const context = useContext(ticketModalContext) as ITicketModalContext
    return { ...context }
}
