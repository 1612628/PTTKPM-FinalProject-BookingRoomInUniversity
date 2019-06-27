import React from 'react'
import { connect } from 'react-redux'
import BaseAdminScreen from './base-admin-screen'
import { FullHeader } from '../components/header/full-header'
import { routes } from '../routes';
import { RemoteDataListContainer } from '../components/common/remote-data-list-container'
import { RemoteDropdown, Dropdown } from '../components/common/dropdown';
import { loadContent, loadUsers, uploadUser, removeUser } from '../stores/users/users.action'
import { InlineClickableView, ClickableTableCells } from '../components/common/clickable-view';
import { NigamonIcon } from '../components/common/nigamon-icon';

import { RemoteDataModal, ModalState, Modal } from '../components/common/modal';
import { FloatingButton } from '../components/common/floating-button';
import { FormInput, FormSelect, FormDatePicker, FormTextArea, FormImageInput } from '../components/common/form';
import { buildErrorTooltip } from '../components/common/error-tooltip';

const MIN_INTERVAL = 500

const validationRules = {
    errorElement: 'span',
    rules: {
        userId: {
            required: true,
            digits: true
        },
        userUsername: "required",
        userPassword: "required",
        userFullname: "required",
        userCmnd: {
            required: true,
            digits: true
        },
        userPhone: {
            required: true,
            digits: true
        },
        userEmail: {
            required: true,
            email: true
        },
        adminDepartment: 'required',
        memberPoint: {
            required: true,
            digits: true
        }
    },
    messages: {
        userId: {
            required: buildErrorTooltip('Vui long dien ma tai khoan'),
            digits: buildErrorTooltip('Ma tai khoan phai la so nguyen')
        },
        userUsername: buildErrorTooltip('Vui long dien ten dang nhap'),
        userPassword: buildErrorTooltip('Vui long dien mat khau'),
        userFullname: buildErrorTooltip('Vui long dien ho ten'),
        userCmnd: {
            required: buildErrorTooltip('Vui long dien so CMND'),
            digits: buildErrorTooltip('So CMND phai la so nguyen')
        },
        userPhone: {
            required: buildErrorTooltip('Vui long dien so dien thoai'),
            digits: buildErrorTooltip('So dien thoai phai la so nguyen')
        },
        userEmail: {
            required: buildErrorTooltip('Vui long dien email'),
            email: buildErrorTooltip('Email khong hop le')
        },
        adminDepartment: buildErrorTooltip('Vui long dien phong ban'),
        memberPoint: {
            required: buildErrorTooltip('Vui long dien diem thanh vien'),
            digits: buildErrorTooltip('Diem thanh vien phai la so nguyen')
        },
    }
}

const nullItem = {
    id: null,
    username: null,
    password: null,
    fullname: null,
    cmnd: null,
    phone: null,
    email: null,
    type: 1,
    department: null,
    point: null,
}
class UserScreen extends React.Component {
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
        this.renderModals = this.renderModals.bind(this)
        this.renderEditForm = this.renderEditForm.bind(this)
        this.renderInfoForm = this.renderInfoForm.bind(this)
        this.renderModalBody = this.renderModalBody.bind(this)

        this.renderFilters = this.renderFilters.bind(this)
        this.renderUsersSection = this.renderUsersSection.bind(this)
        this.openModal = this.openModal.bind(this)

        this.handleUserTypeChange = this.handleUserTypeChange.bind(this)
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

    handleUserTypeChange(type) {
        this.customSetState({ type: type })
        this.props.loadUsers(this.state.page, {
            type: type,
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
            this.props.loadUsers(this.state.page, {
                type: this.state.type,
                searchText: txt
            })
        }, MIN_INTERVAL)
    }
    handleSearchSubmit(txt) {
        this.customSetState({ searchText: txt })
        this.props.loadUsers(this.state.page, {
            type: this.state.type,
            searchText: txt
        })

    }
    handlePageRequest(page) {
        this.customSetState({ page: page })
        this.props.loadUsers(page, {
            type: this.state.type,
            searchText: this.state.searchText
        })
    }

    renderHeader() {
        return (
            <FullHeader title='Tai khoan'
                onSearchChange={this.handleSearchChange}
                onSearchSubmit={this.handleSearchSubmit}
            />
        )
    }

    renderContent() {
        return (
            <React.Fragment>
                {this.renderFilters()}
                {this.renderUsersSection()}
                {this.renderModals()}
            </React.Fragment>
        )
    }

    renderFilters() {
        return (
            <div className="row my-5 mx-0">
                <Dropdown
                    className='col-md-2'
                    padding='px-3'
                    defaultLabel='Loai tai khoan'
                    onDefaultClick={() => this.handleUserTypeChange(0)}
                    choices={[
                        { label: 'Quan tri vien', id: 1 },
                        { label: 'Thanh vien', id: 2 },
                    ]}
                    onChoiceClick={(c) => this.handleUserTypeChange(c.id)}
                />
            </div>
        )
    }

    renderUsersSection() {
        let { users } = this.props
        let header = (
            <tr>
                <td className="text-center">Ma tai khoan</td>
                <td>Ten dang nhap</td>
                <td>Ho ten</td>
                <td className='text-center'>CMND</td>
                <td className='text-center'>So dien thoai</td>
                <td className="text-center">Email</td>
                <td className="text-center">Loai tai khoan</td>
            </tr>
        )
        return (
            <RemoteDataListContainer
                remoteData={users}
                title='Tai khoan'
                header={header}
                renderItem={(item) => {
                    let type = item.type === 1 ? ({
                        label: 'Quan tri vien',
                        color: 'text-danger'
                    }) : ({
                        label: 'Thanh vien',
                        color: 'text-success'
                    })
                    return (
                        <tr>
                            <ClickableTableCells onClick={() => {
                                this.setState({ newItem: item })
                                this.openModal(ModalState.INFO)
                            }}>
                                <div className="text-center">{item.id}</div>
                                <div>{item.username}</div>
                                <div >{item.fullname}</div>
                                <div className='text-center'>{item.cmnd}</div>
                                <div className='text-center'>{item.phone}</div>
                                <div className="text-center">{item.email}</div>
                                <div className={`text-center ${type.color}`}>{type.label}</div>
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
        let types = [
            { id: 1, label: 'Quan tri vien' },
            { id: 2, label: 'Thanh vien' }
        ]
        let { newItem } = this.state
        if (!newItem.type) {
            this.state.newItem.type = types[0].id
        }
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma tai khoan' disabled={!addNew} value={newItem.id}
                    name='userId'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, id: text } })
                    })} />
                <FormInput label='Ten dang nhap' disabled={false} value={newItem.name}
                    name='userUsername'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, username: text } })
                    })} />
                <FormInput label='Mat khau moi' disabled={false} value={newItem.password} type="password"
                    name='userPassword'
                    onChange={this.validate((text) => {
                        this.setState({ newItem: { ...newItem, password: text } })
                    })} />
                <FormInput label='Ho ten' disabled={false} value={newItem.fullname}
                    name='userFullname'
                    onChange={(text) => {
                        this.setState({ newItem: { ...newItem, fullname: text } })
                    }} />
                <FormInput label='CMND' disabled={false} value={newItem.cmnd}
                    name='userCmnd'
                    onChange={(text) => {
                        this.setState({ newItem: { ...newItem, cmnd: text } })
                    }} />
                <FormInput label='So dien thoai' disabled={false} value={newItem.phone}
                    name='userPhone'
                    onChange={(text) => {
                        this.setState({ newItem: { ...newItem, phone: text } })
                    }} />
                <FormSelect label='Loai tai khoan' disabled={false} value={newItem.type} options={types}
                    onChange={type => this.setState({ newItem: { ...newItem, type: type } })}
                />
                {newItem.type === 1 ?
                    <FormInput label='Phong ban' disabled={false} value={newItem.adminDepartment}
                        name='adminDepartment'
                        onChange={(text) => {
                            this.setState({ newItem: { ...newItem, adminDepartment: text } })
                        }} /> : null}
                {newItem.type === 2 ?
                    <FormInput label='Diem ca nhan' disabled={false} value={newItem.memberPoint}
                        name='memberPoint'
                        onChange={(text) => {
                            this.setState({ newItem: { ...newItem, memberPoint: text } })
                        }} /> : null}
            </form>
        )
    }

    renderInfoForm(remove) {
        let types = [
            { id: 1, label: 'Quan tri vien' },
            { id: 2, label: 'Thanh vien' }
        ]
        let { newItem } = this.state
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma tai khoan' disabled={true} value={newItem.id} />
                <FormInput label='Ten dang nhap' disabled={true} value={newItem.name} />
                <FormInput label='Ho ten' disabled={true} value={newItem.fullname} />
                <FormInput label='CMND' disabled={true} value={newItem.cmnd} />
                <FormInput label='So dien thoai' disabled={true} value={newItem.phone} />
                <FormSelect label='Loai tai khoan' disabled={true} value={newItem.type} options={types} />
                {newItem.type === 1 ? <FormInput label='Phong ban' disabled={true} value={newItem.adminDepartment} /> : null}
                {newItem.type === 2 ? <FormInput label='Diem ca nhan' disabled={true} value={newItem.memberPoint} /> : null}
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
                        this.props.uploadUser(this.state.newItem)
                        this.setState({ modalOpen: false, newItem: { ...nullItem } })
                    }
                }}
                newCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.uploadUser(this.state.newItem, true)
                        this.setState({ modalOpen: false, newItem: { ...nullItem } })
                    }
                }}
                removeCallback={() => {
                    if ($(this.newForm).valid()) {
                        this.props.removeUser(this.state.newItem, true)
                        this.setState({ modalOpen: false, newItem: { ...nullItem } })
                    }
                }}
            />
        )
    }

    render() {
        return (
            <BaseAdminScreen
                pathId={routes.USER.id}
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
        users: state.users.users
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadContent: () => dispatch(loadContent()),
        loadUsers: (page, options) => dispatch(loadUsers(page, options)),
        uploadUser: (item, addNew) => dispatch(uploadUser(item, addNew)),
        removeUser: (item) => dispatch(removeUser(item))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)