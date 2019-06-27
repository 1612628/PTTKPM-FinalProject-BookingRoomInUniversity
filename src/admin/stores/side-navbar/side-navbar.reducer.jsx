import { actions } from './side-navbar.type'
import { routes } from '../../routes'

const initState = {
    navList: {
        activeIndex: 0,
        navOptions: {
            [routes.DASHBOARD.id]: {
                href: routes.DASHBOARD.path,
                text: 'Trang chinh',
                iconName: 'home'
            },
            [routes.USER.id]: {
                href: routes.USER.path,
                text: 'Tai khoan',
                iconName: 'user'
            },
            [routes.THEATER.id]: {
                href: routes.THEATER.path,
                text: 'Rap',
                iconName: 'warehouse'
            },
            [routes.TICKET.id]: {
                href: routes.TICKET.path,
                text: 'Ve',
                iconName: 'ticket-alt'
            },
            [routes.DEVICE.id]: {
                href: routes.DEVICE.path,
                text: 'Thiet bi',
                iconName: 'lightbulb'
            },
            [routes.ORDER.id]: {
                href: routes.ORDER.path,
                text: 'Don hang',
                iconName: 'shopping-cart'
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