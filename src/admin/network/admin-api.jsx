import moment from 'moment'
import { ApiClient, SecureApiClient } from './api-client'
import { logOut } from '../stores/app-state/app-state.action'
import { store } from '../stores/configureStore'
import { parseTime, formatTime, formatDate } from '../libs/datetime';

const BASE_URL = 'http://localhost:8080/admin/api'
const JWT_TOKEN = 'NIGAMON_JWT_TOKEN'
const apiClient = new ApiClient(BASE_URL)
const secureApiClient = new SecureApiClient(BASE_URL, JWT_TOKEN, () => {
    store.dispatch(logOut())
}).client


const TIMEOUT = 200
const RANDOM_MAX = 0
const ok = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(data), TIMEOUT + Math.random() * RANDOM_MAX)
    })
}
const fail = (err) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(err), TIMEOUT + Math.random() * RANDOM_MAX)
    })
}

export default class AdminApi {
    static login(email, password) {
        if (email === 'test@dev.com' && password === 'test') {
            return ok({
                isLogin: true,
                userInfo: {
                    name: 'Nguyen Tran Hau',
                    email: 'test@dev.com',
                    password: 'somerandompassword',
                    lastLogin: new Date('2019/05/06')
                }
            })
        } else {
            return ok({ isLogin: false })
        }
    }
    static checkLogin() {
        return ok({
            isLogin: true,
            userInfo: {
                name: 'Nguyen Tran Hau',
                email: 'test@dev.com',
                password: 'somerandompassword',
                lastLogin: new Date('2019/05/06')
            }
        })
    }
    // static logout() {
    //     localStorage.removeItem(JWT_TOKEN)
    // }
    // static login(email, password) {
    //     return apiClient.postJson('/login', { email, password })
    //         .then(data => {
    //             if (!data.isLogin) {
    //                 return data
    //             }
    //             localStorage.setItem(JWT_TOKEN, data.token)
    //             return {
    //                 ...data,
    //                 userInfo: {
    //                     ...data.userInfo,
    //                     lastLogin: data.userInfo.lastLogin && moment.utc(data.userInfo.lastLogin).toDate()
    //                 }
    //             }
    //         })
    // }
    // static checkLogin() {
    //     return secureApiClient.getJson('/login')
    //         .then(data => {
    //             return {
    //                 ...data,
    //                 userInfo: {
    //                     ...data.userInfo,
    //                     lastLogin: data.userInfo.lastLogin && moment.utc(data.userInfo.lastLogin).toDate()
    //                 }
    //             }
    //         })
    // }

    //--------------------- Dashboard ------------------------//
    static getDashboardMovies(page) {
        return secureApiClient.getJson('/dashboard/movies', { params: { page: page } })
            .then(data => {
                return {
                    ...data,
                    movies: data.movies.map(m => ({
                        ...m,
                        showTime: m.showTime.slice(0, 5)
                    }))
                }
            })
    }
    static getDashboardOrders(page) {
        return secureApiClient.getJson('/dashboard/orders', { params: { page: page } })
            .then(data => {
                return {
                    ...data,
                    orders: data.orders.map(o => ({
                        ...o,
                        date: formatDate(new Date(o.date)),
                        time: formatTime(new Date(o.time)),
                    }))
                }
            })
    }
    static getDashboardTheaters(page) {
        return secureApiClient.getJson('/dashboard/theaters', { params: { page: page } })
            .then(data => {
                return data
            })
    }

    static getTheaterChoices() {
        return secureApiClient.getJson('/theaters', {
            params: {
                page: 0,
                status: 1
            }
        }).then(data => {
            return {
                choices: data.theaters.map(t => ({
                    id: t.id,
                    label: t.name
                }))
            }
        })
    }
    static getDashboardCharts(start, end) {
        return secureApiClient.getJson('/dashboard/charts', {
            params: {
                start: start,
                end: end
            }
        }).then(data => {
            return {
                ...data,
                charts: {
                    ...data.charts,
                    income: {
                        ...data.charts.income,
                        labels: data.charts.income.labels.map(d => formatDate(new Date(d)))
                    },
                    newUser: {
                        ...data.charts.newUser,
                        labels: data.charts.newUser.labels.map(d => formatDate(new Date(d)))
                    }
                }
            }
        })
    }

    //--------------------- Users ------------------------//
    static getUsers(page, options) {
        return secureApiClient.getJson('/users', {
            params: {
                page: page,
                ...options
            }
        }).then(data => {
            return {
                ...data,
                movies: data.movies.map(m => {
                    return {
                        ...m,
                        start: m.start && moment.utc(m.start).toDate(),
                        end: m.end && moment.utc(m.end).toDate()
                    }
                })
            }
        })
    }
    static uploadUser(user, addNew) {
        return secureApiClient.postJson(`/users/${user.id}`, user, { params: { addNew: addNew } })
            .then(data => data)
    }
    static removeUser(user) {
        return secureApiClient.deleteJson(`/users/${user.id}`)
    }
    //--------------------- Theaters ------------------------//
    static getTheaterStatusChoices() {
        return secureApiClient.getJson('/theaters/status')
    }
    static getTheaters(page, options) {
        return secureApiClient.getJson('/theaters', {
            params: {
                page: page,
                ...options
            }
        }).then(data => {
            return data
        })
    }
    static getShowTimes(theater, date, options) {
        return secureApiClient.getJson(`/theaters/${theater.id}/showtimes`, { params: { date: date } })
            .then(data => {
                return {
                    showTimes: data.showTimes.map(s => ({
                        ...s,
                        time: parseTime(s.time)
                    }))
                }
            })
    }

    static uploadTheater(theater, addNew) {
        return secureApiClient.postJson(`/theaters/${theater.id}`, theater, { params: { addNew: addNew } })
    }
    static removeTheater(theater) {
        return secureApiClient.deleteJson(`/theaters/${theater.id}`)
    }
    static uploadShowTime(theater, date, showTime, addNew, options) {
        const data = {
            ...showTime,
            time: formatTime(showTime.time)
        }
        return secureApiClient.postJson(`/theaters/${theater.id}/showtimes`, data, {
            params: {
                date: date,
                addNew: addNew
            }
        })
    }
    static removeShowTime(theater, date, showTime, options) {
        return secureApiClient.deleteJson(`/theaters/${theater.id}/showtimes/${showTime.id}`, {
            params: {
                date: date,
            }
        })
    }

    //--------------------- Tickets ------------------------//
    static getTicketStatusChoices() {
        return secureApiClient.getJson('/tickets/status')
    }
    static getTickets(page, options) {
        return secureApiClient.getJson('/tickets', {
            params: {
                page: page,
                ...options
            }
        }).then(data => {
            return data
        })
    }
    static uploadTicket(ticket, addNew) {
        return secureApiClient.postJson(`/tickets/${ticket.id}`, ticket, { params: { addNew: addNew } })
            .then(data => data)
    }
    static removeTicket(ticket) {
        return secureApiClient.deleteJson(`/tickets/${ticket.id}`)
    }

    //--------------------- Foods ------------------------//
    static getFoodStatusChoices() {
        return secureApiClient.getJson('/foods/status')
    }
    static getFoods(page, options) {
        return secureApiClient.getJson('/foods', {
            params: {
                page: page,
                ...options
            }
        }).then(data => {
            return data
        })
    }
    static uploadFood(food, addNew) {
        return secureApiClient.postJson(`/foods/${food.id}`, food, { params: { addNew: addNew } })
            .then(data => data)
    }
    static removeFood(food) {
        return secureApiClient.deleteJson(`/foods/${food.id}`)
    }

    //--------------------- Orders ------------------------//
    static getOrderStatusChoices() {
        return secureApiClient.getJson('/orders/status')
    }
    static getOrders(page, options) {
        secureApiClient.postJson('/orders/1', {
            id: 1,
            username: 'a'
        }, { params: { addNew: true } })
        return secureApiClient.getJson('/orders', {
            params: {
                page: page,
                ...options
            }
        }).then(data => {
            return {
                ...data,
                orders: data.orders.map(o => {
                    return {
                        ...o,
                        datetime: new Date(o.datetime),
                        tickets: o.tickets.map(t => {
                            return {
                                ...t,
                                date: new Date(t.date),
                                time: parseTime(t.time)
                            }
                        })
                    }
                })
            }
        })
    }
    static uploadOrder(order, addNew) {
        return secureApiClient.postJson(`/orders/${order.id}`, order, { params: { addNew: addNew } })
            .then(data => data)
    }
    static removeOrder(order) {
        return secureApiClient.deleteJson(`/orders/${order.id}`)
    }
}