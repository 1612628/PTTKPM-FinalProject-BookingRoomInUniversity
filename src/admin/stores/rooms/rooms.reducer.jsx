import { actions } from './rooms.type'

const initialState = {
    normals: {
        data: null,
        isLoading: true,
        error: null,
        currentPage: 1,
        lastPage: 1,
        total: 0
    },
    halls: {
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
    buildingChoices: {
        data: null,
        isLoading: true,
        error: null
    },
    buildingChoicesNormal: {
        data: null,
        isLoading: true,
        error: null
    },
    campusChoices: {
        data: null,
        isLoading: true,
        error: null
    },
    lectureTimes: {
        data: null,
        isLoading: true,
        error: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // done
        case actions.LOADING_NORMALS: {
            return {
                ...state,
                normals: {
                    ...state.normals,
                    isLoading: action.loading
                }
            }
        }
        // done
        case actions.SET_NORMALS: {
            return {
                ...state,
                normals: {
                    ...state.normals,
                    data: action.data ? action.data.rooms : null,
                    error: action.error,
                    currentPage: action.data ? action.data.currentPage : 1,
                    lastPage: action.data ? action.data.lastPage : 1,
                    total: action.data ? action.data.total : 1,
                }
            }
        }

        // done
        case actions.LOADING_HALLS: {
            return {
                ...state,
                halls: {
                    ...state.halls,
                    isLoading: action.loading
                }
            }
        }
        // done
        case actions.SET_HALLS: {
            return {
                ...state,
                halls: {
                    ...state.halls,
                    data: action.data ? action.data.rooms : null,
                    error: action.error,
                    currentPage: action.data ? action.data.currentPage : 1,
                    lastPage: action.data ? action.data.lastPage : 1,
                    total: action.data ? action.data.total : 1,
                }
            }
        }

        // done
        case actions.LOADING_ROOM_STATUS: {
            return {
                ...state,
                statusChoices: {
                    ...state.statusChoices,
                    isLoading: action.loading
                }
            }
        }
        // done
        case actions.SET_ROOM_STATUS: {
            return {
                ...state,
                statusChoices: {
                    ...state.statusChoices,
                    data: action.data ? action.data.choices : null,
                    error: action.error
                }
            }
        }

        // done
        case actions.LOADING_LECTURE_TIMES: {
            return {
                ...state,
                lectureTimes: {
                    ...state.lectureTimes,
                    isLoading: action.loading
                }
            }
        }
        // done
        case actions.SET_LECTURE_TIMES: {
            return {
                ...state,
                lectureTimes: {
                    ...state.lectureTimes,
                    data: action.data ? action.data.lectureTimes : null,
                    error: action.error,
                }
            }
        }

        // done
        case actions.LOADING_CAMPUS_CHOICES: {
            return {
                ...state,
                campusChoices: {
                    ...state.campusChoices,
                    isLoading: action.loading
                }
            }
        }
        // done
        case actions.SET_CAMPUS_CHOICES: {
            return {
                ...state,
                campusChoices: {
                    ...state.campusChoices,
                    data: action.data ? action.data.choices : null,
                    error: action.error
                }
            }
        }

        // done
        case actions.LOADING_BUILDING_CHOICES: {
            return {
                ...state,
                buildingChoices: {
                    ...state.buildingChoices,
                    isLoading: action.loading
                }
            }
        }
        // done
        case actions.SET_BUILDING_CHOICES: {
            return {
                ...state,
                buildingChoices: {
                    ...state.buildingChoices,
                    data: action.data ? action.data.choices : null,
                    error: action.error
                }
            }
        }

        // done
        case actions.LOADING_BUILDING_CHOICES_NORMAL: {
            return {
                ...state,
                buildingChoicesNormal: {
                    ...state.buildingChoicesNormal,
                    isLoading: action.loading
                }
            }
        }
        // done
        case actions.SET_BUILDING_CHOICES_NORMAL: {
            return {
                ...state,
                buildingChoicesNormal: {
                    ...state.buildingChoicesNormal,
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