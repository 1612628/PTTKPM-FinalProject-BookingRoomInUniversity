import { actions } from './users.type'
import AdminAPI from '../../network/admin-api'
import Swal from 'sweetalert2'
import { codes } from '../../network/message-codes';

export const loadContent = () => {
    return (dispatch, getState) => {
        dispatch(loadUsers(1))
    }
}

// movies
const loadingUsers = (loading) => {
    return {
        type: actions.LOADING_USERS,
        loading: loading
    }
}
const setUsers = (data, err) => {
    return {
        type: actions.SET_USERS,
        data: data,
        error: err
    }
}
export const loadUsers = (page, options) => {
    return (dispatch, getState) => {
        dispatch(loadingUsers(true))
        AdminAPI.getUsers(page, options)
            .then(data => {
                if (data.users) {
                    dispatch(setUsers(data, null))
                    dispatch(loadingUsers(false))
                } else {
                    dispatch(setUsers(null, 'no movies found'))
                    dispatch(loadingUsers(false))
                }
            })
            .catch(err => {
                dispatch(setUsers(null, 'request timeout ' + err))
                dispatch(loadingUsers(false))
            })
    }
}
export const uploadUser = (user, addNew) => {
    return (dispatch, getState) => {
        AdminAPI.uploadUser(user, addNew)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadUsers(1))
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
export const removeUser = (user) => {
    return (dispatch, getState) => {
        AdminAPI.removeUser(user)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadUsers(1))
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
const loadingGenreChoices = (loading) => {
    return {
        type: actions.LOADING_GENRE_CHOICES,
        loading: loading
    }
}
const setGenreChoices = (data, err) => {
    return {
        type: actions.SET_GENRE_CHOICES,
        data: data,
        error: err
    }
}
export const loadGenreChoices = () => {
    return (dispatch, getState) => {
        dispatch(loadingGenreChoices(true))
        AdminAPI.getGenreChoices()
            .then(data => {
                if (data.choices) {
                    dispatch(setGenreChoices(data, null))
                    dispatch(loadingGenreChoices(false))
                } else {
                    dispatch(setGenreChoices(null, 'no choices found'))
                    dispatch(loadingGenreChoices(false))
                }
            })
            .catch(err => {
                dispatch(setGenreChoices(null, 'request timeout ' + err))
                dispatch(loadingGenreChoices(false))
            })
    }
}