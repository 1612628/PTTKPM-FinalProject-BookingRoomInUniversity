import React from 'react'
import { ClickableView } from '../common/clickable-view'
import { NavOption } from './nav-option'

export class NavList extends React.Component {
    render() {
        let navOptions = Object.keys(this.props.navOptions).map(k => [k, this.props.navOptions[k]])
        let listOptions = navOptions.map(([id, opt]) => {
            return (
                <ClickableView
                    key={id}
                    onClick={() => this.props.onItemClick(opt, id)}>
                    <NavOption
                        active={this.props.activeIndex == id}
                        href={opt.href}
                        iconName={opt.iconName}
                        text={opt.text}
                    />
                </ClickableView>
            )
        })
        return (
            <nav className="mx-4 my-4">
                <ul className="menu">
                    {listOptions}
                </ul>
            </nav>

        )
    }
}