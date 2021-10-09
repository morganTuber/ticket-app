export const compareDate = (date1: Date, date2: Date): boolean => {
    if (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDay() === date2.getDay()
    ) {
        return true
    }
    return false
}
