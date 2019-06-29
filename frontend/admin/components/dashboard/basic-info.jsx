import React from 'react'

export class BasicInfo extends React.Component {
    render() {
        return (
            <div className={`${this.props.className} d-flex flex-column align-items-start`}>
                <div className="h4 font-weight-bold">{this.props.label}</div>
                <div className="d-flex flex-column align-items-center">
                    <div className="horizontal-line my-2"></div>
                    <div className="h3 font-weight-bold mt-3">{this.props.details}</div>
                </div>
            </div>
        )
    }
}