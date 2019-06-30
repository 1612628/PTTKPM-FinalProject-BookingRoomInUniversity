import React from 'react'

export class Image extends React.Component {
    render() {
        return <img src={this.props.src}
            className={`${this.props.className}`}></img>
    }
}