import { actions } from './dashboard.type'
import AdminAPI from '../../network/admin-api'

export const loadContent = () => {
    return (dispatch, getState) => {
        dispatch(loadOrders(1))
        dispatch(loadMovies(1))
        dispatch(loadTheaters(1))
        dispatch(loadTheaterChoices())
        dispatch(loadCharts(new Date(), new Date(), 0))
    }
}

// movies
const loadingMovies = (loading) => {
    return {
        type: actions.LOADING_DASHBOARD_MOVIES,
        loading: loading
    }
}
const setMovies = (movies, err) => {
    return {
        type: actions.SET_DASHBOARD_MOVIES,
        data: movies,
        error: err
    }
}
export const loadMovies = (page) => {
    return (dispatch, getState) => {
        dispatch(loadingMovies(true))
        AdminAPI.getDashboardMovies(page)
            .then(data => {
                if (data.movies) {
                    dispatch(setMovies(data, null))
                    dispatch(loadingMovies(false))
                } else {
                    dispatch(setMovies(null, 'no movies found'))
                    dispatch(loadingMovies(false))
                }
            })
            .catch(err => {
                dispatch(setMovies(null, 'request timeout ' + err))
                dispatch(loadingMovies(false))
            })
    }
}

// orders
const loadingOrders = (loading) => {
    return {
        type: actions.LOADING_DASHBOARD_ORDERS,
        loading: loading
    }
}
const setOrders = (orders, err) => {
    return {
        type: actions.SET_DASHBOARD_ORDERS,
        data: orders,
        error: err
    }
}
export const loadOrders = (page) => {
    return (dispatch, getState) => {
        dispatch(loadingOrders(true))
        AdminAPI.getDashboardOrders(page)
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

// theaters
const loadingTheaters = (loading) => {
    return {
        type: actions.LOADING_DASHBOARD_THEATERS,
        loading: loading
    }
}
const setTheaters = (theaters, err) => {
    return {
        type: actions.SET_DASHBOARD_THEATERS,
        data: theaters,
        error: err
    }
}
export const loadTheaters = (page) => {
    return (dispatch, getState) => {
        dispatch(loadingTheaters(true))
        AdminAPI.getDashboardTheaters(page)
            .then(data => {
                if (data.theaters) {
                    dispatch(setTheaters(data, null))
                    dispatch(loadingTheaters(false))
                } else {
                    dispatch(setTheaters(null, 'no theaters found'))
                    dispatch(loadingTheaters(false))
                }
            })
            .catch(err => {
                dispatch(setTheaters(null, 'request timeout ' + err))
                dispatch(loadingTheaters(false))
            })
    }
}

// charts
const loadingCharts = (loading) => {
    return {
        type: actions.LOADING_CHARTS,
        loading: loading
    }
}
const setCharts = (charts, err) => {
    return {
        type: actions.SET_CHARTS,
        data: charts,
        error: err
    }
}
export const loadCharts = (start, end) => {
    return (dispatch, getState) => {
        dispatch(loadingCharts(true))
        AdminAPI.getDashboardCharts(start, end)
            .then(data => {
                if (data.charts) {
                    dispatch(setCharts(data, null))
                    dispatch(loadingCharts(false))
                } else {
                    dispatch(setCharts(null, 'no info found'))
                    dispatch(loadingCharts(false))
                }
            })
            .catch(err => {
                dispatch(setCharts(null, 'request timeout ' + err))
                dispatch(loadingCharts(false))
            })
    }
}

// charts
const loadingTheaterChoices = (loading) => {
    return {
        type: actions.LOADING_THEATER_CHOICES,
        loading: loading
    }
}
const setTheaterChoices = (data, err) => {
    return {
        type: actions.SET_THEATER_CHOICES,
        data: data,
        error: err
    }
}
export const loadTheaterChoices = () => {
    return (dispatch, getState) => {
        dispatch(loadingTheaterChoices(true))
        AdminAPI.getTheaterChoices()
            .then(data => {
                if (data.choices) {
                    dispatch(setTheaterChoices(data, null))
                    dispatch(loadingTheaterChoices(false))
                } else {
                    dispatch(setTheaterChoices(null, 'no choices found'))
                    dispatch(loadingTheaterChoices(false))
                }
            })
            .catch(err => {
                dispatch(setTheaterChoices(null, 'request timeout ' + err))
                dispatch(loadingTheaterChoices(false))
            })
    }
}