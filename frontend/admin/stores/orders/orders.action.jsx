import { actions } from './orders.type'
import AdminAPI from '../../network/admin-api'
import { codes } from '../../network/message-codes'
import Swal from 'sweetalert2'

export const loadContent = () => {
    return (dispatch, getState) => {
        dispatch(loadStatusChoices())
        dispatch(loadOrders(1))
    }
}

// orders
const loadingOrders = (loading) => {
    return {
        type: actions.LOADING_ORDERS,
        loading: loading
    }
}
const setOrders = (orders, err) => {
    return {
        type: actions.SET_ORDERS,
        data: orders,
        error: err
    }
}
export const loadOrders = (page, options) => {
    return (dispatch, getState) => {
        dispatch(loadingOrders(true))
        AdminAPI.getOrders(page, options)
            .then(data => {
                if (data.orders) {
                    dispatch(setOrders(data, null))
                    dispatch(loadingOrders(false))
                } else {
                    dispatch(setOrders(null, 'no orders found'))
                    dispatch(loadingOrders(false))
                }
            })
            .catch(err => {
                dispatch(setOrders(null, 'request timeout ' + err))
                dispatch(loadingOrders(false))
            })
    }
}
export const uploadOrder = (order, addNew) => {
    return (dispatch, getState) => {
        AdminAPI.uploadOrder(order, addNew)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadOrders(1))
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

// status choices 
const loadingStatusChoices = (loading) => {
    return {
        type: actions.LOADING_ORDER_STATUS_CHOICES,
        loading: loading
    }
}
const setStatusChoices = (data, err) => {
    return {
        type: actions.SET_ORDER_STATUS_CHOICES,
        data: data,
        error: err
    }
}
export const loadStatusChoices = () => {
    return (dispatch, getState) => {
        dispatch(loadingStatusChoices(true))
        AdminAPI.getOrderStatusChoices()
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