import React from 'react'
import { Link } from '../common/link'
import { NigamonIcon } from '../common/nigamon-icon'

export class NavOption extends React.Component {
    render() {
        return (
            <li className={`${this.props.active ? 'active-menu-option' : ''} mb-4`}>
                <Link href={this.props.href}>
                    <div className="row align-items-center">
                        <p className="mr-4 h3 font-weight-bold">
                            <NigamonIcon name={this.props.iconName} />
                        </p>
                        <p className="h6 font-weight-bold">{this.props.text}</p>
                    </div>
                </Link>
            </li>
        )
    }
}