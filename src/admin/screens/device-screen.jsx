import React from 'react'
import { connect } from 'react-redux'
import { loadContent, loadDevices, uploadDevice, removeDevice } from '../stores/devices/devices.action'
import BaseAdminScreen from './base-admin-screen'
import { FullHeader } from '../components/header/full-header'
import { routes } from '../routes';
import { RemoteDataListContainer } from '../components/common/remote-data-list-container'
import { RemoteDropdown, } from '../components/common/dropdown';
import { InlineClickableView, ClickableTableCells } from '../components/common/clickable-view';
import { NigamonIcon } from '../components/common/nigamon-icon';

import { RemoteDataModal, ModalState } from '../components/common/modal';
import { FloatingButton } from '../components/common/floating-button';
import { FormInput, FormSelect, FormDatePicker } from '../components/common/form';
import { buildErrorTooltip } from '../components/common/error-tooltip';
import { formatMoney } from '../libs/money'
import { formatDate } from '../libs/datetime';

const MIN_INTERVAL = 500

const validationRules = {
    errorElement: 'span',
    rules: {
        deviceId: {
            required: true,
            digits: true
        },
        deviceName: "required",
        deviceDate: "required",
        deviceCompany: "required",
        devicePrice: {
            required: true,
            digits: true
        }
    },
    messages: {
        deviceId: {
            required: buildErrorTooltip("Vui long dien ma thiet bi"),
            digits: buildErrorTooltip("Ma thiet bi phai la so nguyen")
        },
        deviceName: buildErrorTooltip("Vui long dien ten thiet bi"),
        deviceDate: buildErrorTooltip("Vui long dien ngay san xuat"),
        deviceCompany: buildErrorTooltip("Vui long dien ten hang san xuat"),
        devicePrice: {
            required: buildErrorTooltip("Vui long dien don gia"),
            digits: buildErrorTooltip("Don gia phai la so nguyen")
        }
    }
}
const nullItem = {
    id: null,
    name: null,
    date: null,
    company: null,
    price: null,
}
class DeviceScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
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
        this.renderDeviceSection = this.renderDeviceSection.bind(this)
        this.openModal = this.openModal.bind(this)

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

    openModal(initialState) {
        this.setState({ modalState: initialState, modalOpen: true })
    }

    customSetState(nextState) {
        this.setState({ ...nextState, lastUpdate: new Date() })
    }

    handleSearchChange(txt) {
        this.setState({ searchText: txt })
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout)
            this.updateTimeout = null
        }
        this.updateTimeout = setTimeout(() => {
            this.props.loadDevices(this.state.page, {
                searchText: txt
            })
        }, MIN_INTERVAL)
    }
    handleSearchSubmit(txt) {
        this.customSetState({ searchText: txt })
        this.props.loadDevices(this.state.page, {
            searchText: txt
        })
    }
    handlePageRequest(page) {
        this.customSetState({ page: page })
        this.props.loadDevices(page, {
            searchText: this.state.searchText
        })
    }

    renderHeader() {
        return (
            <FullHeader title='Thiet bi'
                onSearchChange={this.handleSearchChange}
                onSearchSubmit={this.handleSearchSubmit}
            />
        )
    }

    renderContent() {
        return (
            <React.Fragment>
                {this.renderFilters()}
                {this.renderDeviceSection()}
                {this.renderFloatingButton()}
                {this.renderModals()}
            </React.Fragment>
        )
    }

    renderFilters() {
        return null
    }

    renderDeviceSection() {
        let { devices } = this.props
        let header = (
            <tr>
                <td className="text-center">Ma thiet bi</td>
                <td>Ten thiet bi</td>
                <td className="text-center">Ngay san xuat</td>
                <td>Hang san xuat</td>
                <td className="text-right">Don gia</td>
            </tr>
        )
        return (
            <RemoteDataListContainer
                remoteData={devices}
                title='Thiet bi'
                header={header}
                renderItem={(item) => {
                    return (
                        <tr>
                            <ClickableTableCells onClick={() => {
                                this.setState({ newItem: item })
                                this.openModal(ModalState.INFO)
                            }}>
                                <div className="text-center">{item.id}</div>
                                <div>{item.name}</div>
                                <div className="text-center">{item.date}</div>
                                <div>{item.company}</div>
                                <div className="text-right">{item.price}</div>
                            </ClickableTableCells>
                            <td className="text-right">
                                <InlineClickableView onClick={() => {
                                    this.setState({ newItem: item })
                                    this.openModal(ModalState.EDIT)
                                }}>
                                    <NigamonIcon name='cog' />
                                </InlineClickableView>
                                /
                                <InlineClickableView onClick={() => {
                                    this.setState({ newItem: item })
                                    this.openModal(ModalState.REMOVE)
                                }}>
                                    <NigamonIcon name='times' />
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
        let { newItem } = this.state
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma thiet bi' disabled={!addNew} value={newItem.id}
                    name='deviceId'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, id: text } })
                    })} />
                <FormInput label='Ten thiet bi' disabled={false} value={newItem.name}
                    name='deviceName'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, name: text } })
                    })} />
                <FormInput label='Hang san xuat' disabled={false} value={newItem.company}
                    name='deviceCompany'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, name: text } })
                    })} />
                <FormDatePicker label='Ngay san xuat' disabled={false} value={this.state.newItem.date}
                    name='deviceDate'
                    min={() => null}
                    max={() => null}
                    onChange={(date) => this.setState({ newItem: { ...newItem, date: date } })} />
                <FormInput label='Don gia' disabled={false} value={newItem.price}
                    name='devicePrice'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, price: text } })
                    })} />
            </form>
        )
    }

    renderInfoForm(remove) {
        let { newItem } = this.state
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma thiet bi' disabled={true} value={newItem.id} />
                <FormInput label='Ten thiet bi' disabled={true} value={newItem.name} />
                <FormInput label='Hang san xuat' disabled={true} value={newItem.company} />
                <FormDatePicker label='Ngay san xuat' disabled={true} value={newItem.date} />
                <FormInput label='Don gia' disabled={true} value={formatMoney(newItem.price) + ' VND'} />
            </form>
        )
    }

    renderModals() {
        return (
            <RemoteDataModal
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
                        this.props.uploadDevice(this.state.newItem)
                        this.setState({ modalOpen: false, newItem: { ...nullItem } })
                    }
                }}
                newCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.uploadDevice(this.state.newItem, true)
                        this.setState({ modalOpen: false, newItem: { ...nullItem } })
                    }
                }}
                removeCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.removeDevice(this.state.newItem)
                        this.setState({ modalOpen: false, newItem: { ...nullItem } })
                    }
                }}
            />
        )
    }

    render() {
        return (
            <BaseAdminScreen
                pathId={routes.DEVICE.id}
                requireLogin={true}
                header={this.renderHeader}
                content={this.renderContent}
                callback={() => {
                    this.props.loadContent()
                }}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        devices: state.devices.devices
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadContent: () => dispatch(loadContent()),
        loadDevices: (page, options) => dispatch(loadDevices(page, options)),
        uploadDevice: (item, addNew) => dispatch(uploadDevice(item, addNew)),
        removeDevice: (item) => dispatch(removeDevice(item))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceScreen)