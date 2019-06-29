import React from 'react'
import { NigamonIcon } from '../common/nigamon-icon'

export class SearchBox extends React.Component {
    render() {
        return (
            <form
                className="form-inline md-form form-sm my-2"
                onSubmit={(e) => {
                    e.preventDefault()
                    this.props.onSearchSubmit(e.target.value)
                }}
            >
                <NigamonIcon name="search" />
                <input
                    className="form-control form-control-sm ml-3 w-75 font-weight-normal text-dark rounded-0"
                    type="text"
                    placeholder="Tim kiem"
                    value={this.props.value}
                    onChange={(e) => {
                        e.preventDefault()
                        this.props.onSearchChange(e.target.value)
                    }}
                />
            </form>
        )
    }
}