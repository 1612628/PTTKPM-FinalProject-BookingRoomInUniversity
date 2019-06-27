import React from 'react'
import { BaseHeader } from './base-header'
import { SearchBox } from './search-box';
import { NotificationHelp } from './notification-help';

export class FullHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }

    renderSearchBox() {
        return (
            <SearchBox
                value={this.state.value}
                onSearchChange={(text) => {
                    this.setState({ value: text })
                    this.props.onSearchChange(text)
                }}
                onSearchSubmit={this.props.onSearchSubmit}
            />
        )
    }

    renderNotificationAndHelp() {
        return (
            <NotificationHelp />
        )
    }

    render() {
        return (
            <BaseHeader
                title={this.props.title}
                middleChild={this.renderSearchBox()}
                rightChild={this.renderNotificationAndHelp()}
            />
        )
    }
}