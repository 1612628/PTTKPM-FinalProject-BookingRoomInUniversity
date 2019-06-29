import React from 'react'
import { formatDateTime, equalDateTime, parseDateTime } from '../../libs/datetime'

export class DateTimePicker extends React.Component {
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
        this.picker = $(this.ref).datetimepicker({
            modal: true,
            format: 'HH:MM dd-mm-yy',
            width: this.props.width,
            footer: true,
            datepicker: {
                minDate: this.props.min,
                maxDate: this.props.max,
            },
            value: this.props.value ? formatDateTime(this.props.value) : null,
            change: () => {
                let date = parseDateTime(this.picker.value())
                if (!this.props.value || !equalDateTime(date, this.props.value)) {
                    this.props.onChange(date)
                }
            }
        })
    }

    componentWillReceiveProps(props) {
        this.picker.value(props.value ? formatDateTime(props.value) : null)
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