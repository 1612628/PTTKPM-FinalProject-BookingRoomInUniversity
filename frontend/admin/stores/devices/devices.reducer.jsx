import { actions } from './devices.type'

const initialState = {
    devices: {
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
        case actions.LOADING_DEVICES: {
            return {
                ...state,
                devices: {
                    ...state.devices,
                    isLoading: action.loading
                }
            }
        }

        case actions.SET_DEVICES: {
            return {
                ...state,
                devices: {
                    ...state.devices,
                    data: action.data ? action.data.devices : null,
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