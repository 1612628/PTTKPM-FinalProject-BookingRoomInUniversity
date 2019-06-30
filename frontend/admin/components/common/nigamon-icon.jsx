import React from 'react'

export class NigamonIcon extends React.Component {
    render() {
        return (
            <i className={`fas fa-${this.props.name} ${this.props.className}`}></i>
        )
    }
}