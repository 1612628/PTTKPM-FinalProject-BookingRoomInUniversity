import React from 'react'
import { connect } from 'react-redux'
import { loadContent, loadTheaters, uploadTheater, removeTheater } from '../stores/theaters/theaters.action'
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
import TheaterMovieList from '../components/theater/theater-movie-list';

const MIN_INTERVAL = 500

const validationRules = {
    errorElement: 'span',
    rules: {
        theaterId: {
            required: true,
            digits: true
        },
        theaterName: "required",
        theaterAddress: "required",
        theaterRow: {
            required: true,
            digits: true
        },
        theaterColumn: {
            required: true,
            digits: true
        },
    },
    messages: {
        theaterId: {
            required: buildErrorTooltip("Vui long dien ma rap"),
            digits: buildErrorTooltip("Ma rap phai la so nguyen")
        },
        theaterName: buildErrorTooltip("Vui long dien ten rap"),
        theaterAddress: buildErrorTooltip("Vui long dien dia chi rap"),
        theaterRow: {
            required: buildErrorTooltip("Vui long dien so hang ghe"),
            digits: buildErrorTooltip("So hang ghe phai la so nguyen")
        },
        theaterColumn: {
            required: buildErrorTooltip("Vui long dien so ghe moi hang"),
            digits: buildErrorTooltip("So ghe moi hang phai la so nguyen")
        },
    }
}

const nullItem = {
    id: null,
    name: null,
    address: null,
    row: null,
    column: null,
    status: null,
}
class TheaterScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            status: 0,
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
        this.renderTheatersSection = this.renderTheatersSection.bind(this)
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

    openModal(initialState) {
        this.setState({ modalState: initialState, modalOpen: true })
    }

    customSetState(nextState) {
        this.setState({ ...nextState, lastUpdate: new Date() })
    }

    handleStatusChoice(status) {
        this.customSetState({ status: status })
        this.props.loadTheaters(this.state.page, {
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
            this.props.loadTheaters(this.state.page, {
                status: this.state.status,
                searchText: txt
            })
        }, MIN_INTERVAL)
    }
    handleSearchSubmit(txt) {
        this.customSetState({ searchText: txt })
        this.props.loadTheaters(this.state.page, {
            status: this.state.status,
            searchText: txt
        })

    }
    handlePageRequest(page) {
        this.customSetState({ page: page })
        this.props.loadTheaters(page, {
            status: this.state.status,
            searchText: this.state.searchText
        })
    }

    isStatusLoadFailed() {
        let { statusChoices } = this.props
        let isReady = statusChoices.data === null || (statusChoices.error !== null && statusChoices.error !== undefined)
        return isReady
    }

    renderHeader() {
        return (
            <FullHeader title='Phim'
                onSearchChange={this.handleSearchChange}
                onSearchSubmit={this.handleSearchSubmit}
            />
        )
    }

    renderContent() {
        return (
            <React.Fragment>
                {this.renderFilters()}
                {this.renderTheatersSection()}
                {this.renderFloatingButton()}
                {this.renderModals()}
            </React.Fragment>
        )
    }

    renderFilters() {
        return (
            <div className="row my-5 mx-0">
                <RemoteDropdown
                    className='col-md-2'
                    padding='px-3'
                    defaultLabel='Tinh trang'
                    onDefaultClick={() => this.handleStatusChoice(0)}
                    data={this.props.statusChoices}
                    onChoiceClick={c => this.handleStatusChoice(c.id)}
                />
            </div>
        )
    }

    renderTheatersSection() {
        let { theaters } = this.props
        let header = (
            <tr>
                <td className="text-center">Ma rap</td>
                <td>Ten rap</td>
                <td>Dia chi</td>
                <td className="text-center">Kich thuoc</td>
                <td className="text-center">Dang hoat dong</td>
            </tr>
        )
        return (
            <RemoteDataListContainer
                otherFailConditions={() => this.isStatusLoadFailed()}
                notRenderUntil={() => !this.props.statusChoices.isLoading}
                remoteData={theaters}
                title='Rap'
                header={header}
                renderItem={(item) => {
                    let status = this.props.statusChoices.data.filter(c => c.id === item.status)[0]
                    let textColor = status.id === 1 ? 'text-success' : 'text-danger'
                    let size = `${item.row * item.column} - ${item.row}x${item.column}`;
                    return (
                        <tr>
                            <ClickableTableCells onClick={() => {
                                this.setState({ newItem: item })
                                this.openModal(ModalState.INFO)
                            }}>
                                <div className="text-center">{item.id}</div>
                                <div>{item.name}</div>
                                <div>{item.address}</div>
                                <div className="text-center">{size}</div>
                                <div className={`text-center ${textColor}`}>{status.label}</div>
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
        if (this.isStatusLoadFailed() || this.props.statusChoices.data.length === 0) {
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
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma rap' disabled={!addNew} value={newItem.id}
                    name='theaterId'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, id: text } })
                    })} />
                <FormInput label='Ten rap' disabled={false} value={newItem.name}
                    name='theaterName'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, name: text } })
                    })} />
                <FormInput label='Dia chi' disabled={false} value={newItem.address}
                    name='theaterAddress'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, address: text } })
                    })} />
                <FormInput label='So hang ghe' disabled={false} value={newItem.row}
                    name='theaterRow'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, row: text } })
                    })} />
                <FormInput label='So ghe moi hang' disabled={false} value={newItem.column}
                    name='theaterColumn'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, column: text } })
                    })} />
                {!addNew ? <TheaterMovieList theater={newItem} disabled={false} /> : null}
                <FormSelect label='Tinh trang' disabled={false} value={!newItem.status ? status[0].id : newItem.status} options={status}
                    onChange={status => this.setState({ newItem: { ...newItem, status: status } })}
                />
            </form>
        )
    }

    renderInfoForm(remove) {
        let status = this.props.statusChoices.data
        let { newItem } = this.state
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma rap' disabled={true} value={newItem.id} />
                <FormInput label='Ten rap' disabled={true} value={newItem.name} />
                <FormInput label='Dia chi' disabled={true} value={newItem.address} />
                <FormInput label='So hang ghe' disabled={true} value={newItem.row} />
                <FormInput label='So ghe moi hang' disabled={true} value={newItem.column} />
                <TheaterMovieList theater={newItem} disabled={true} />
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
                        this.props.uploadTheater(this.state.newItem)
                        this.setState({ modalOpen: false })
                    }
                }}
                newCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.uploadTheater(this.state.newItem, true)
                        this.setState({ modalOpen: false })
                    }
                }}
                removeCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.removeTheater(this.state.newItem)
                        this.setState({ modalOpen: false })
                    }
                }}
            />
        )
    }

    render() {
        return (
            <BaseAdminScreen
                pathId={routes.THEATER.id}
                requireLogin={true}
                header={this.renderHeader}
                content={this.renderContent}
                callback={() => this.props.loadContent()}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        statusChoices: state.theaters.statusChoices,
        theaters: state.theaters.theaters
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadContent: () => dispatch(loadContent()),
        loadTheaters: (page, options) => dispatch(loadTheaters(page, options)),
        uploadTheater: (theater, addNew) => dispatch(uploadTheater(theater, addNew)),
        removeTheater: (theater) => dispatch(removeTheater(theater))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TheaterScreen)