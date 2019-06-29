import React from 'react'

export class Container extends React.Component {
    render() {
        return (
            <div className={`${this.props.className || 'my-5'} section-container`} style={{ minHeight: this.props.minHeight ? this.props.minHeight : 300 }}>
                <header className="section-header">
                    <div className="vertical-line mr-3"></div>
                    <div className="h5 font-weight-bold">{this.props.title}</div>
                </header>
                {this.props.children}
            </div>
        )
    }
}