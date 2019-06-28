import { actions } from './rooms.type'
import AdminAPI from '../../network/admin-api'
import { codes } from '../../network/message-codes'
import Swal from 'sweetalert2'

export const loadContent = () => {
    return (dispatch, getState) => {
        dispatch(loadStatusChoices())
        dispatch(loadCampusChoices())
        dispatch(loadBuildingChoices(0))
        dispatch(loadBuildingChoicesNormal(0))
        dispatch(loadNormals(1))
        dispatch(loadHalls(1))
    }
}

// normal rooms 
const loadingNormals = (loading) => {
    return {
        type: actions.LOADING_NORMALS,
        loading: loading
    }
}
const setNormals = (rooms, err) => {
    return {
        type: actions.SET_NORMALS,
        data: rooms,
        error: err
    }
}
export const loadNormals = (page, options) => {
    return (dispatch, getState) => {
        dispatch(loadingNormals(true))
        AdminAPI.getNormals(page, options)
            .then(data => {
                if (data.rooms) {
                    dispatch(setNormals(data, null))
                    dispatch(loadingNormals(false))
                } else {
                    dispatch(setNormals(null, 'no normals found'))
                    dispatch(loadingNormals(false))
                }
            })
            .catch(err => {
                dispatch(setNormals(null, 'request timeout ' + err))
                dispatch(loadingNormals(false))
            })
    }
}
export const uploadNormal = (room, addNew) => {
    return (dispatch, getState) => {
        AdminAPI.uploadNormal(room, addNew)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadNormals(1))
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

// halls rooms 
const loadingHalls = (loading) => {
    return {
        type: actions.LOADING_HALLS,
        loading: loading
    }
}
const setHalls = (rooms, err) => {
    return {
        type: actions.SET_HALLS,
        data: rooms,
        error: err
    }
}
export const loadHalls = (page, options) => {
    return (dispatch, getState) => {
        dispatch(loadingHalls(true))
        AdminAPI.getHalls(page, options)
            .then(data => {
                if (data.rooms) {
                    dispatch(setHalls(data, null))
                    dispatch(loadingHalls(false))
                } else {
                    dispatch(setHalls(null, 'no halls found'))
                    dispatch(loadingHalls(false))
                }
            })
            .catch(err => {
                dispatch(setNormals(null, 'request timeout ' + err))
                dispatch(loadingNormals(false))
            })
    }
}
export const uploadHall = (room, addNew) => {
    return (dispatch, getState) => {
        AdminAPI.uploadHalls(room, addNew)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadHalls(1))
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

// show times
const loadingLectureTimes = (loading) => {
    return {
        type: actions.LOADING_LECTURE_TIMES,
        loading: loading
    }
}
const setLectureTimes = (lectureTimes, err) => {
    return {
        type: actions.SET_LECTURE_TIMES,
        data: lectureTimes,
        error: err
    }
}
export const loadLectureTimes = (room, date, options) => {
    return (dispatch, getState) => {
        dispatch(loadingLectureTimes(true))
        AdminAPI.getLectureTimes(room, date, options)
            .then(data => {
                if (data.showTimes) {
                    dispatch(setLectureTimes(data, null))
                    dispatch(loadingLectureTimes(false))
                } else {
                    dispatch(setLectureTimes(null, 'no lecture times found'))
                    dispatch(loadingLectureTimes(false))
                }
            })
            .catch(err => {
                dispatch(setLectureTimes(null, 'request timeout ' + err))
                dispatch(loadingLectureTimes(false))
            })
    }
}
export const uploadLectureTime = (room, date, lectureTime) => {
    return (dispatch, getState) => {
        AdminAPI.uploadLectureTime(room, date, lectureTime)
            .then(data => {
                switch (data.code) {
                    case codes.OK:
                        return Swal.fire({
                            title: 'Thanh cong',
                            type: 'success',
                        }).then(() => {
                            dispatch(loadLectureTimes(room, date))
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
        type: actions.LOADING_ROOM_STATUS,
        loading: loading
    }
}
const setStatusChoices = (data, err) => {
    return {
        type: actions.SET_ROOM_STATUS,
        data: data,
        error: err
    }
}
export const loadStatusChoices = () => {
    console.log('load status')
    return (dispatch, getState) => {
        dispatch(loadingStatusChoices(true))
        AdminAPI.getRoomStatusChoices()
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

// campus choices 
const loadingCampusChoices = (loading) => {
    return {
        type: actions.LOADING_CAMPUS_CHOICES,
        loading: loading
    }
}
const setCampusChoices = (data, err) => {
    return {
        type: actions.SET_CAMPUS_CHOICES,
        data: data,
        error: err
    }
}
export const loadCampusChoices = (cb) => {
    return (dispatch, getState) => {
        dispatch(loadingCampusChoices(true))
        AdminAPI.getCampusChoices()
            .then(data => {
                if (data.choices) {
                    (cb || (() => console.warn('no callback')))(data.choices)
                    dispatch(setCampusChoices(data, null))
                    dispatch(loadingCampusChoices(false))
                } else {
                    dispatch(setCampusChoices(null, 'no choices found'))
                    dispatch(loadingCampusChoices(false))
                }
            })
            .catch(err => {
                dispatch(setCampusChoices(null, 'request timeout ' + err))
                dispatch(loadingCampusChoices(false))
            })
    }
}

// building choices 
const loadingBuildingChoices = (loading) => {
    return {
        type: actions.LOADING_BUILDING_CHOICES,
        loading: loading
    }
}
const setBuildingChoices = (data, err) => {
    return {
        type: actions.SET_BUILDING_CHOICES,
        data: data,
        error: err
    }
}
export const loadBuildingChoices = (campusId) => {
    return (dispatch, getState) => {
        dispatch(loadingBuildingChoices(true))
        AdminAPI.getBuildingChoices(campusId)
            .then(data => {
                if (data.choices) {
                    dispatch(setBuildingChoices(data, null))
                    dispatch(loadingBuildingChoices(false))
                } else {
                    dispatch(setBuildingChoices(null, 'no choices found'))
                    dispatch(loadingBuildingChoices(false))
                }
            })
            .catch(err => {
                dispatch(setBuildingChoices(null, 'request timeout ' + err))
                dispatch(loadingBuildingChoices(false))
            })
    }
}

// building choices normal
const loadingBuildingChoicesNormal = (loading) => {
    return {
        type: actions.LOADING_BUILDING_CHOICES_NORMAL,
        loading: loading
    }
}
const setBuildingChoicesNormal = (data, err) => {
    return {
        type: actions.SET_BUILDING_CHOICES_NORMAL,
        data: data,
        error: err
    }
}
export const loadBuildingChoicesNormal = (campusId) => {
    return (dispatch, getState) => {
        dispatch(loadingBuildingChoicesNormal(true))
        AdminAPI.getBuildingChoices(campusId)
            .then(data => {
                if (data.choices) {
                    dispatch(setBuildingChoicesNormal(data, null))
                    dispatch(loadingBuildingChoicesNormal(false))
                } else {
                    dispatch(setBuildingChoicesNormal(null, 'no choices found'))
                    dispatch(loadingBuildingChoicesNormal(false))
                }
            })
            .catch(err => {
                dispatch(setBuildingChoicesNormal(null, 'request timeout ' + err))
                dispatch(loadingBuildingChoicesNormal(false))
            })
    }
}