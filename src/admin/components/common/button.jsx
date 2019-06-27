import React from 'react'

export class Button extends React.Component {
    render() {
        return (
            <button
                className={`btn btn${this.props.active ? '' : '-outline'}-primary ${this.props.className}`}
                onClick={(e) => {
                    e.preventDefault()
                    this.props.onClick(e)
                }}
            >
                {this.props.label}
            </button>
        )
    }
}