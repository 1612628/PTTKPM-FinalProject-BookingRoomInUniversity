import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import sideNavbarReducer from './side-navbar/side-navbar.reducer'
import appStateReducer from './app-state/app-state.reducer'
import dashboardReducer from './dashboard/dashboard.reducer'
import usersReducer from './users/users.reducer'
import roomsReducer from './rooms/rooms.reducer'
import ticketsReducer from './tickets/tickets.reducer'
import devicesReducer from './devices/devices.reducer'
import orderReducer from './orders/orders.reducer'

const rootReducer = combineReducers({
    sideNavbar: sideNavbarReducer,
    appState: appStateReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    rooms: roomsReducer,
    tickets: ticketsReducer,
    devices: devicesReducer,
    orders: orderReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))