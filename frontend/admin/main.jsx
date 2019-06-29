import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './stores/configureStore'
import { routes } from './routes'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import UserScreen from './screens/user-screen'
import RoomScreen from './screens/room-screen'
import DeviceScreen from './screens/device-screen'
import LoginScreen from './screens/login-screen';
import ResetPasswordScreen from './screens/reset-password-screen';

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path={routes.RESET_PASSWORD.path} component={ResetPasswordScreen} />
                    <Route path={routes.LOGIN.path} component={LoginScreen} />
                    <Route path={routes.DEVICE.path} component={DeviceScreen} />
                    <Route path={routes.USER.path} component={UserScreen} />
                    <Route path={routes.ROOM.path} component={RoomScreen} />
                    <Route path={routes.DEFAULT.path} component={RoomScreen} />
                </Switch>
            </BrowserRouter>
        )
    }
}


let container = document.getElementById('app-container')
render((
    <Provider store={store}>
        <App />
    </Provider>
), container)