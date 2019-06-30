import React from 'react'
import { isArray } from 'util';

export class ClickableView extends React.Component {
    render() {
        return (
            <div className={`m-0 pointer ${this.props.className}`} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }
}

export class InlineClickableView extends React.Component {
    render() {
        return (
            <span className={`m-0 pointer ${this.props.className}`} onClick={this.props.onClick}>
                {this.props.children}
            </span>
        )
    }
}

export class ClickableTableCells extends React.Component {
    render() {
        return (
            <React.Fragment>
                {this.props.children.map(v => {
                    if (v.type === React.Fragment && isArray(v.props.children)) {
                        return [...v.props.children]
                    }
                    return [v]
                }).reduce((prev, cur) => {
                    return prev.concat(cur)
                }, []).map((v, i) => {
                    return (
                        <td onClick={this.props.onClick} key={i}>{v}</td>
                    )
                })}
            </React.Fragment>
        )
    }
}