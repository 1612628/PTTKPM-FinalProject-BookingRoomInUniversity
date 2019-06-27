import React from 'react'
import { DatePicker } from './datepicker'
import { DateTimePicker } from './datetimepicker'
import { formatDate, formatDateTime, formatTime } from '../../libs/datetime'
import { TimePicker } from './timepicker';
import { Image } from './image';

export class DataForm extends React.Component {
    constructor(props) {
        super(props)

        this.ref = React.createRef()
    }

    componentWillReceiveProps(nextProps) {
        $(this.ref).validate(nextProps.rules)
        console.log('form valid', $(this.ref).valid())
    }

    render() {
        return (
            <form ref={ref => this.ref = ref}>
                {this.props.children}
            </form>
        )
    }
}

export class FormInput extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }

    componentWillReceiveProps(nextProps) {
        this.ref.value = nextProps.value
    }

    render() {
        return (
            <div className="form-group row align-items-center">
                <label className="col-md-4 control-label font-weight-bold">{this.props.label}</label>
                <div className="col-md-8 position-relative input-group">
                    <input
                        ref={ref => this.ref = ref}
                        name={this.props.name}
                        type={this.props.type || "text"} placeholder={this.props.placeholder || ''}
                        className="form-control input-md rounded-0"
                        readOnly={this.props.disabled}
                        defaultValue={this.props.value}
                        onChange={(e) => {
                            e.preventDefault()
                            this.props.onChange(e.target.value)
                        }}
                    />
                </div>
            </div>
        )
    }
}

export class FormImageInput extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }

    componentWillReceiveProps(nextProps) {
        this.ref.value = nextProps.value
    }

    render() {
        return (
            <div className="form-group row align-items-start">
                <label className="col-md-4 mt-3 control-label font-weight-bold">{this.props.label}</label>
                <div className="col-md-8 position-relative input-group">
                    <input
                        ref={ref => this.ref = ref}
                        name={this.props.name}
                        type="text" placeholder={this.props.placeholder || ''}
                        className="form-control input-md rounded-0"
                        readOnly={this.props.disabled}
                        defaultValue={this.props.value}
                        onChange={(e) => {
                            e.preventDefault()
                            this.props.onChange(e.target.value)
                        }}
                    />
                    <div className='d-flex justify-content-center'>
                        <img
                            className='mt-2 w-50'
                            style={{ display: 'block' }}
                            src={this.props.value}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export class FormTextArea extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }

    componentWillReceiveProps(nextProps) {
        this.ref.value = nextProps.value
    }

    render() {
        return (
            <div className="form-group row align-items-center">
                <label className="col-md-4 control-label font-weight-bold">{this.props.label}</label>
                <div className="col-md-8 position-relative input-group">
                    <textarea
                        className="form-control rounded-0"
                        defaultValue={this.props.value}
                        readOnly={this.props.disabled}
                        ref={ref => this.ref = ref}
                        name={this.props.name}
                        rows={6}
                        placeholder={this.props.placeholder || ''}
                        onChange={(e) => {
                            e.preventDefault()
                            this.props.onChange(e.target.value)
                        }}
                    />
                </div>
            </div>
        )
    }
}

export class FormSelect extends React.Component {
    render() {
        return (
            <div className="form-group row align-items-center">
                <label className="col-md-4 control-label font-weight-bold">{this.props.label}</label>
                <div className="col-md-8">
                    <select
                        className="form-control rounded-0 pl-2"
                        disabled={this.props.disabled}
                        value={this.props.value}
                        onChange={(e) => {
                            this.props.onChange(e.target.value)
                        }}
                    >
                        {this.props.options.map(opt => {
                            return (
                                <option
                                    key={opt.id}
                                    value={opt.id}
                                >
                                    {opt.label}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
        )
    }
}

export class FormDatePicker extends React.Component {
    render() {
        return (
            <div className="form-group row align-items-center">
                <label className="col-md-4 control-label font-weight-bold">{this.props.label}</label>
                <div className="col-md-8 position-relative input-group">
                    {this.props.disabled ?
                        <input
                            name={this.props.name}
                            type="text"
                            className="form-control input-md rounded-0"
                            readOnly={true}
                            value={this.props.value && formatDate(this.props.value)}
                        />
                        :
                        <DatePicker
                            min={() => this.props.min()}
                            max={() => this.props.max()}
                            value={this.props.value}
                            width={this.props.width}
                            onChange={this.props.onChange}
                        />
                    }
                </div>
            </div>
        )
    }
}

export class FormTimePicker extends React.Component {
    render() {
        return (
            <div className="form-group row align-items-center">
                <label className="col-md-4 control-label font-weight-bold">{this.props.label}</label>
                <div className="col-md-8 position-relative input-group">
                    {this.props.disabled ?
                        <input
                            type="text"
                            className="form-control input-md rounded-0"
                            readOnly={true}
                            value={formatTime(this.props.value)}
                        />
                        :
                        <TimePicker
                            value={this.props.value}
                            width={this.props.width}
                            onChange={this.props.onChange}
                        />
                    }
                </div>
            </div>
        )
    }
}

export class FormDateTimePicker extends React.Component {
    render() {
        return (
            <div className="form-group row align-items-center">
                <label className="col-md-4 control-label font-weight-bold">{this.props.label}</label>
                <div className="col-md-8 position-relative input-group">
                    {this.props.disabled ?
                        <input
                            type="text"
                            className="form-control input-md rounded-0"
                            readOnly={true}
                            value={this.props.value && formatDateTime(this.props.value)}
                        />
                        :
                        <DateTimePicker
                            min={() => this.props.min()}
                            max={() => this.props.max()}
                            value={this.props.value}
                            width={this.props.width}
                            onChange={this.props.onChange}
                        />
                    }
                </div>
            </div>
        )
    }
}