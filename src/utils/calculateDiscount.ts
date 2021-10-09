const SPECIAL_CUSTOMERS = ['police', 'politician']

export const calculateDiscount = (
    totalPrice: number,
    discount: number,
    customer?: string
): number => {
    const discountByPerson =
        customer && SPECIAL_CUSTOMERS.includes(customer.toLowerCase())
            ? 100
            : discount
    const calculatedPrice = totalPrice - (discountByPerson / 100) * totalPrice
    return calculatedPrice
}
