import React from 'react'
import { ClickableView } from './clickable-view';
import { RemoteLoader } from './remote-loader';

export class Dropdown extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: null
        }

        this.handleChoiceClick = this.handleChoiceClick.bind(this)
        this.handleDefaultClick = this.handleDefaultClick.bind(this)
    }

    handleDefaultClick() {
        this.setState({ active: null })
        this.props.onDefaultClick()
    }

    handleChoiceClick(c) {
        this.setState({ active: c.id })
        this.props.onChoiceClick(c)
    }

    render() {
        let { choices, defaultLabel } = this.props
        let { active } = this.state
        return (
            <div className={`${this.props.className} dropdown mx-0 px-0`}>
                {this.props.title ? <span className="font-weight-bold">{this.props.title} &nbsp;&nbsp;</span> : null}
                <button className={`btn btn-outline-primary dropdown-toggle px-3 ${this.props.padding}`} type="button"
                    data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false"
                >
                    {active !== null ? choices.filter(c => c.id === active)[0].label : defaultLabel}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {this.props.choices.map((c, i) => {
                        return (
                            <ClickableView
                                key={c.id}
                                onClick={() => this.handleChoiceClick(c)}
                                className="dropdown-item"
                            >
                                {c.label}
                            </ClickableView>
                        )
                    })}
                    <div className="dropdown-divider"></div>
                    <ClickableView
                        onClick={() => this.handleDefaultClick()}
                        className="dropdown-item"
                    >
                        {this.props.defaultLabel}
                    </ClickableView>
                </div>
            </div>
        )
    }
}

export class RemoteDropdown extends React.Component {
    constructor(props) {
        super(props)

        this.renderDropdown = this.renderDropdown.bind(this)
    }

    renderDropdown() {
        let { data } = this.props
        return (
            <Dropdown
                className={this.props.className}
                padding={this.props.padding}
                defaultLabel={this.props.defaultLabel}
                onDefaultClick={this.props.onDefaultClick}
                choices={data.data}
                onChoiceClick={this.props.onChoiceClick}
            />
        )
    }

    render() {
        let { data } = this.props
        return (
            <RemoteLoader
                className={this.props.className}
                isLoading={data.isLoading}
                isFailed={data.choices === null || (data.error !== null && data.error !== undefined)}
                renderOnFailed={() => data.error}
                renderOnSuccess={this.renderDropdown}
            />
        )
    }
}