import React from 'react'
import { Dropdown } from '../common/dropdown'
import { formatMoney } from '../../libs/money'

export class OrderPriceRangePicker extends React.Component {
    constructor(props) {
        super(props)

        let choices = []
        let id = 1
        for (let i = props.min; i <= props.max; i += props.step) {
            choices.push({
                label: formatMoney(i) + ' VND',
                value: i,
                id: id
            })
            id++
        }
        this.state = {
            start: null,
            end: null,
            choices: [...choices],
            startChoices: [...choices],
            endChoices: [...choices]
        }

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    handleStartChange(start) {
        let choices = start ? this.state.choices.filter(c => c.value >= start) : [...this.state.choices]
        this.setState({ start: start, endChoices: choices })
        this.props.onChange(start, this.state.end)
    }
    handleEndChange(end) {
        let choices = end ? this.state.choices.filter(c => c.value <= end) : [...this.state.choices]
        this.setState({ end: end, startChoices: choices })
        this.props.onChange(this.state.start, end)
    }

    render() {
        return (
            <React.Fragment>
                <Dropdown
                    title='Tu'
                    className='col-lg-6 mt-2'
                    padding='px-3'
                    defaultLabel='---------------- VND'
                    onDefaultClick={() => this.handleStartChange(null)}
                    choices={this.state.startChoices}
                    onChoiceClick={(c) => this.handleStartChange(c.value)}
                />
                <Dropdown
                    title='den'
                    className='col-lg-6 mt-2'
                    padding='px-3'
                    defaultLabel='---------------- VND'
                    onDefaultClick={() => this.handleEndChange(null)}
                    choices={this.state.endChoices}
                    onChoiceClick={(c) => this.handleEndChange(c.value)}
                />
            </React.Fragment>
        )
    }
}