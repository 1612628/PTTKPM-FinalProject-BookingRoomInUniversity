import React from 'react'
import { formatTime, toWeekDay, formatDate } from '../../libs/datetime'

export class CurrentDateTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date()
        }

        this.interval = setInterval(() => this.setState({ date: new Date() }), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        let date = this.state.date
        return (
            <div className="d-flex justify-content-around align-items-center">
                <p className="h4 my-0 font-weight-bold">{formatTime(date)}</p>
                <div className="flex-items-divider"></div>
                <div className="d-flex flex-column align-items-center my-0">
                    <p className="h6 mb-2">{toWeekDay(date)}</p>
                    <p className="h6 mb-0">{formatDate(date)}</p>
                </div>
            </div>
        )
    }
}