import { actions } from './devices.type'
import AdminAPI from '../../network/admin-api'
import { codes } from '../../network/message-codes'
import Swal from 'sweetalert2'

export const loadContent = () => {
    return (dispatch, getState) => {
        dispatch(loadDevices(1))
    }
}

// devices 
const loadingDevices = (loading) => {
    return {
        type: actions.LOADING_DEVICES,
        loading: loading
    }
}
const setDevices = (data, err) => {
    return {
        type: actions.SET_DEVICES,
        data: data,
        error: err
    }
}
export const loadDevices = (page, options) => {
    return (dispatch, getState) => {
        dispatch(loadingDevices(true))
        AdminAPI.getDevices(page, options)
            .then(data => {
                if (data.devices) {
                    dispatch(setDevices(data, null))
                    dispatch(loadingDevices(false))
                } else {
                    dispatch(setDevices(null, 'no devices found'))
                    dispatch(loadingDevices(false))
                }
            })
            .catch(err => {
                dispatch(setDevices(null, 'request timeout ' + err))
                dispatch(loadingDevices(false))
            })
    }
}
export const uploadDevice = (item, addNew) => {
    return (dispatch, getState) => {
        AdminAPI.uploadDevice(item, addNew)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadDevices(1))
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
export const removeDevice = (device) => {
    return (dispatch, getState) => {
        AdminAPI.removeDevice(device)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadDevices(1))
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