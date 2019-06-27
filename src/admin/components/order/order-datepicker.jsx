import React from 'react'
import { Button } from '../common/button'
import { DatePicker } from '../common/datepicker'
import { toStartOfDay, toEndOfDay } from '../../libs/datetime'

const TimeStamp = {
    TODAY: 'TODAY',
    THIS_WEEK: 'THIS_WEEK',
    LAST_WEEK: 'LAST_WEEK'
}

export class OrderDatePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            start: this.props.start,
            end: this.props.end,
            active: null
        }

        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.renderButtons = this.renderButtons.bind(this)
    }

    handleButtonClick(timestamp) {
        if (timestamp === this.state.active) {
            this.setState({
                active: null,
                start: null,
                end: null
            })
            this.props.onChange(null, null)
            return
        }

        this.setState({ active: timestamp })
        let start, end
        switch (timestamp) {
            case TimeStamp.TODAY: {
                start = new Date()
                end = new Date()
            } break
            case TimeStamp.THIS_WEEK: {
                start = new Date();
                end = new Date();
                while (start.getDay() !== 0) {
                    start.setDate(start.getDate() - 1);
                }
            } break
            case TimeStamp.LAST_WEEK: {
                start = new Date();
                end = new Date();

                while (start.getDay() !== 0) {
                    start.setDate(start.getDate() - 1);
                }
                end.setDate(start.getDate())
                start.setDate(start.getDate() - 1);
                while (start.getDay() !== 0) {
                    start.setDate(start.getDate() - 1);
                }

                while (end.getDay() !== 6) {
                    end.setDate(end.getDate() - 1);
                }
            } break
        }

        start = toStartOfDay(start)
        end = toEndOfDay(end)
        this.setState({
            start: start,
            end: end
        })
        this.props.onChange(start, end)
    }

    renderStartInput() {
        return (
            <div className='col-md-4 px-0 my-3 mr-5'>
                Tu
            <DatePicker
                    min={new Date('2000/01/01')}
                    max={() => this.state.end ? this.state.end : new Date()}
                    value={this.state.start}
                    width={120}
                    onChange={(d) => {
                        this.setState({ start: d })
                        this.props.onChange(this.state.start, this.state.end)
                    }}
                />
            </div>
        )
    }

    renderEndInput() {
        return (
            <div className='col-md-4 px-0 my-3'>
                den
            <DatePicker
                    min={() => this.state.start}
                    max={new Date()}
                    value={this.state.end}
                    width={120}
                    onChange={(d) => {
                        this.setState({ end: d })
                        this.props.onChange(this.state.start, this.state.end)
                    }}
                />
            </div>
        )
    }

    renderButtons() {
        let className = 'ml-0 mr-1 my-1 px-4'
        return (
            <React.Fragment>
                <Button
                    label='Hom nay'
                    className={className}
                    active={this.state.active === TimeStamp.TODAY}
                    onClick={() => this.handleButtonClick(TimeStamp.TODAY)}
                />
                <Button
                    label='Tuan nay'
                    className={className}
                    active={this.state.active === TimeStamp.THIS_WEEK}
                    onClick={() => this.handleButtonClick(TimeStamp.THIS_WEEK)}
                />
                <Button
                    label='Tuan truoc'
                    className={className}
                    active={this.state.active === TimeStamp.LAST_WEEK}
                    onClick={() => this.handleButtonClick(TimeStamp.LAST_WEEK)}
                />
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className={`${this.props.className} h6 font-weight-bold row m-0 p-0 align-items-center justify-content-start`}>
                <div className="row mx-0">
                    {this.renderStartInput()}
                    {this.renderEndInput()}
                </div>
                <div className="mx-0">
                    {this.renderButtons()}
                </div>
            </div>
        )
    }
}