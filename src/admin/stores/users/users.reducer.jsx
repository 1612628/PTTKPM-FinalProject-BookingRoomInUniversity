import { actions } from './users.type'

const initialState = {
    users: {
        data: null,
        isLoading: true,
        error: null,
        currentPage: 1,
        lastPage: 1,
        total: 0
    },
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOADING_USERS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    isLoading: action.loading
                }
            }
        }

        case actions.SET_USERS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    data: action.data ? action.data.users : null,
                    error: action.error,
                    currentPage: action.data ? action.data.currentPage : 1,
                    lastPage: action.data ? action.data.lastPage : 1,
                    total: action.data ? action.data.total : 1,
                }
            }
        }
        default:
            return state
    }
}

export default reducer