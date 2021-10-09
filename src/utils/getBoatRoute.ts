import { IDestination } from '../typings'

export const getBoatRoute = (
    destinations: IDestination[],
    destination1: string,
    destination2: string
): IDestination | undefined => {
    const route = destinations.find(
        destination =>
            (destination.destination1.toLowerCase() === destination1.toLowerCase() ||
                destination.destination1.toLowerCase() ===
                    destination2.toLowerCase()) &&
            (destination.destination2.toLowerCase() === destination1.toLowerCase() ||
                destination.destination2.toLowerCase() ===
                    destination2.toLowerCase())
    )
    return route
}
