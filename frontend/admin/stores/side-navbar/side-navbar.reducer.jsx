import { actions } from './side-navbar.type'
import { routes } from '../../routes'

const initState = {
    navList: {
        activeIndex: 0,
        navOptions: {
            [routes.USER.id]: {
                href: routes.USER.path,
                text: 'Tai khoan',
                iconName: 'user'
            },
            [routes.ROOM.id]: {
                href: routes.ROOM.path,
                text: 'Phong hoc',
                iconName: 'warehouse'
            },
            [routes.DEVICE.id]: {
                href: routes.DEVICE.path,
                text: 'Thiet bi',
                iconName: 'lightbulb'
            },
        }
    }

}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.CHANGE_ACTIVE_NAV_OPTION: {
            return {
                ...state,
                navList: {
                    ...state.navList,
                    activeIndex: action.index
                }
            }
        }
        default: {
            return state
        }
    }
}

export default reducer