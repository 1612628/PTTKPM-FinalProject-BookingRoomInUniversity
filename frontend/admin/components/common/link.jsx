import React from 'react'
import { NavLink } from 'react-router-dom'
import { store } from '../../stores/configureStore'
import { reload } from '../../stores/app-state/app-state.action'

export class Link extends React.Component {
    render() {
        return (
            <NavLink
                onClick={() => store.dispatch(reload(true))}
                to={this.props.href}
                className={`text-decoration-none ${this.props.className}`}
                {...this.props}
            >
                {this.props.children}
            </NavLink>
        )
    }
}