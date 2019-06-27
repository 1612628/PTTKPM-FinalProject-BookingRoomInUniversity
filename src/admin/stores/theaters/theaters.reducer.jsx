import { actions } from './theaters.type'

const initialState = {
    theaters: {
        data: null,
        isLoading: true,
        error: null,
        currentPage: 1,
        lastPage: 1,
        total: 0
    },
    statusChoices: {
        data: null,
        isLoading: true,
        error: null
    },
    showTimes: {
        data: null,
        isLoading: true,
        error: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOADING_THEATERS: {
            return {
                ...state,
                theaters: {
                    ...state.theaters,
                    isLoading: action.loading
                }
            }
        }
        case actions.LOADING_SHOW_TIMES: {
            return {
                ...state,
                showTimes: {
                    ...state.showTimes,
                    isLoading: action.loading
                }
            }
        }
        case actions.LOADING_THEATER_STATUS_CHOICES: {
            return {
                ...state,
                statusChoices: {
                    ...state.statusChoices,
                    isLoading: action.loading
                }
            }
        }

        case actions.SET_THEATERS: {
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
        case actions.SET_SHOW_TIMES: {
            return {
                ...state,
                showTimes: {
                    ...state.showTimes,
                    data: action.data ? action.data.showTimes : null,
                    error: action.error,
                }
            }
        }
        case actions.SET_THEATER_STATUS_CHOICES: {
            return {
                ...state,
                statusChoices: {
                    ...state.statusChoices,
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