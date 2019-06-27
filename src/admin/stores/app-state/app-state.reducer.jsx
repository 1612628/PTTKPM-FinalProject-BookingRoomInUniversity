import { actions } from './app-state.type'

const initialState = {
    isLoading: true,
    isLogin: false,
    userInfo: null,
    reload: false,
    loginError: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOGIN_ERROR: {
            return { ...state, loginError: action.error }
        }
        case actions.IS_LOGIN: {
            return { ...state, isLogin: action.isLogin }
        }
        case actions.SET_USER_INFO: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    ...action.info
                }
            }
        }
        case actions.LOGOUT: {
            return {
                ...initialState,
                isLoading: false
            }
        }
        case actions.RELOAD: {
            return {
                ...state,
                reload: action.reload
            }
        }
        default:
            return state
    }
}

export default reducer