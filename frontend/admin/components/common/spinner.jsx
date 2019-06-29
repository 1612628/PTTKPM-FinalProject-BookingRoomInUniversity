import React from 'react'

export class Spinner extends React.Component {
    render() {
        let style = {
            ...this.props.style,
            fontSize: '16px'
        }
        return (
            <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: this.props.size, height: this.props.size, ...style }}
            >
                <span className="sr-only">Loading...</span>
            </div>
        )
    }
}