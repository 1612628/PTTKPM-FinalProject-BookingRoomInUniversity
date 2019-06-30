import { actions } from './dashboard.type'

const initialState = {
    movies: {
        data: null,
        isLoading: true,
        error: null,
        currentPage: 1,
        lastPage: 1,
        total: 0
    },
    theaters: {
        data: null,
        isLoading: true,
        error: null,
        currentPage: 1,
        lastPage: 1,
        total: 0
    },
    orders: {
        data: null,
        isLoading: true,
        error: null,
        currentPage: 1,
        lastPage: 1,
        total: 0
    },
    charts: {
        income: null,
        newUser: null,
        incomeShare: null,
        isLoading: true,
        error: null,
    },
    theaterChoices: {
        data: null,
        isLoading: true,
        error: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOADING_DASHBOARD_MOVIES: {
            return {
                ...state,
                movies: {
                    ...state.movies,
                    isLoading: action.loading
                }
            }
        }
        case actions.LOADING_DASHBOARD_THEATERS: {
            return {
                ...state,
                theaters: {
                    ...state.theaters,
                    isLoading: action.loading
                }
            }
        }
        case actions.LOADING_DASHBOARD_ORDERS: {
            return {
                ...state,
                orders: {
                    ...state.orders,
                    isLoading: action.loading
                }
            }
        }
        case actions.LOADING_CHARTS: {
            return {
                ...state,
                charts: {
                    ...state.charts,
                    isLoading: action.loading
                }
            }
        }
        case actions.LOADING_THEATER_CHOICES: {
            return {
                ...state,
                theaterChoices: {
                    ...state.theaterChoices,
                    isLoading: action.loading
                }
            }
        }

        case actions.SET_DASHBOARD_MOVIES: {
            return {
                ...state,
                movies: {
                    ...state.movies,
                    data: action.data ? action.data.movies : null,
                    error: action.error,
                    currentPage: action.data ? action.data.currentPage : 1,
                    lastPage: action.data ? action.data.lastPage : 1,
                    total: action.data ? action.data.total : 1,
                }
            }
        }
        case actions.SET_DASHBOARD_THEATERS: {
            return {
                ...state,
                theaters: {
                    ...state.theaters,
                    data: action.data ? action.data.theaters : null,
                    error: action.error,
                    currentPage: action.data ? action.data.currentPage : 1,
                    lastPage: action.data ? action.data.lastPage : 1,
                    total: action.data ? action.data.total : 1,
                }
            }
        }
        case actions.SET_DASHBOARD_ORDERS: {
            return {
                ...state,
                orders: {
                    ...state.orders,
                    data: action.data ? action.data.orders : null,
                    error: action.error,
                    currentPage: action.data ? action.data.currentPage : 1,
                    lastPage: action.data ? action.data.lastPage : 1,
                    total: action.data ? action.data.total : 1,
                }
            }
        }
        case actions.SET_CHARTS: {
            return {
                ...state,
                charts: {
                    ...state.charts,
                    income: action.data ? action.data.charts.income : null,
                    newUser: action.data ? action.data.charts.newUser : null,
                    incomeShare: action.data ? action.data.charts.incomeShare : null,
                    error: action.error,
                }
            }
        }
        case actions.SET_THEATER_CHOICES: {
            return {
                ...state,
                theaterChoices: {
                    ...state.theaterChoices,
                    data: action.data ? action.data.choices : null,
                    error: action.error
                }
            }
        }
        default:
            return state
    }
}

export default reducer