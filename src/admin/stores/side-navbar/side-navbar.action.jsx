import { actions } from './side-navbar.type'

export const changeActiveNavOption = (index) => {
    return {
        type: actions.CHANGE_ACTIVE_NAV_OPTION,
        index: index
    }
}