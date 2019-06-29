export const formatMoney = (number) => {
    return number.toString()
        .split('')
        .reverse()
        .map((v, i) => (i !== 0 & i % 3 === 0) ? [',', v] : v)
        .flat()
        .reverse()
        .join('')
}