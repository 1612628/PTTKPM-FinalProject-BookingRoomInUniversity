import React from 'react'
import { NigamonIcon } from './nigamon-icon'

export class FloatingButton extends React.Component {
    render() {
        return (
            <button
                type="button"
                className="btn btn-primary shadow floating-action-btn rounded-circle"
                onClick={this.props.onClick}
            >
                <p className="h3 m-2">
                    <NigamonIcon name={this.props.iconName} className='text-white' />
                </p>
            </button >
        )
    }
}