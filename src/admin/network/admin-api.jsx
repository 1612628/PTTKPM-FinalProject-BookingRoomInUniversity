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
    static logout() {
        localStorage.removeItem(JWT_TOKEN)
    }
    static login(username, password) {
        // return ok({
        //     isLogin: true
        // })
        return apiClient.postJson('/login', { username, password })
            .then(data => {
                if (!data.isLogin) {
                    return data
                }
                localStorage.setItem(JWT_TOKEN, data.token)
                return {
                    ...data,
                    userInfo: {
                        ...data.userInfo,
                        lastLogin: new Date()
                    }
                }
            })
    }
    static checkLogin() {
        // return ok({
        //     isLogin: true
        // })
        return secureApiClient.getJson('/login')
            .then(data => {
                return {
                    ...data,
                    userInfo: {
                        ...data.userInfo,
                    }
                }
            })
    }

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
    // admin
    static getAdmins(page, options) {
        return secureApiClient.getJson('/users/admins', {
            params: {
                page: page,
                ...options
            }
        })
    }
    static uploadAdmin(admin, addNew) {
        return secureApiClient.postJson(`/users/admins/${admin.id}`, admin, { params: { addNew: addNew } })
            .then(data => data)
    }
    static removeAdmin(admin) {
        return secureApiClient.deleteJson(`/users/admins/${admin.id}`)
    }
    // member
    static getMembers(page, options) {
        return secureApiClient.getJson('/users/members', {
            params: {
                page: page,
                ...options
            }
        })
    }
    static uploadMember(member, addNew) {
        return secureApiClient.postJson(`/users/members/${member.id}`, member, { params: { addNew: addNew } })
            .then(data => data)
    }
    static removeMember(member) {
        return secureApiClient.deleteJson(`/users/members/${member.id}`)
    }

    //--------------------- Rooms ------------------------//
    // status
    static getRoomStatusChoices() {
        return secureApiClient.getJson('/rooms/status')
    }

    // campus
    static getCampusChoices() {
        return secureApiClient.getJson('/campus')
    }

    // building
    static getBuildingChoices(campusId) {
        return secureApiClient.getJson(`/buildings`, { params: { campus: campusId } })
            .then(data => {
                return data
            })
    }

    // status
    static getRoomStatusChoices() {
        return secureApiClient.getJson('/rooms/status')
    }

    // normal
    static getNormals(page, options) {
        return secureApiClient.getJson('/rooms/normals', {
            params: {
                page: page,
                ...options
            }
        }).then(data => {
            return data
        })
    }
    static uploadNormal(normal, addNew) {
        return secureApiClient.postJson(`/rooms/normals/${normal.id}`, normal, { params: { addNew: addNew } })
    }

    // hall
    static getHalls(page, options) {
        return secureApiClient.getJson('/rooms/halls', {
            params: {
                page: page,
                ...options
            }
        }).then(data => {
            return data
        })
    }
    static uploadHalls(hall, addNew) {
        return secureApiClient.postJson(`/rooms/halls/${hall.id}`, hall, { params: { addNew: addNew } })
    }

    // lecture time
    static getLectureTimes(room, date, options) {
        return secureApiClient.getJson(`/rooms/${room.id}/lecture_times`, { params: { date: date } })
            .then(data => {
                return {
                    lectureTimes: data.lectureTimes.map(s => ({
                        ...s,
                        start: parseTime(s.start),
                        end: parseTime(s.end)
                    }))
                }
            })
    }
    static uploadLectureTime(room, date, lectureTime, options) {
        const data = {
            ...lectureTime,
        }
        return secureApiClient.postJson(`/rooms/${room.id}/lecture_times`, data, {
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

    //--------------------- Devices ------------------------//
    static getDevices(page, options) {
        return secureApiClient.getJson('/devices', {
            params: {
                page: page,
                ...options
            }
        }).then(data => {
            return {
                ...data,
                devices: data.devices.map(d => ({
                    ...d,
                    date: new Date(d.date)
                }))
            }
        })
    }
    static uploadDevice(device, addNew) {
        return secureApiClient.postJson(`/devices/${device.id}`, device, { params: { addNew: addNew } })
            .then(data => data)
    }
    static removeDevice(device) {
        return secureApiClient.deleteJson(`/devices/${device.id}`)
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