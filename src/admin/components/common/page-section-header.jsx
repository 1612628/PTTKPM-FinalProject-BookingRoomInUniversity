import React from 'react'

export class PageSectionHeader extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="h4 font-weight-bold">{this.props.label}</div>
                <div className="horizontal-line my-3"></div>
            </React.Fragment>
        )
    }
}