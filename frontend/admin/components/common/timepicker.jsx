import React from 'react'
import { formatDateTime, equalTime, parseTime, formatTime } from '../../libs/datetime'

export class TimePicker extends React.Component {
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
        this.picker = $(this.ref).timepicker({
            modal: true,
            format: 'HH:MM',
            width: this.props.width,
            footer: true,
            mode: '24hr',
            value: this.props.value ? formatTime(this.props.value) : null,
            change: () => {
                let date = parseTime(this.picker.value())
                if (!this.props.value || !equalTime(date, this.props.value)) {
                    this.props.onChange(date)
                }
            }
        })
    }

    componentWillReceiveProps(props) {
        // this.picker.value(props.value ? formatTime(props.value) : null)
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