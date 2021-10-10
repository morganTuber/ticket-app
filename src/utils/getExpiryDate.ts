export const getExpiryDate = (months: number): Date => {
    const date = new Date()
    const expirationDate = new Date(
        `${date.getFullYear()}-${date.getMonth() + months + 1}-${date.getDate()}`
    )
    return expirationDate
}
