import React from 'react'
import { connect } from 'react-redux'
import BaseAdminScreen from './base-admin-screen'
import { FullHeader } from '../components/header/full-header'
import { routes } from '../routes';
import { RemoteDataListContainer } from '../components/common/remote-data-list-container'
import { RemoteDropdown, Dropdown } from '../components/common/dropdown';
import { loadTheaterChoices } from '../stores/dashboard/dashboard.action'
import { loadContent, loadOrders, uploadOrder, removeOrder } from '../stores/orders/orders.action'
import { loadDevices } from '../stores/devices/devices.action'
import { loadTickets } from '../stores/tickets/tickets.action'
import { loadRooms } from '../stores/rooms/rooms.action'
import { InlineClickableView, ClickableTableCells } from '../components/common/clickable-view';
import { NigamonIcon } from '../components/common/nigamon-icon';

import { RemoteDataModal, ModalState, Modal } from '../components/common/modal';
import { FloatingButton } from '../components/common/floating-button';
import { FormInput, FormSelect, FormDateTimePicker } from '../components/common/form';
import { formatDate, formatTime } from '../libs/datetime'
import { formatMoney } from '../libs/money'
import { buildErrorTooltip } from '../components/common/error-tooltip';
import { OrderDatePicker } from '../components/order/order-datepicker';
import { OrderPriceRangePicker } from '../components/order/order-price-range-picker';
import OrderFoodList from '../components/order/order-food-list';
import OrderTicketList from '../components/order/order-ticket-list';

const MIN_INTERVAL = 500

const validationRules = {
    errorElement: 'span',
    rules: {
        orderId: {
            required: true,
            digits: true
        },
        orderUsername: "required",
        orderDatetime: "required",
        orderTotal: "required"
    },
    messages: {
        orderId: {
            required: buildErrorTooltip("Vui long dien ma don hang"),
            digits: buildErrorTooltip("Ma don hang phai la so nguyen")
        },
        orderUsername: buildErrorTooltip("Vui long dien ten khach hang"),
        orderDatetime: buildErrorTooltip("Vui long dien thoi gian"),
        orderTotal: buildErrorTooltip("Gio hang khong duoc rong")
    }
}
const nullItem = {
    id: null,
    username: null,
    datetime: null,
    theater: null,
    tickets: [],
    foods: [],
    status: null,
}
class OrderScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            status: 0,
            dateStart: null,
            dateEnd: null,
            moneyStart: null,
            moneyEnd: null,
            searchText: '',
            lastUpdate: new Date(),
            modalOpen: false,
            modalState: null,
            formErrors: null,
            newItem: {
                ...nullItem
            }
        }
        this.updateTimeout = null
        this.newForm = React.createRef()

        this.customSetState = this.customSetState.bind(this)

        this.renderHeader = this.renderHeader.bind(this)
        this.renderContent = this.renderContent.bind(this)
        this.renderFloatingButton = this.renderFloatingButton.bind(this)
        this.renderModals = this.renderModals.bind(this)
        this.renderEditForm = this.renderEditForm.bind(this)
        this.renderInfoForm = this.renderInfoForm.bind(this)
        this.renderModalBody = this.renderModalBody.bind(this)

        this.renderFilters = this.renderFilters.bind(this)
        this.renderMoviesSection = this.renderOrdersSection.bind(this)
        this.openModal = this.openModal.bind(this)

        this.handleStatusChoice = this.handleStatusChoice.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
        this.handlePageRequest = this.handlePageRequest.bind(this)
    }

    validate(cb) {
        return (txt) => {
            $(this.newForm).validate(validationRules);
            $(this.newForm).valid()
            cb(txt)
        }
    }

    validateFormWithRules(formRef, rules, cb) {
        return (txt) => {
            $(formRef).validate(rules);
            $(formRef).valid()
            cb(txt)
        }
    }

    openModal(initialState) {
        this.setState({ modalState: initialState, modalOpen: true })
    }

    customSetState(nextState) {
        this.setState({ ...nextState, lastUpdate: new Date() })
    }

    handleStatusChoice(status) {
        this.customSetState({ status: status })
        this.props.loadOrders(this.state.page, {
            dateStart: this.state.dateStart,
            dateEnd: this.state.dateEnd,
            moneyStart: this.state.moneyStart,
            moneyEnd: this.state.moneyEnd,
            status: status,
            searchText: this.state.searchText
        })
    }
    handleSearchChange(txt) {
        this.setState({ searchText: txt })
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout)
            this.updateTimeout = null
        }
        this.updateTimeout = setTimeout(() => {
            this.props.loadOrders(this.state.page, {
                dateStart: this.state.dateStart,
                dateEnd: this.state.dateEnd,
                moneyStart: this.state.moneyStart,
                moneyEnd: this.state.moneyEnd,
                status: this.state.status,
                searchText: txt
            })
        }, MIN_INTERVAL)
    }
    handleSearchSubmit(txt) {
        this.customSetState({ searchText: txt })
        this.props.loadOrders(this.state.page, {
            dateStart: this.state.dateStart,
            dateEnd: this.state.dateEnd,
            moneyStart: this.state.moneyStart,
            moneyEnd: this.state.moneyEnd,
            status: this.state.status,
            searchText: txt
        })

    }
    handlePageRequest(page) {
        this.customSetState({ page: page })
        this.props.loadOrders(page, {
            dateStart: this.state.dateStart,
            dateEnd: this.state.dateEnd,
            moneyStart: this.state.moneyStart,
            moneyEnd: this.state.moneyEnd,
            status: this.state.status,
            searchText: this.state.searchText
        })
    }
    handleDateChange(s, e) {
        this.customSetState({ dateStart: s, dateEnd: e })
        this.props.loadOrders(this.state.page, {
            dateStart: s,
            dateEnd: e,
            moneyStart: this.state.moneyStart,
            moneyEnd: this.state.moneyEnd,
            status: this.state.status,
            searchText: this.state.searchText
        })
    }
    handleMoneyChange(s, e) {
        this.customSetState({ moneyStart: s, moneyEnd: e })
        this.props.loadOrders(this.state.page, {
            dateStart: this.state.dateStart,
            dateEnd: this.state.dateEnd,
            moneyStart: s,
            moneyEnd: e,
            status: this.state.status,
            searchText: this.state.searchText
        })
    }

    isDependenciesLoadFailed() {
        let { statusChoices, theaterChoices, foods, theaters, tickets } = this.props
        let failedStatus = statusChoices.data === null || (statusChoices.error !== null && statusChoices.error !== undefined)
        let failedTheaterChoices = theaterChoices.data === null || (theaterChoices.error !== null && theaterChoices.error !== undefined)
        let failedTheater = theaters.data === null || (theaters.error !== null && theaters.error !== undefined)
        let failedFood = foods.data === null || (foods.error !== null && foods.error !== undefined)
        let failedTicket = tickets.data === null || (tickets.error !== null && tickets.error !== undefined)
        return failedStatus
            || failedTheaterChoices
            || failedTheater
            || failedFood
            || failedTicket
    }
    isDependenciesLoading() {
        return this.props.statusChoices.isLoading
            || this.props.theaterChoices.isLoading
            || this.props.theaters.isLoading || this.props.theaters.currentPage !== 0
            || this.props.foods.isLoading || this.props.foods.currentPage !== 0
            || this.props.tickets.isLoading || this.props.tickets.currentPage !== 0
    }

    renderHeader() {
        return (
            <FullHeader title='Don hang'
                onSearchChange={this.handleSearchChange}
                onSearchSubmit={this.handleSearchSubmit}
            />
        )
    }

    renderContent() {
        return (
            <React.Fragment>
                {this.renderFilters()}
                {this.renderOrdersSection()}
                {this.renderFloatingButton()}
                {this.renderModals()}
            </React.Fragment>
        )
    }

    renderFilters() {
        return (
            <div className="row my-5 mx-0 align-items-center">
                <OrderDatePicker
                    className='col-lg-4'
                    start={null}
                    end={null}
                    onChange={(s, e) => this.handleDateChange(s, e)}
                />
                <div className="col-lg-7 ml-auto px-0 align-items-center">
                    <div className="row mx-0">
                        <RemoteDropdown
                            className='col-lg-5 my-3'
                            padding='px-5'
                            defaultLabel='Tinh trang'
                            onDefaultClick={() => this.handleStatusChoice(0)}
                            data={this.props.statusChoices}
                            onChoiceClick={(c) => this.handleStatusChoice(c.id)}
                        />
                    </div>
                    <div className="row h6 m-0">
                        <OrderPriceRangePicker
                            className='mt-2'
                            min={0}
                            max={1000000}
                            step={100000}
                            onChange={(s, e) => this.handleMoneyChange(s, e)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderOrdersSection() {
        let { orders } = this.props
        let header = (
            <tr>
                <td className="text-center">Ma don</td>
                <td>Nguoi dung</td>
                <td className="text-center">Ngay</td>
                <td className="text-center">Gio</td>
                <td className="text-right">Tong tien</td>
                <td className="text-center">Tinh trang</td>
            </tr>
        )
        return (
            <RemoteDataListContainer
                otherFailConditions={() => this.isDependenciesLoadFailed()}
                notRenderUntil={() => !this.isDependenciesLoading()}
                remoteData={orders}
                title='Don hang'
                header={header}
                renderItem={(item) => {
                    let status = this.props.statusChoices.data.filter(c => c.id === item.status)[0]
                    let textColor = 'text-success'
                    if (status.id === 2) {
                        textColor = 'text-warning'
                    } else if (status.id === 3) {
                        textColor = 'text-danger'
                    }
                    let totalFoods = item.foods.map(c => this.props.foods.data.find(v => v.id === c.id).price * c.quantity)
                        .reduce((prev, cur) => prev + cur, 0)
                    let totalTickets = item.tickets.map(c => this.props.tickets.data.find(v => v.id === c.ticket).price)
                        .reduce((prev, cur) => prev + cur, 0)
                    return (
                        <tr>
                            <ClickableTableCells onClick={() => {
                                this.setState({ newItem: item })
                                this.openModal(ModalState.INFO)
                            }}>
                                <div className="text-center">{item.id}</div>
                                <div>{item.username}</div>
                                <div className="text-center">{formatDate(item.datetime)}</div>
                                <div className="text-center">{formatTime(item.datetime)}</div>
                                <div className="text-right">{formatMoney(totalFoods + totalTickets) + ' VND'}</div>
                                <div className={`text-center ${textColor}`}>{status.label}</div>
                            </ClickableTableCells>
                            <td className="text-right">
                                <InlineClickableView onClick={() => {
                                    this.setState({ newItem: item })
                                    this.openModal(ModalState.EDIT)
                                }}>
                                    <NigamonIcon name='cog' />
                                </InlineClickableView>
                            </td>
                        </tr>
                    )
                }}
                onRequestPage={this.handlePageRequest}
            />
        )
    }

    renderFloatingButton() {
        return null
        if (this.isDependenciesLoadFailed()
            || this.props.statusChoices.data.length === 0
            || this.props.theaterChoices.data.length === 0
            || this.props.theaters.data.length === 0
            || this.props.foods.data.length === 0
            || this.props.tickets.data.length === 0) {
            return null
        }
        return (
            <FloatingButton
                onClick={() => {
                    this.setState({ newItem: { ...nullItem } })
                    this.openModal(ModalState.NEW)
                }}
                iconName='plus'
            />
        )
    }

    renderModalBody() {
        switch (this.state.modalState) {
            case ModalState.NEW:
                return this.renderEditForm(true)
            case ModalState.EDIT:
                return this.renderEditForm()
            case ModalState.INFO:
                return this.renderInfoForm(false)
            case ModalState.REMOVE:
                return this.renderInfoForm(true)
            default:
                return null
        }
    }

    renderEditForm(addNew) {
        let status = this.props.statusChoices.data
        let { newItem } = this.state
        if (!newItem.status) {
            this.state.newItem.status = status[0].id
        }
        let totalFoods = addNew ? 0 : newItem.foods.map(c => this.props.foods.data.find(v => v.id === c.id).price * c.quantity)
            .reduce((prev, cur) => prev + cur, 0)
        let totalTickets = addNew ? 0 : newItem.tickets.map(c => this.props.tickets.data.find(v => v.id === c.ticket).price)
            .reduce((prev, cur) => prev + cur, 0)
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma don hang' disabled={!addNew} value={newItem.id}
                    name='orderId'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, id: text } })
                    })} />
                <FormInput label='Nguoi dung' disabled={!addNew} value={newItem.username}
                    name='orderUsername'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, username: text } })
                    })} />
                <FormDateTimePicker label='Thoi gian' disabled={false} value={this.state.newItem.datetime}
                    width={300}
                    min={() => new Date('2000/01/01')}
                    max={() => new Date()}
                    onChange={(date) => this.setState({ newItem: { ...newItem, datetime: date } })} />

                {addNew ? null : <OrderTicketList items={newItem.tickets} disabled={true} />}
                {addNew ? null : <OrderFoodList items={newItem.foods} disabled={true} />}

                {addNew ? null : <FormInput label='Tong cong' disabled={true} value={formatMoney(totalFoods + totalTickets) + ' VND'} />}
                <FormSelect label='Tinh trang' disabled={false} value={!newItem.status ? status[0].id : newItem.status} options={status}
                    onChange={status => this.setState({ newItem: { ...newItem, status: status } })}
                />
            </form>
        )
    }

    renderInfoForm(remove) {
        let status = this.props.statusChoices.data
        let { newItem } = this.state
        let totalFoods = newItem.foods.map(c => this.props.foods.data.find(v => v.id === c.id).price * c.quantity)
            .reduce((prev, cur) => prev + cur, 0)
        let totalTickets = newItem.tickets.map(c => this.props.tickets.data.find(v => v.id === c.ticket).price)
            .reduce((prev, cur) => prev + cur, 0)
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma don hang' disabled={true} value={newItem.id} />
                <FormInput label='Nguoi dung' disabled={true} value={newItem.username} />
                <FormDateTimePicker label='Thoi gian' disabled={true} value={this.state.newItem.datetime} />

                <OrderTicketList items={newItem.tickets} disabled={true} />
                <OrderFoodList items={newItem.foods} disabled={true} />

                <FormInput label='Tong cong' disabled={true} value={formatMoney(totalFoods + totalTickets) + ' VND'} />
                <FormSelect label='Tinh trang' disabled={true} value={newItem.status} options={status} />
            </form>
        )
    }

    renderModals() {
        return (
            <RemoteDataModal
                large={true}
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
                editCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.uploadOrder(this.state.newItem)
                        this.setState({ modalOpen: false })
                    }
                }}
                newCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.uploadOrder(this.state.newItem, true)
                        this.setState({ modalOpen: false })
                    }
                }}
            />
        )
    }

    render() {
        return (
            <BaseAdminScreen
                pathId={routes.ORDER.id}
                requireLogin={true}
                header={this.renderHeader}
                content={this.renderContent}
                callback={() => {
                    this.props.loadContent()
                    this.props.loadTheaterChoices()
                    this.props.loadAvailableFoods()
                    this.props.loadAvailableTickets()
                    this.props.loadAvailableTheaters()
                }}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        orders: state.orders.orders,
        theaterChoices: state.dashboard.theaterChoices,
        statusChoices: state.orders.statusChoices,
        foods: state.foods.foods,
        tickets: state.tickets.tickets,
        theaters: state.theaters.theaters
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadContent: () => dispatch(loadContent()),
        loadOrders: (page, options) => dispatch(loadOrders(page, options)),
        loadTheaterChoices: () => dispatch(loadTheaterChoices()),
        loadAvailableFoods: () => dispatch(loadDevices(0)),
        loadAvailableTickets: () => dispatch(loadTickets(0)),
        loadAvailableTheaters: () => dispatch(loadRooms(0)),
        uploadOrder: (order, addNew) => dispatch(uploadOrder(order, addNew)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen)