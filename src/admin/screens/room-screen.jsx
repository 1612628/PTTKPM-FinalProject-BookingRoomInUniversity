import React from 'react'
import { connect } from 'react-redux'
import { loadContent, loadNormals, uploadNormal, loadHalls, uploadHall, loadBuildingChoicesNormal, loadBuildingChoices } from '../stores/rooms/rooms.action'
import BaseAdminScreen from './base-admin-screen'
import { FullHeader } from '../components/header/full-header'
import { routes } from '../routes';
import { RemoteDataListContainer } from '../components/common/remote-data-list-container'
import { RemoteDropdown, } from '../components/common/dropdown';
import { InlineClickableView, ClickableTableCells } from '../components/common/clickable-view';
import { NigamonIcon } from '../components/common/nigamon-icon';

import { RemoteDataModal, ModalState } from '../components/common/modal';
import { FormInput, FormSelect, FormDatePicker, FormTextArea } from '../components/common/form';
import { buildErrorTooltip } from '../components/common/error-tooltip';
import LectureTimeList from '../components/room/room-lecture-times-list';
import { isLoading, isFailed } from '../libs/remote-data';
import { getColorById } from '../libs/colors'
import { Button } from '../components/common/button';
import { RemoteLoader } from '../components/common/remote-loader';

const MIN_INTERVAL = 500

const validationRules = {
    errorElement: 'span',
    rules: {
        roomName: "required",
        roomPoint: {
            required: true,
            digits: true
        },
    },
    messages: {
        roomName: buildErrorTooltip("Vui long dien ten phong"),
        roomPoint: {
            required: buildErrorTooltip("Vui long dien so diem cua phong"),
            digits: buildErrorTooltip("So diem phai la so nguyen")
        },
    }
}

const nullRoom = {
    id: null,
    name: null,
    status: 1,
    point: null,
    description: null,
    campus: null
}
const nullHallRoom = {
    ...nullRoom,
}
const nullNormalRoom = {
    ...nullRoom,
    building: null,
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
            statusNormal: null,
            buildingNormal: null,
            campusNormal: null,

            pageHall: 1,
            statusHall: null,
            campusHall: null,

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
        this.props.loadNormals(this.state.pageNormal, {
            building: this.state.buildingNormal,
            campus: this.state.campusNormal,
            status: status,
            searchText: this.state.searchText
        })
    }
    handleHallStatusChoice(status) {
        this.customSetState({ statusHall: status })
        this.props.loadHalls(this.state.pageHall, {
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
            status: this.state.statusNormal,
            searchText: this.state.searchText
        })
    }
    handleNormalBuildingChoice(building) {
        this.customSetState({ buildingNormal: building })
        this.props.loadNormals(this.state.pageNormal, {
            building: building,
            campus: this.state.campusNormal,
            status: this.state.statusNormal,
            searchText: this.state.searchText
        })
    }
    handleNormalCampusChoice(campus) {
        this.customSetState({ campusNormal: campus, buildingNormal: null })
        this.props.loadBuildings(campus)
        this.props.loadNormals(this.state.pageNormal, {
            building: null,
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
        this.props.loadHalls(this.state.pageHall, {
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
            <FullHeader title='Phong hoc'
                onSearchChange={this.handleSearchChange}
                onSearchSubmit={this.handleSearchSubmit}
            />
        )
    }

    renderContent() {
        return (
            <React.Fragment>
                {this.renderNormalSection()}

                {this.renderHallSection()}

                {this.renderModals()}
            </React.Fragment>
        )
    }

    renderNormalFilters() {
        return (
            <div className="row my-5 mx-0">
                <RemoteDropdown
                    className='col-md-4 my-2'
                    padding='px-4'
                    defaultLabel='Tinh trang'
                    onDefaultClick={() => this.handleNormalStatusChoice(0)}
                    data={this.props.statusChoices}
                    onChoiceClick={c => this.handleNormalStatusChoice(c.id)}
                />
                <RemoteDropdown
                    className='col-md-3 my-2'
                    padding='px-4'
                    defaultLabel='Toa nha'
                    onDefaultClick={() => this.handleNormalBuildingChoice(0)}
                    data={this.props.buildingChoices}
                    onChoiceClick={c => this.handleNormalBuildingChoice(c.id)}
                />
                <RemoteDropdown
                    className='col-md-3 my-2'
                    padding='px-4'
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
                    className='col-md-4 my-2'
                    padding='px-4'
                    defaultLabel='Tinh trang'
                    onDefaultClick={() => this.handleHallStatusChoice(0)}
                    data={this.props.statusChoices}
                    onChoiceClick={c => this.handleHallStatusChoice(c.id)}
                />
                <RemoteDropdown
                    className='col-md-4 my-2'
                    padding='px-4'
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
                <td className="text-center">Diem</td>
                <td className='text-center'>Tinh trang</td>
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
            color = getColorById(itemStatus.id)
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
                    <div className='text-center'>{item.point}</div>
                    <div className={`text-center ${color}`}>{label}</div>
                    {extra}
                </ClickableTableCells>
                <td className="text-right">
                    <InlineClickableView onClick={() => {
                        beforeOnClick()
                        this.openModal(ModalState.EDIT)
                    }}>
                        <NigamonIcon name='cog' />
                    </InlineClickableView>
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
                {this.renderNormalFilters()}
                <RemoteDataListContainer
                    otherFailConditions={() => this.isDependenciesLoadFailedNormal()}
                    notRenderUntil={() => active}
                    remoteData={normals}
                    title='Phong thuong'
                    header={header}
                    renderItem={(item) => {
                        const building = buildingChoices.data.find(s => s.id === item.building) || buildingChoices.data[0]
                        const campus = campusChoices.data.find(s => s.id === item.campus) || campusChoices.data[0]
                        const extra = (
                            <React.Fragment>
                                <div className='text-center'>{building.label}</div>
                                <div className='text-center'>{campus.label}</div>
                            </React.Fragment>
                        )
                        return this.renderRoomItem(item, extra, () => {
                            this.props.loadBuildingsNormal(item.campus)
                            this.setState({ type: 1, newItemNormal: item })
                        })
                    }}
                    onRequestPage={this.handleNormalPageRequest}
                />
                <div className='d-flex justify-content-center'>
                    <Button disabled={!active} active={true} label='Them phong thuong' onClick={() => {
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
                {this.renderHallFilters()}
                <RemoteDataListContainer
                    otherFailConditions={() => this.isDependenciesLoadFailedHall()}
                    notRenderUntil={() => active}
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
                    <Button disabled={!active} active={true} label='Them phong hoi truong' onClick={() => {
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

    renderInfoForm(remove) {
        const status = this.props.statusChoices.data
        const type = this.state.type
        let newItem = type === 1 ? this.state.newItemNormal : this.state.newItemHall
        const renderExtra = (() => {
            switch (type) {
                case 1: {
                    const buildings = this.props.buildingChoicesNormal
                    const campuses = this.props.campusChoices.data
                    if (campuses.findIndex(c => c.id === newItem.campus) < 0) {
                        return null
                    }
                    return (
                        <React.Fragment>
                            <RemoteLoader
                                isLoading={buildings.isLoading}
                                isFailed={!buildings.data || buildings.error}
                                renderOnFailed={() => buildings.error}
                                renderOnSuccess={() => {
                                    if (buildings.data.findIndex(c => c.id === newItem.building) < 0) {
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
        })
        if (status.findIndex(c => c.id === newItem.status) < 0) {
            return null
        }
        return (
            <form ref={ref => { this.newForm = ref }}>
                <FormInput label='Ma phong' disabled={true} value={newItem.id} />
                <FormInput label='Ten phong' disabled={true} value={newItem.name} />
                <FormTextArea label='Mo ta' disabled={true} value={newItem.description} />
                <FormInput label='Diem phong' disabled={true} value={newItem.point} />
                <LectureTimeList room={newItem} disabled={true} />
                <FormSelect label='Tinh trang' disabled={true} value={newItem.status} options={status} />
                {renderExtra()}
            </form>
        )
    }

    renderEditForm(addNew) {
        const status = this.props.statusChoices.data

        const type = this.state.type
        let newItem = type === 1 ? this.state.newItemNormal : this.state.newItemHall
        const setState = (() => {
            switch (type) {
                case 1:
                    return (item, soft) => {
                        if (soft) {
                            this.state.newItemNormal = { ...item }
                        } else {
                            this.setState({ newItemNormal: { ...item } })
                        }
                    }
                case 2:
                    return (item, soft) => {
                        if (soft) {
                            this.state.newItemHall = { ...item }
                        } else {
                            this.setState({ newItemHall: { ...item } })
                        }
                    }
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
                        newItem.campus = campuses[0].id
                        setState({ ...newItem, campus: campuses[0].id }, true)
                    }
                    return (
                        <React.Fragment>
                            <RemoteLoader
                                isLoading={buildings.isLoading}
                                isFailed={!buildings.data || buildings.error}
                                renderOnFailed={() => buildings.error}
                                renderOnSuccess={() => {
                                    if (buildings.data.findIndex(c => c.id === newItem.building) < 0) {
                                        newItem.building = buildings.data[0].id
                                        setState({ ...newItem, building: buildings.data[0].id }, true)
                                    }
                                    return (
                                        <FormSelect label='Toa nha' disabled={false} value={newItem.building} options={buildings.data}
                                            onChange={building => setState({ ...newItem, building: parseInt(building) })}
                                        />
                                    )
                                }}
                            />
                            <FormSelect label='Co so' disabled={false} value={newItem.campus} options={campuses}
                                onChange={campus => {
                                    const d = parseInt(campus)
                                    this.props.loadBuildingsNormal(d)
                                    setState({ ...newItem, campus: d })
                                }}
                            />
                        </React.Fragment>
                    )
                }
                case 2: {
                    const campuses = this.props.campusChoices.data
                    if (campuses.findIndex(c => c.id === newItem.campus) < 0) {
                        setState({ ...newItem, campus: campuses[0].id }, true)
                    }
                    return (
                        <React.Fragment>
                            <FormSelect label='Co so' disabled={false} value={newItem.campus} options={campuses}
                                onChange={campus => setState({ ...newItem, campus: parseInt(campus) })}
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
        if (status.findIndex(c => c.id === newItem.status) < 0) {
            setState({ ...newItem, status: status[0].id }, true)
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
                <FormTextArea label='Mo ta' disabled={false} value={newItem.description}
                    name='roomDescription'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, description: text })
                    })} />
                <FormInput label='Diem phong' disabled={false} value={newItem.point}
                    name='roomPoint'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, point: text })
                    })} />
                {addNew ? null : <LectureTimeList room={newItem} disabled={false} />}
                <FormSelect label='Tinh trang' disabled={false} value={newItem.status} options={status}
                    onChange={status => setState({ ...newItem, status: parseInt(status) })}
                />

                {renderExtra()}
            </form>
        )
    }

    renderModals() {
        const type = this.state.type
        let newItem = type === 1 ? this.state.newItemNormal : this.state.newItemHall
        const setState = (() => {
            switch (type) {
                case 1:
                    return () => this.setState({ modalOpen: false }, () => this.setState({ newItemNormal: { ...nullNormalRoom } }))
                case 2:
                    return () => this.setState({ modalOpen: false }, () => this.setState({ newItemHall: { ...nullHallRoom } }))
                default:
                    return () => console.error('unknown room type')
            }
        })()
        const upload = (() => {
            switch (type) {
                case 1:
                    return (item, addNew) => this.props.uploadNormal(item, addNew)
                case 2:
                    return (item, addNew) => this.props.uploadHall(item, addNew)
                default:
                    return () => console.error('unknown room type')
            }
        })()
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
                        upload(newItem)
                        setState()
                    }
                }}
                newCallback={() => {
                    if ($(this.newForm).valid()) {
                        upload(newItem, true)
                        setState()
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
        uploadHall: (room, addNew) => dispatch(uploadHall(room, addNew)),
        loadBuildings: (campusId) => dispatch(loadBuildingChoices(campusId)),
        loadBuildingsNormal: (campusId) => dispatch(loadBuildingChoicesNormal(campusId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen)