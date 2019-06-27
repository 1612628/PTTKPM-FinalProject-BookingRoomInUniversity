import { formatDate } from "../../libs/datetime";

export const getDashboardCharts = (start, end, theater) => {
    start = start || new Date()
    end = end || new Date()

    let labels = []
    let date = new Date(start.getTime())
    while (date.getDate() < end.getDate() || date.getMonth() < end.getMonth() || date.getFullYear() < end.getFullYear()) {
        labels.push(new Date(date.getTime()))
        let currentDate = date.getDate()
        date.setDate(currentDate + 1)
    }
    labels.push(end)

    labels = labels.map(d => formatDate(d))
    let incomeData = labels.map((v, i) => 500 + 30 * i)
    let newUserData = labels.map((v, i) => 10 + i * 5)

    return {
        charts: {
            income: {
                labels: labels,
                data: incomeData
            },
            newUser: {
                labels: labels,
                data: newUserData
            },
            incomeShare: {
                labels: ['Thuc an', 'Ve phim'],
                data: [40, 60]
            }
        }
    }
}