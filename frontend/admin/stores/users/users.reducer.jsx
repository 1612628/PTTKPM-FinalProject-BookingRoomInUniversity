import { actions } from './users.type'

const initialState = {
    admins: {
        data: null,
        isLoading: true,
        error: null,
        currentPage: 1,
        lastPage: 1,
        total: 0
    },
    members: {
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
        // admin
        case actions.LOADING_ADMINS: {
            return {
                ...state,
                admins: {
                    ...state.admins,
                    isLoading: action.loading
                }
            }
        }

        case actions.SET_ADMINS: {
            return {
                ...state,
                admins: {
                    ...state.admins,
                    data: action.data ? action.data.admins : null,
                    error: action.error,
                    currentPage: action.data ? action.data.currentPage : 1,
                    lastPage: action.data ? action.data.lastPage : 1,
                    total: action.data ? action.data.total : 1,
                }
            }
        }

        // member
        case actions.LOADING_MEMBERS: {
            return {
                ...state,
                members: {
                    ...state.members,
                    isLoading: action.loading
                }
            }
        }

        case actions.SET_MEMBERS: {
            return {
                ...state,
                members: {
                    ...state.members,
                    data: action.data ? action.data.members : null,
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