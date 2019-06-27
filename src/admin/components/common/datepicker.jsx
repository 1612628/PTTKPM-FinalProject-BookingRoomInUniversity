import React from 'react'
import { parseDate, formatDate, equalDate } from '../../libs/datetime'

export class DatePicker extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.picker = null
        this.initPicker = this.initPicker.bind(this)
    }

    initPicker() {
        if (this.picker) {
            this.picker.destroy()
        }
        this.picker = $(this.ref).datepicker({
            format: 'dd-mm-yy',
            width: this.props.width,
            minDate: this.props.min,
            maxDate: this.props.max,
            value: this.props.value ? formatDate(this.props.value) : null,
            change: () => {
                let date = parseDate(this.picker.value(), true)
                if (!this.props.value || !equalDate(date, this.props.value)) {
                    this.props.onChange(date)
                }
            }
        })
    }

    componentWillReceiveProps(props) {
        this.picker.value(props.value ? formatDate(props.value) : null)
    }

    componentDidMount() {
        this.initPicker()
    }

    render() {
        return (
            <input
                ref={ref => this.ref = ref}
                className={this.props.className}
            />
        )
    }
}