import React from 'react'
import { connect } from 'react-redux'
import { StaticListContainer } from '../common/list-container'
import { NigamonIcon } from '../common/nigamon-icon'
import { ClickableTableCells, InlineClickableView } from '../common/clickable-view'
import { formatMoney } from '../../libs/money'
import { formatDate, formatTime, parseTime, equalTime } from '../../libs/datetime'
import { Button } from '../common/button'
import { RemoteLoader } from '../common/remote-loader';
import { FormInput, FormSelect, FormDatePicker } from '../common/form'
import { buildErrorTooltip } from '../common/error-tooltip';
import { RemoteDataModal, ModalState } from '../common/modal';
import { loadTickets } from '../../stores/tickets/tickets.action';
import { loadRooms, loadLectureTimes } from '../../stores/rooms/rooms.action';
import { loadAdmins } from '../../stores/users/users.action'
import { OrderSeatPicker } from './order-seat-picker';
import { uploadOrderTicket, removeOrderTicket } from '../../stores/orders/orders.action';

const validationRules = {
    errorElement: 'span',
    rules: {
        foodQuantity: {
            required: true,
            digits: true
        }
    },
    messages: {
        foodQuantity: {
            required: buildErrorTooltip("Vui long dien so luong"),
            digits: buildErrorTooltip("So luong phai la so nguyen")
        }
    }
}
const nullItem = {
    theater: null,
    date: null,
    time: null,
    row: null,
    column: null,
    ticket: null,
}
class OrderTicketList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            modalState: null,
            newItem: {
                ...nullItem
            }
        }
        this.newForm = React.createRef()

        this.renderList = this.renderList.bind(this)
        this.renderModalBody = this.renderModalBody.bind(this)
        this.renderEditForm = this.renderEditForm.bind(this)
        this.renderInfoForm = this.renderInfoForm.bind(this)
    }

    componentWillMount() {
        if (!this.props.tickets.isLoading && this.props.tickets.isFailed) {
            this.props.loadAvailableTickets()
        }
        if (!this.props.theaters.isLoading && this.props.theaters.isFailed) {
            this.props.loadAvailableTheaters()
        }
    }

    validate(cb) {
        return (txt) => {
            $(this.newForm).validate(validationRules)
            $(this.newForm).valid()
            cb(txt)
        }
    }

    renderList() {
        let header = (
            <tr>
                <td>Rap</td>
                <td className="text-center">Ngay</td>
                <td className='text-center'>Gio</td>
                <td className='text-center'>So ghe</td>
                <td className="text-right">Tong cong</td>
            </tr>
        )
        let tickets = this.props.tickets.data
        let theaters = this.props.theaters.data
        return (
            <React.Fragment>
                <StaticListContainer
                    className={this.props.disabled ? 'my-5' : 'mt-5 mb-3'}
                    minHeight={200}
                    title="Ve phim"
                    header={header}
                    items={this.props.items}
                    pageSize={5}
                    renderItem={item => {
                        let ticket = tickets.filter(c => c.id === item.ticket)[0]
                        let theater = theaters.filter(c => c.id === item.theater)[0]
                        return (
                            <tr>
                                <ClickableTableCells onClick={() => {
                                    let theater = this.props.theaters.data.find(t => t.id === item.theater)
                                    let date = item.date
                                    this.props.loadShowTimes(theater, date)
                                    this.setState({
                                        newItem: item,
                                        modalState: this.props.disabled ? ModalState.INFO_NO_EDIT : ModalState.INFO,
                                        modalOpen: true
                                    })
                                }}>
                                    <div>{theater.name}</div>
                                    <div className="text-center">{formatDate(item.date)}</div>
                                    <div className="text-center">{formatTime(item.time)}</div>
                                    <div className="text-center">{`${item.row}-${item.column}`}</div>
                                    <div className="text-right">{formatMoney(ticket.price) + ' VND'}</div>
                                </ClickableTableCells>
                                {this.props.disabled ? null :
                                    <td className="text-right">
                                        <InlineClickableView onClick={() => {
                                            let theater = this.props.theaters.data.find(t => t.id === item.theater)
                                            let date = item.date
                                            this.props.loadShowTimes(theater, date)
                                            this.setState({
                                                newItem: item,
                                                modalState: ModalState.EDIT,
                                                modalOpen: true
                                            })
                                        }}>
                                            <NigamonIcon name='cog' />
                                        </InlineClickableView>
                                        /
                                    <InlineClickableView onClick={() => {
                                            let theater = this.props.theaters.data.find(t => t.id === item.theater)
                                            let date = item.date
                                            this.props.loadShowTimes(theater, date)
                                            this.setState({
                                                newItem: item,
                                                modalState: ModalState.REMOVE,
                                                modalOpen: true
                                            })
                                        }}>
                                            <NigamonIcon name='times' />
                                        </InlineClickableView>
                                    </td>}
                            </tr>
                        )
                    }}
                />
                {this.props.disabled ? null :
                    <div className='d-flex justify-content-center mb-5'>
                        <Button active={true}
                            label="Them ve phim"
                            onClick={() => {
                                let theater = this.props.theaters.data[0]
                                let date = new Date()
                                this.props.loadShowTimes(theater, date)
                                this.setState({
                                    newItem: { ...nullItem, theater: theater.id, date: date },
                                    modalState: ModalState.NEW,
                                    modalOpen: true
                                })
                            }}
                        />
                    </div>}

                <RemoteDataModal
                    nestedModal={true}
                    initialState={this.state.modalState}
                    show={this.state.modalOpen}
                    onHide={() => {
                        this.state.modalOpen = false
                        this.setState({
                            modalState: null
                        })
                    }}
                    body={this.renderModalBody}
                    onStateChange={s => this.setState({ modalState: s })}
                />
            </React.Fragment>
        )
    }

    renderEditForm(addNew) {
        let theaters = this.props.theaters.data.map(f => ({ id: f.id, label: f.name }))
        let { newItem } = this.state
        if (!newItem.theater) {
            this.state.newItem.theater = theaters[0].id
        }
        let showTimes = this.props.showTimes
        return (
            <form ref={ref => this.newForm = ref}>
                <FormSelect label='Rap' disabled={false} value={addNew ? theaters[0].id : newItem.id} options={theaters}
                    onChange={id => {
                        let newTheater = this.props.theaters.data.find(t => t.id === parseInt(id, 10))
                        this.props.loadShowTimes(newTheater, newItem.date)
                        this.setState({ newItem: { ...newItem, theater: parseInt(id, 10), row: null, column: null } })
                    }}
                />
                <FormDatePicker label='Ngay' disabled={false} value={newItem.date}
                    min={() => null} max={() => null}
                    onChange={this.validate((date) => {
                        let newTheater = this.props.theaters.data.find(t => t.id === newItem.theater)
                        this.props.loadShowTimes(newTheater, date)
                        this.setState({ newItem: { ...newItem, date: date, row: null, column: null } })
                    })} />
                <RemoteLoader
                    isLoading={showTimes.isLoading}
                    isFailed={showTimes.isFailed}
                    renderOnSuccess={() => {
                        let choices = showTimes.data.map(c => ({ id: formatTime(c.time), label: formatTime(c.time) }))
                        let itemShowTime = newItem.time ? showTimes.data.find(c => equalTime(c.time, newItem.time)) : showTimes.data[0]
                        let itemSeat = (newItem.row && newItem.column) ? [newItem.row, newItem.column] : null
                        let theater = this.props.theaters.data.find(t => t.id === newItem.theater)
                        return (
                            <React.Fragment>
                                <FormSelect
                                    label='Suat chieu' disabled={false}
                                    value={!newItem.time ? (choices[0] && choices[0].id) : formatTime(newItem.time)} options={choices}
                                    onChange={time => {
                                        this.setState({ newItem: { ...newItem, time: parseTime(time), row: null, column: null } })
                                    }}
                                />
                                {itemShowTime ?
                                    <OrderSeatPicker
                                        width='100%' height={400}
                                        row={theater.row} column={theater.column}
                                        current={itemSeat}
                                        chosen={itemShowTime.ordered}
                                        onChange={current => {
                                            this.setState({ newItem: { ...newItem, row: current[0], column: current[1] } })
                                        }}
                                    /> : null}
                            </React.Fragment>
                        )
                    }}
                    renderOnFailed={() => showTimes.error}
                />
            </form>
        )
    }

    renderInfoForm(remove) {
        let theaters = this.props.theaters.data.map(f => ({ id: f.id, label: f.name }))
        let { newItem } = this.state
        let showTimes = this.props.showTimes
        return (
            <form ref={ref => this.newForm = ref}>
                <FormSelect label='Rap' disabled={true} value={newItem.id} options={theaters} />
                <FormDatePicker label='Ngay' disabled={true} value={newItem.date} />
                <RemoteLoader
                    isLoading={showTimes.isLoading}
                    isFailed={showTimes.isFailed}
                    renderOnSuccess={() => {
                        let choices = showTimes.data.map(c => ({ id: formatTime(c.time), label: formatTime(c.time) }))
                        let itemShowTime = showTimes.data.find(c => equalTime(c.time, newItem.time))
                        let itemSeat = [newItem.row, newItem.column]
                        let theater = this.props.theaters.data.find(t => t.id === newItem.theater)
                        return (
                            <React.Fragment>
                                <FormSelect
                                    label='Suat chieu' disabled={true}
                                    value={!formatTime(newItem.time)} options={choices}
                                />
                                {itemShowTime ?
                                    <OrderSeatPicker
                                        disabled={true}
                                        width='100%' height={400}
                                        row={theater.row} column={theater.column}
                                        current={itemSeat}
                                        chosen={itemShowTime.ordered}
                                    /> : null}
                            </React.Fragment>
                        )
                    }}
                    renderOnFailed={() => showTimes.error}
                />
            </form>
        )
    }

    renderModalBody() {
        switch (this.state.modalState) {
            case ModalState.NEW:
                return this.renderEditForm(true)
            case ModalState.EDIT:
                return this.renderEditForm()
            case ModalState.INFO_NO_EDIT:
            case ModalState.INFO:
                return this.renderInfoForm(false)
            case ModalState.REMOVE:
                return this.renderInfoForm(true)
            default:
                return null
        }
    }

    render() {
        return (
            <RemoteLoader
                isLoading={this.props.tickets.isLoading}
                isFailed={this.props.tickets.isFailed}
                renderOnSuccess={this.renderList}
                renderOnFailed={() => this.props.tickets.error}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        tickets: state.tickets.tickets,
        theaters: state.theaters.theaters,
        showTimes: state.theaters.showTimes,
        movies: state.movies.movies
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadAvailableMovies: () => dispatch(loadAdmins(0)),
        loadAvailableTickets: () => dispatch(loadTickets(0)),
        loadAvailableTheaters: () => dispatch(loadRooms(0)),
        loadShowTimes: (theater, date) => dispatch(loadLectureTimes(theater, date)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderTicketList)