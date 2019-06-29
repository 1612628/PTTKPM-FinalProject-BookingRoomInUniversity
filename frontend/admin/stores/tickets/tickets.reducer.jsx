import { actions } from './tickets.type'

const initialState = {
    tickets: {
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
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOADING_TICKETS: {
            return {
                ...state,
                tickets: {
                    ...state.tickets,
                    isLoading: action.loading
                }
            }
        }
        case actions.LOADING_TICKET_STATUS_CHOICES: {
            return {
                ...state,
                statusChoices: {
                    ...state.statusChoices,
                    isLoading: action.loading
                }
            }
        }

        case actions.SET_TICKETS: {
            return {
                ...state,
                tickets: {
                    ...state.tickets,
                    data: action.data ? action.data.tickets : null,
                    error: action.error,
                    currentPage: action.data ? action.data.currentPage : 1,
                    lastPage: action.data ? action.data.lastPage : 1,
                    total: action.data ? action.data.total : 1,
                }
            }
        }
        case actions.SET_TICKET_STATUS_CHOICES: {
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