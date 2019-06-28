import { actions } from './users.type'
import AdminAPI from '../../network/admin-api'
import Swal from 'sweetalert2'
import { codes } from '../../network/message-codes';

export const loadContent = () => {
    return (dispatch, getState) => {
        dispatch(loadAdmins(1))
        dispatch(loadMembers(1))
    }
}

//---------------------------- admin ---------------------------------//
const loadingAdmins = (loading) => {
    return {
        type: actions.LOADING_ADMINS,
        loading: loading
    }
}
const setAdmins = (data, err) => {
    return {
        type: actions.SET_ADMINS,
        data: data,
        error: err
    }
}
export const loadAdmins = (page, options) => {
    return (dispatch, getState) => {
        dispatch(loadingAdmins(true))
        AdminAPI.getAdmins(page, options)
            .then(data => {
                if (data.admins) {
                    dispatch(setAdmins(data, null))
                    dispatch(loadingAdmins(false))
                } else {
                    dispatch(setAdmins(null, 'no admin found'))
                    dispatch(loadingAdmins(false))
                }
            })
            .catch(err => {
                dispatch(setAdmins(null, 'request timeout ' + err))
                dispatch(loadingAdmins(false))
            })
    }
}
export const uploadAdmin = (admin, addNew) => {
    return (dispatch, getState) => {
        AdminAPI.uploadAdmin(admin, addNew)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadAdmins(1))
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
export const removeAdmin = (admin) => {
    return (dispatch, getState) => {
        AdminAPI.removeAdmin(admin)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadAdmins(1))
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

//---------------------------- member ---------------------------------//
const loadingMembers = (loading) => {
    return {
        type: actions.LOADING_MEMBERS,
        loading: loading
    }
}
const setMembers = (data, err) => {
    return {
        type: actions.SET_MEMBERS,
        data: data,
        error: err
    }
}
export const loadMembers = (page, options) => {
    return (dispatch, getState) => {
        dispatch(loadingMembers(true))
        AdminAPI.getMembers(page, options)
            .then(data => {
                if (data.members) {
                    dispatch(setMembers(data, null))
                    dispatch(loadingMembers(false))
                } else {
                    dispatch(setMembers(null, 'no member found'))
                    dispatch(loadingMembers(false))
                }
            })
            .catch(err => {
                dispatch(setMembers(null, 'request timeout ' + err))
                dispatch(loadingMembers(false))
            })
    }
}
export const uploadMember = (member, addNew) => {
    return (dispatch, getState) => {
        AdminAPI.uploadMember(member, addNew)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadMembers(1))
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
export const removeMember = (member) => {
    return (dispatch, getState) => {
        AdminAPI.removeMember(member)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadMembers(1))
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