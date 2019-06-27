import React from 'react'

export class Image extends React.Component {
    render() {
        return <img src={this.props.src} className={`w-100 ${this.props.className}`}></img>
    }
}