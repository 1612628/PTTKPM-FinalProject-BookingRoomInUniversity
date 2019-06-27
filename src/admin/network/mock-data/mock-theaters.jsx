import { DashboardTheater, Theater, TheaterShowTime } from '../models/theater'

export const getDashboardTheaters = (n) => {
    let sampleTheater = new DashboardTheater(
        "Nigamon Nguyen Van Cu",
        "227 Nguyen Van Cu, Q5, HCM",
        45,
        60
    )
    return new Array(n).fill(sampleTheater)
}

export const getTheaters = (n, options) => {
    let theaters = [];
    while (theaters.length < n) {
        theaters.push(new Theater(
            theaters.length + 1,
            `Nigamon Nguyen Van Cu ${theaters.length + 1}`,
            `${Math.floor(Math.random() * 200) + 1} Duong nao day, Q5, HCM`,
            6,
            10,
            Math.floor(Math.random() * 2) + 1
        ));
    }
    return theaters
}

export const getTheaterShowTimes = (n, row, col, options) => {
    let showTimes = []
    let t = new Date()
    t.setHours(9, 30)
    let orders = [[1, 2], [1, 4], [2, 5], [3, 4], [5, 6]]
    while (showTimes.length < n) {
        showTimes.push(new TheaterShowTime(
            new Date(t.getTime() + 30 * 60 * 1000 * (showTimes.length)),
            showTimes.length + 1,
            showTimes.length + 1,
            orders.filter(([r, c]) => 1 <= r && r <= row && 1 <= c && c <= col)
        ))
    }
    return showTimes
}