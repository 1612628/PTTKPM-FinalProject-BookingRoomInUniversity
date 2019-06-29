import { actions } from './tickets.type'
import AdminAPI from '../../network/admin-api'
import { codes } from '../../network/message-codes'
import Swal from 'sweetalert2'

export const loadContent = () => {
    return (dispatch, getState) => {
        dispatch(loadStatusChoices())
        dispatch(loadTickets(1))
    }
}

// movies
const loadingTickets = (loading) => {
    return {
        type: actions.LOADING_TICKETS,
        loading: loading
    }
}
const setTickets = (movies, err) => {
    return {
        type: actions.SET_TICKETS,
        data: movies,
        error: err
    }
}
export const loadTickets = (page, options) => {
    return (dispatch, getState) => {
        dispatch(loadingTickets(true))
        AdminAPI.getTickets(page, options)
            .then(data => {
                if (data.tickets) {
                    dispatch(setTickets(data, null))
                    dispatch(loadingTickets(false))
                } else {
                    dispatch(setTickets(null, 'no tickets found'))
                    dispatch(loadingTickets(false))
                }
            })
            .catch(err => {
                dispatch(setTickets(null, 'request timeout ' + err))
                dispatch(loadingTickets(false))
            })
    }
}
export const uploadTicket = (ticket, addNew) => {
    return (dispatch, getState) => {
        AdminAPI.uploadTicket(ticket, addNew)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadTickets(1))
                        })
                    case codes.FAILED:
                        return Swal.fire({
                            title: 'Loi',
                            type: 'error',
                        }).then(() => { })
                }
            })
    }
}
export const removeTicket = (ticket) => {
    return (dispatch, getState) => {
        AdminAPI.removeTicket(ticket)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadTickets(1))
                        })
                    case codes.FAILED:
                        return Swal.fire({
                            title: 'Loi',
                            type: 'error',
                        }).then(() => { })
                }
            })
    }
}

// genre choices 
const loadingStatusChoices = (loading) => {
    return {
        type: actions.LOADING_TICKET_STATUS_CHOICES,
        loading: loading
    }
}
const setStatusChoices = (data, err) => {
    return {
        type: actions.SET_TICKET_STATUS_CHOICES,
        data: data,
        error: err
    }
}
export const loadStatusChoices = () => {
    return (dispatch, getState) => {
        dispatch(loadingStatusChoices(true))
        AdminAPI.getTicketStatusChoices()
            .then(data => {
                if (data.choices) {
                    dispatch(setStatusChoices(data, null))
                    dispatch(loadingStatusChoices(false))
                } else {
                    dispatch(setStatusChoices(null, 'no choices found'))
                    dispatch(loadingStatusChoices(false))
                }
            })
            .catch(err => {
                dispatch(setStatusChoices(null, 'request timeout ' + err))
                dispatch(loadingStatusChoices(false))
            })
    }
}