import React from 'react'
import { connect } from 'react-redux'
import { loadContent, loadNormals, uploadNormal, loadHalls, uploadHall } from '../stores/rooms/rooms.action'
import BaseAdminScreen from './base-admin-screen'
import { FullHeader } from '../components/header/full-header'
import { routes } from '../routes';
import { RemoteDataListContainer } from '../components/common/remote-data-list-container'
import { RemoteDropdown, } from '../components/common/dropdown';
import { InlineClickableView, ClickableTableCells } from '../components/common/clickable-view';
import { NigamonIcon } from '../components/common/nigamon-icon';

import { RemoteDataModal, ModalState } from '../components/common/modal';
import { FormInput, FormSelect, FormDatePicker } from '../components/common/form';
import { buildErrorTooltip } from '../components/common/error-tooltip';
import TheaterMovieList from '../components/theater/theater-movie-list';
import { isLoading, isFailed } from '../libs/remote-data';
import { Button } from '../components/common/button';
import { RemoteLoader } from '../components/common/remote-loader';

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

const nullRoom = {
    id: null,
    name: null,
    status: 1,
    point: null
}
const nullHallRoom = {
    ...nullRoom,
    description: null,
    campus: null
}
const nullNormalRoom = {
    ...nullRoom,
    description: null,
    building: null
}
const roomTypes = [
    { id: 1, label: 'phong thuong' },
    { id: 2, label: 'phong hoi truong' }
]
const defaultContainer = roomTypes.map(t => t.id)
class RoomScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNormal: 1,
            statusNormal: 1,
            buildingNormal: 1,
            campusNormal: 1,

            pageHall: 1,
            statusHall: 1,
            campusHall: 1,

            container: [...defaultContainer],
            searchText: '',
            lastUpdate: new Date(),
            modalOpen: false,
            modalState: null,
            formErrors: null,
            newItemNormal: {
                ...nullNormalRoom
            },
            newItemHall: {
                ...nullHallRoom
            }
        }
        this.updateTimeout = null
        this.newForm = React.createRef()

        this.customSetState = this.customSetState.bind(this)

        this.renderHeader = this.renderHeader.bind(this)
        this.renderContent = this.renderContent.bind(this)
        this.renderModals = this.renderModals.bind(this)
        this.renderEditForm = this.renderEditForm.bind(this)
        this.renderInfoForm = this.renderInfoForm.bind(this)
        this.renderModalBody = this.renderModalBody.bind(this)

        this.renderNormalFilters = this.renderNormalFilters.bind(this)
        this.renderHallFilters = this.renderHallFilters.bind(this)
        this.renderRoomHeader = this.renderRoomHeader.bind(this)
        this.renderRoomItem = this.renderRoomItem.bind(this)
        this.renderNormalSection = this.renderNormalSection.bind(this)
        this.renderHallSection = this.renderHallSection.bind(this)
        this.openModal = this.openModal.bind(this)

        this.handleNormalStatusChoice = this.handleNormalStatusChoice.bind(this)
        this.handleNormalBuildingChoice = this.handleNormalBuildingChoice.bind(this)
        this.handleNormalCampusChoice = this.handleNormalCampusChoice.bind(this)
        this.handleNormalPageRequest = this.handleNormalPageRequest.bind(this)
        this.isDependenciesLoadFailedNormal = this.isDependenciesLoadFailedNormal.bind(this)
        this.isDependenciesLoadingNormal = this.isDependenciesLoadingNormal.bind(this)

        this.handleHallStatusChoice = this.handleHallStatusChoice.bind(this)
        this.handleHallCampusChoice = this.handleHallCampusChoice.bind(this)
        this.handleHallPageRequest = this.handleHallPageRequest.bind(this)
        this.isDependenciesLoadFailedHall = this.isDependenciesLoadFailedHall.bind(this)
        this.isDependenciesLoadingHall = this.isDependenciesLoadingHall.bind(this)

        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    }

    validate(cb) {
        return (txt) => {
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

    handleNormalStatusChoice(status) {
        this.customSetState({ statusNormal: status })
        this.props.loadNormalRooms(this.state.pageNormal, {
            building: this.state.buildingNormal,
            campus: this.state.campusNormal,
            status: status,
            searchText: this.state.searchText
        })
    }
    handleHallStatusChoice(status) {
        this.customSetState({ statusHall: status })
        this.props.loadHallRooms(this.state.pageHall, {
            campus: this.state.campusHall,
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
            if (!txt || txt === '') {
                return this.setState({ container: [...defaultContainer] })
            }
            const lower = txt.toLowerCase()
            const newContainer = roomTypes.map(t => {
                const words = t.label.split(' ').map(w => w.toLowerCase())
                const length = words.filter(w => lower.includes(w)).length
                return length ? { length: length, id: t.id } : null
            }).filter(t => t !== null)

            const exact = newContainer.filter(t => t.length === lower.split(' ').length).map(t => t.id)
            if (exact.length > 0) {
                return this.setState({ container: [...exact] })
            }
            this.setState({ container: [...newContainer.map(t => t.id)] })
        }, MIN_INTERVAL)
    }
    handleSearchSubmit(txt) {
        this.customSetState({ searchText: txt })
        if (!txt || txt === '') {
            return this.setState({ container: [...defaultContainer] })
        }
        const lower = txt.toLowerCase()
        const newContainer = roomTypes.map(t => {
            const words = t.label.split(' ').map(w => w.toLowerCase())
            const length = words.filter(w => lower.includes(w)).length
            return length ? { length: length, id: t.id } : null
        }).filter(t => t !== null)

        const exact = newContainer.filter(t => t.length === lower.split(' ').length).map(t => t.id)
        if (exact.length > 0) {
            return this.setState({ container: [...exact] })
        }
        this.setState({ container: [...newContainer.map(t => t.id)] })

    }
    handleNormalPageRequest(page) {
        this.customSetState({ pageNormal: page })
        this.props.loadNormals(page, {
            building: this.state.buildingNormal,
            campus: this.state.campusNormal,
            status: this.state.statusNormal,
            searchText: this.state.searchText
        })
    }
    handleNormalBuildingChoice(building) {
        this.customSetState({ buildingNormal: building })
        this.props.loadNormals(this.state.page, {
            building: building,
            campus: this.state.campusNormal,
            status: this.state.statusNormal,
            searchText: this.state.searchText
        })
    }
    handleNormalCampusChoice(campus) {
        this.customSetState({ campusNormal: campus })
        this.props.loadNormals(this.state.page, {
            building: this.state.buildingNormal,
            campus: campus,
            status: this.state.statusNormal,
            searchText: this.state.searchText
        })
    }

    handleHallPageRequest(page) {
        this.customSetState({ pageHall: page })
        this.props.loadHalls(page, {
            campus: this.state.campusHall,
            status: this.state.statusHall,
            searchText: this.state.searchText
        })
    }
    handleHallCampusChoice(campus) {
        this.customSetState({ campusHall: campus })
        this.props.loadNormals(this.state.page, {
            campus: campus,
            status: this.state.statusHall,
            searchText: this.state.searchText
        })
    }

    // normal room dependencies
    isDependenciesLoadFailedNormal() {
        let { statusChoices, buildingChoices, campusChoices } = this.props
        const failed = isFailed
        return failed(statusChoices)
            || failed(buildingChoices)
            || failed(campusChoices)
    }
    isDependenciesLoadingNormal() {
        let { statusChoices, buildingChoices, campusChoices } = this.props
        const loading = isLoading(0)
        return loading(statusChoices)
            || loading(buildingChoices)
            || loading(campusChoices)
    }

    // hall room dependencies
    isDependenciesLoadFailedHall() {
        let { statusChoices, campusChoices } = this.props
        const failed = isFailed
        return failed(statusChoices)
            || failed(campusChoices)
    }
    isDependenciesLoadingHall() {
        let { statusChoices, campusChoices } = this.props
        const loading = isLoading(0)
        return loading(statusChoices)
            || loading(campusChoices)
    }

    renderHeader() {
        return (
            <FullHeader title='Phong hoc thuong'
                onSearchChange={this.handleSearchChange}
                onSearchSubmit={this.handleSearchSubmit}
            />
        )
    }

    renderContent() {
        return (
            <React.Fragment>
                {this.renderNormalFilters()}
                {this.renderNormalSection()}

                {this.renderHallFilters()}
                {this.renderHallSection()}

                {this.renderModals()}
            </React.Fragment>
        )
    }

    renderNormalFilters() {
        return (
            <div className="row my-5 mx-0">
                <RemoteDropdown
                    className='col-md-2'
                    padding='px-3'
                    defaultLabel='Tinh trang'
                    onDefaultClick={() => this.handleNormalStatusChoice(0)}
                    data={this.props.statusChoices}
                    onChoiceClick={c => this.handleNormalStatusChoice(c.id)}
                />
                <RemoteDropdown
                    className='col-md-2'
                    padding='px-3'
                    defaultLabel='Toa nha'
                    onDefaultClick={() => this.handleNormalBuildingChoice(0)}
                    data={this.props.buildingChoices}
                    onChoiceClick={c => this.handleNormalBuildingChoice(c.id)}
                />
                <RemoteDropdown
                    className='col-md-2'
                    padding='px-3'
                    defaultLabel='Co so'
                    onDefaultClick={() => this.handleNormalCampusChoice(0)}
                    data={this.props.campusChoices}
                    onChoiceClick={c => this.handleNormalCampusChoice(c.id)}
                />
            </div>
        )
    }
    renderHallFilters() {
        return (
            <div className="row my-5 mx-0">
                <RemoteDropdown
                    className='col-md-2'
                    padding='px-3'
                    defaultLabel='Tinh trang'
                    onDefaultClick={() => this.handleHallStatusChoice(0)}
                    data={this.props.statusChoices}
                    onChoiceClick={c => this.handleHallStatusChoice(c.id)}
                />
                <RemoteDropdown
                    className='col-md-2'
                    padding='px-3'
                    defaultLabel='Co so'
                    onDefaultClick={() => this.handleHallCampusChoice(0)}
                    data={this.props.campusChoices}
                    onChoiceClick={c => this.handleHallCampusChoice(c.id)}
                />
            </div>
        )
    }

    renderRoomHeader(extra) {
        return (
            <tr>
                <td className="text-center">Ma phong</td>
                <td>Ten phong</td>
                <td className='text-center'>Tinh trang</td>
                <td className="text-center">Diem</td>
                {extra}
            </tr>
        )
    }
    renderRoomItem(item, extra, beforeOnClick) {
        const status = this.props.statusChoices
        let itemStatus = status.data.find(s => s.id === item.status)
        let color = ''
        let label = 'Unknown ID ' + item.status
        if (itemStatus) {
            color = getColor(itemStatus.id)
            label = itemStatus.label
        }
        return (
            <tr>
                <ClickableTableCells onClick={() => {
                    beforeOnClick()
                    this.openModal(ModalState.INFO)
                }}>
                    <div className="text-center">{item.id}</div>
                    <div>{item.name}</div>
                    <div className={`text-center ${color}`}>{label}</div>
                    <div className='text-center'>{item.point}</div>
                    {extra}
                </ClickableTableCells>
                <td className="text-right">
                    <InlineClickableView onClick={() => {
                        beforeOnClick()
                        this.openModal(ModalState.EDIT)
                    }}>
                        <NigamonIcon name='cog' />
                    </InlineClickableView>
                    {/* /
                    <InlineClickableView onClick={() => {
                        beforeOnClick()
                        this.openModal(ModalState.REMOVE)
                    }}>
                        <NigamonIcon name='times' />
                    </InlineClickableView> */}
                </td>
            </tr>
        )
    }

    renderNormalSection() {
        if (!this.state.container.includes(1)) {
            return null
        }
        let { normals,
            buildingChoices,
            campusChoices } = this.props
        let header = this.renderRoomHeader((
            <React.Fragment>
                <td className='text-center'>Toa nha</td>
                <td className='text-center'>Co so</td>
            </React.Fragment>
        ))
        const active = !this.isDependenciesLoadFailedNormal() && !this.isDependenciesLoadingNormal()
        return (
            <React.Fragment >
                <RemoteDataListContainer
                    otherFailConditions={this.isDependenciesLoadFailedNormal()}
                    notRenderUntil={!this.isDependenciesLoadFailedNormal() && !this.isDependenciesLoadingNormal()}
                    remoteData={normals}
                    title='Phong thuong'
                    header={header}
                    renderItem={(item) => {
                        const building = buildingChoices.data.find(s => s.id === item.building) || buildingChoices.data[0]
                        const campus = campusChoices.data.find(s => s.id === item.campus) || campusChoices.data[0]
                        return this.renderRoomItem(item, (
                            <React.Fragment>
                                <div className='text-center'>{building.label}</div>
                                <div className='text-center'>{campus.label}</div>
                            </React.Fragment>
                        ), () => {
                            this.props.loadBuildingsNormal(item.building)
                            this.setState({ type: 1, newItemNormal: item })
                        })
                    }}
                    onRequestPage={this.handleNormalPageRequest}
                />
                <div className='d-flex justify-content-center'>
                    <Button active={active} label='Them phong thuong' onClick={() => {
                        if (active) {
                            this.setState({
                                type: 1,
                                modalOpen: true,
                                modalState: ModalState.NEW,
                                newItemNormal: { ...nullNormalRoom }
                            })
                        }
                    }} />
                </div>
            </React.Fragment>
        )
    }
    renderHallSection() {
        if (!this.state.container.includes(2)) {
            return null
        }
        let { halls, campusChoices } = this.props
        let header = this.renderRoomHeader((
            <td className='text-center'>Co so</td>
        ))
        const active = !this.isDependenciesLoadFailedHall() && !this.isDependenciesLoadingHall()
        return (
            <React.Fragment >
                <RemoteDataListContainer
                    otherFailConditions={this.isDependenciesLoadFailedHall()}
                    notRenderUntil={!this.isDependenciesLoadFailedHall() && !this.isDependenciesLoadingHall()}
                    remoteData={halls}
                    title='Phong hoi truong'
                    header={header}
                    renderItem={(item) => {
                        const campus = campusChoices.data.find(s => s.id === item.campus) || campusChoices.data[0]
                        return this.renderRoomItem(item, (
                            <div className='text-center'>{campus.label}</div>
                        ), () => {
                            this.setState({ type: 2, newItemHall: item })
                        })
                    }}
                    onRequestPage={this.handleHallPageRequest}
                />
                <div className='d-flex justify-content-center'>
                    <Button active={active} label='Them phong hoi truong' onClick={() => {
                        if (active) {
                            this.setState({
                                type: 2,
                                modalOpen: true,
                                modalState: ModalState.NEW,
                                newItemHall: { ...nullHallRoom }
                            })
                        }
                    }} />
                </div>
            </React.Fragment>
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
        const status = this.props.statusChoices.data

        const type = this.state.type
        let newItem = type === 1 ? this.state.newItemNormal : this.state.newItemHall
        const setState = (() => {
            switch (type) {
                case 1:
                    return item => this.setState({ newItemNormal: item })
                case 2:
                    return item => this.setState({ newItemHall: item })
                default:
                    return () => console.error('unknown room type')
            }
        })()
        const renderExtra = (() => {
            switch (type) {
                case 1: {
                    const buildings = this.props.buildingChoicesNormal
                    const campuses = this.props.campusChoices.data
                    if (campuses.findIndex(c => c.id === newItem.campus) < 0) {
                        this.props.loadBuildingsNormal(campuses[0].id)
                        setState({ ...newItem, campus: campuses[0].id })
                        return null
                    }
                    return (
                        <React.Fragment>
                            <RemoteLoader
                                isLoading={building.isLoading}
                                isFailed={!building.data || !building.error}
                                renderOnFailed={() => building.error}
                                renderOnSuccess={() => {
                                    if (buildings.findIndex(c => c.id === newItem.building) < 0) {
                                        setState({ ...newItem, building: buildings[0].id })
                                        return null
                                    }
                                    return (
                                        <FormSelect label='Toa nha' disabled={true} value={newItem.building} options={buildings.data} />
                                    )
                                }}
                            />
                            <FormSelect label='Co so' disabled={true} value={newItem.campus} options={campuses} />
                        </React.Fragment>
                    )
                }
                case 2: {
                    const campuses = this.props.campusChoices.data
                    if (campuses.findIndex(c => c.id === newItem.campus) < 0) {
                        setState({ ...newItem, campus: campuses[0].id })
                        return null
                    }
                    return (
                        <React.Fragment>
                            <FormSelect label='Co so' disabled={true} value={newItem.campus} options={campuses} />
                        </React.Fragment>
                    )
                }
                default: {
                    return (
                        <React.Fragment>
                            Unknown room type
                        </React.Fragment>
                    )
                }
            }
        })()
        if (statusChoices.data.findIndex(c => c.id === newItem.status) < 0) {
            setState({ ...newItem, status: statusChoices.data[0].id })
            return null
        }
        return (
            <form ref={ref => { this.newForm = ref }}>
                <FormInput label='Ma phong' disabled={true} value={newItem.id} />
                <FormInput label='Ten phong' disabled={true} value={newItem.name} />
                <FormSelect label='Tinh trang' disabled={true} value={newItem.status} options={status} />
                <FormInput label='Diem phong' disabled={true} value={newItem.point} />
                {renderExtra()}
            </form>
        )
    }

    renderInfoForm(remove) {
        const status = this.props.statusChoices.data

        const type = this.state.type
        let newItem = type === 1 ? this.state.newItemNormal : this.state.newItemHall
        const setState = (() => {
            switch (type) {
                case 1:
                    return item => this.setState({ newItemNormal: item })
                case 2:
                    return item => this.setState({ newItemHall: item })
                default:
                    return () => console.error('unknown room type')
            }
        })()
        const renderExtra = (() => {
            switch (type) {
                case 1:
                    const buildings = this.props.buildingChoicesNormal
                    const campuses = this.props.campusChoices.data
                    if (campuses.findIndex(c => c.id === newItem.campus) < 0) {
                        this.props.loadBuildingsNormal(campuses[0].id)
                        setState({ ...newItem, campus: campuses[0].id })
                        return null
                    }
                    return (
                        <React.Fragment>
                            <RemoteLoader
                                isLoading={building.isLoading}
                                isFailed={!building.data || !building.error}
                                renderOnFailed={() => building.error}
                                renderOnSuccess={() => {
                                    if (buildings.findIndex(c => c.id === newItem.building) < 0) {
                                        setState({ ...newItem, building: buildings[0].id })
                                        return null
                                    }
                                    return (
                                        <FormSelect label='Toa nha' disabled={false} value={newItem.building} options={buildings.data}
                                            onChange={building => setState({ ...newItem, building: building })}
                                        />
                                    )
                                }}
                            />
                            <FormSelect label='Co so' disabled={false} value={newItem.campus} options={campuses}
                                onChange={campus => {
                                    this.props.loadBuildingsNormal(campus)
                                    setState({ ...newItem, campus: campus })
                                }}
                            />
                        </React.Fragment>
                    )
                case 2: {
                    const campuses = this.props.campusChoices.data
                    if (campuses.findIndex(c => c.id === newItem.campus) < 0) {
                        setState({ ...newItem, campus: campuses[0].id })
                        return null
                    }
                    return (
                        <React.Fragment>
                            <FormSelect label='Co so' disabled={false} value={newItem.campus} options={campuses}
                                onChange={campus => setState({ ...newItem, campus: campus })}
                            />
                        </React.Fragment>
                    )
                }
                default:
                    return (
                        <React.Fragment>
                            Unknown room type
                        </React.Fragment>
                    )
            }
        })
        if (statusChoices.data.findIndex(c => c.id === newItem.status) < 0) {
            setState({ ...newItem, status: statusChoices.data[0].id })
            return null
        }
        return (
            <form ref={ref => {
                this.newForm = ref
                $(this.newForm).validate(validationRules);
            }}>
                {!addNew ? <FormInput label='Ma phong' disabled={true} value={newItem.id}
                    name='roomId'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, id: text })
                    })} /> : null}
                <FormInput label='Ten phong' disabled={!addNew} value={newItem.name}
                    name='roomName'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, name: text })
                    })} />
                <FormSelect label='Tinh trang' disabled={false} value={newItem.status} options={status}
                    onChange={status => setState({ ...newItem, status: status })}
                />
                <FormInput label='Diem phong' disabled={false} value={newItem.point}
                    name='roomPoint'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, point: text })
                    })} />
                {renderExtra()}
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
                        this.props.uploadTheater(this.state.newItemNormal)
                        this.setState({ modalOpen: false })
                    }
                }}
                newCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.uploadTheater(this.state.newItemNormal, true)
                        this.setState({ modalOpen: false })
                    }
                }}
                removeCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.removeTheater(this.state.newItemNormal)
                        this.setState({ modalOpen: false })
                    }
                }}
            />
        )
    }

    render() {
        return (
            <BaseAdminScreen
                pathId={routes.ROOM.id}
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
        statusChoices: state.rooms.statusChoices,
        normals: state.rooms.normals,
        halls: state.rooms.halls,
        buildingChoices: state.rooms.buildingChoices,
        buildingChoicesNormal: state.rooms.buildingChoicesNormal,
        campusChoices: state.rooms.campusChoices
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadContent: () => dispatch(loadContent()),
        loadNormals: (page, options) => dispatch(loadNormals(page, options)),
        uploadNormal: (room, addNew) => dispatch(uploadNormal(room, addNew)),
        loadHalls: (page, options) => dispatch(loadHalls(page, options)),
        uploadHalls: (room, addNew) => dispatch(uploadHall(room, addNew)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen)