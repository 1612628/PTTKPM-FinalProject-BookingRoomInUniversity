import React from 'react'
import { connect } from 'react-redux'
import BaseAdminScreen from './base-admin-screen'
import { FullHeader } from '../components/header/full-header'
import { routes } from '../routes';
import { RemoteDataListContainer } from '../components/common/remote-data-list-container'
import { RemoteDropdown, Dropdown } from '../components/common/dropdown';
import { loadContent, loadAdmins, uploadAdmin, removeAdmin, loadMembers, uploadMember, removeMember } from '../stores/users/users.action'
import { InlineClickableView, ClickableTableCells } from '../components/common/clickable-view';
import { NigamonIcon } from '../components/common/nigamon-icon';

import { RemoteDataModal, ModalState, Modal } from '../components/common/modal';
import { FloatingButton } from '../components/common/floating-button';
import { FormInput, FormSelect, FormDatePicker, FormTextArea, FormImageInput } from '../components/common/form';
import { buildErrorTooltip } from '../components/common/error-tooltip';
import { Button } from '../components/common/button';

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

const nullUser = {
    id: null,
    username: null,
    password: null,
    fullname: null,
    cmnd: null,
    phone: null,
    email: null,
}
const nullAdmin = {
    ...nullUser,
    department: null,
}
const nullMember = {
    ...nullUser,
    point: null,
}
const userTypes = [
    { id: 1, label: 'quan tri vien' },
    { id: 2, label: 'thanh vien' }
]
const defaultContainer = userTypes.map(t => t.id)
class UserScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageAdmin: 1,

            pageMember: 1,

            searchText: '',
            container: [...defaultContainer],
            type: null,
            lastUpdate: new Date(),
            modalOpen: false,
            modalState: null,
            formErrors: null,
            newAdmin: {
                ...nullAdmin
            },
            newMember: {
                ...nullMember
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

        this.renderAdminsSection = this.renderAdminsSection.bind(this)
        this.renderMembersSection = this.renderMembersSection.bind(this)
        this.renderUsersHeader = this.renderUsersHeader.bind(this)
        this.renderUserItem = this.renderUserItem.bind(this)
        this.openModal = this.openModal.bind(this)

        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
        this.handleAdminPageRequest = this.handleAdminPageRequest.bind(this)
        this.handleMemberPageRequest = this.handleMemberPageRequest.bind(this)
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
            const newContainer = userTypes.map(t => {
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
        const newContainer = userTypes.map(t => {
            const words = t.label.split(' ').map(w => w.toLowerCase())
            const length = words.filter(w => lower.includes(w)).length
            return length ? { length: length, id: t.id } : null
        }).filter(t => t !== null)

        const exact = newContainer.filter(t => t.length === lower.length).map(t => t.id)
        if (exact.length > 0) {
            return this.setState({ container: [...exact] })
        }
        this.setState({ container: [...newContainer.map(t => t.id)] })
    }
    handleAdminPageRequest(page) {
        this.customSetState({ pageAdmin: page })
        this.props.loadAdmins(page, {
            searchText: this.state.searchText
        })
    }
    handleMemberPageRequest(page) {
        this.customSetState({ pageMember: page })
        this.props.loadMembers(page, {
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
                {this.renderAdminsSection()}
                {this.renderMembersSection()}
                {this.renderModals()}
            </React.Fragment>
        )
    }

    renderUsersHeader(extra) {
        return (
            <tr>
                <td className="text-center">Ma tai khoan</td>
                <td>Ten dang nhap</td>
                <td>Ho ten</td>
                <td className='text-center'>CMND</td>
                <td className='text-center'>So dien thoai</td>
                <td className="text-center">Email</td>
                {extra}
            </tr>
        )
    }
    renderUserItem(item, extra, beforeOnClick) {
        return (
            <tr>
                <ClickableTableCells onClick={() => {
                    beforeOnClick()
                    this.openModal(ModalState.INFO)
                }}>
                    <div className="text-center">{item.id}</div>
                    <div>{item.username}</div>
                    <div >{item.fullname}</div>
                    <div className='text-center'>{item.cmnd}</div>
                    <div className='text-center'>{item.phone}</div>
                    <div className="text-center">{item.email}</div>
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

    renderAdminsSection() {
        if (!this.state.container.includes(1)) {
            return null
        }
        let { admins } = this.props
        let header = this.renderUsersHeader((
            <td className='text-center'>Phong ban</td>
        ))
        return (
            <React.Fragment >
                <RemoteDataListContainer
                    remoteData={admins}
                    title='Quan tri vien'
                    header={header}
                    renderItem={(item) => {
                        return this.renderUserItem(item, (
                            <div className='text-center'>{item.department}</div>
                        ), () => this.setState({ type: 1, newAdmin: item }))
                    }}
                    onRequestPage={this.handleAdminPageRequest}
                />
                <div className='d-flex justify-content-center'>
                    <Button active={true} label='Them quan tri vien' onClick={() => {
                        this.setState({
                            type: 1,
                            modalOpen: true,
                            modalState: ModalState.NEW,
                            newAdmin: { ...nullAdmin }
                        })
                    }} />
                </div>
            </React.Fragment>
        )
    }

    renderMembersSection() {
        if (!this.state.container.includes(2)) {
            return null
        }
        let { members } = this.props
        let header = this.renderUsersHeader((
            <td className='text-center'>Diem ca nhan</td>
        ))
        return (
            <React.Fragment >
                <RemoteDataListContainer
                    remoteData={members}
                    title='Thanh vien'
                    header={header}
                    renderItem={(item) => {
                        return this.renderUserItem(item, (
                            <div className='text-center'>{item.point}</div>
                        ), () => this.setState({ type: 2, newMember: item }))
                    }}
                    onRequestPage={this.handleMemberPageRequest}
                />
                <div className='d-flex justify-content-center'>
                    <Button active={true} label='Them thanh vien' onClick={() => {
                        this.setState({
                            type: 2,
                            modalOpen: true,
                            modalState: ModalState.NEW,
                            newMember: { ...nullMember }
                        })
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
        const type = this.state.type
        let newItem = type === 1 ? this.state.newAdmin : this.state.newMember
        const setState = (() => {
            switch (type) {
                case 1:
                    return item => this.setState({ newAdmin: item })
                case 2:
                    return item => this.setState({ newMember: item })
                default:
                    return () => console.error('unknown user type')
            }
        })()
        return (
            <form ref={ref => {
                this.newForm = ref
                $(this.newForm).validate(validationRules);
            }}>
                {!addNew ? <FormInput label='Ma tai khoan' disabled={true} value={newItem.id}
                    name='userId'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, id: text })
                    })} /> : null}
                <FormInput label='Ten dang nhap' disabled={!addNew} value={newItem.username}
                    name='userUsername'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, username: text })
                    })} />
                {addNew ? <FormInput label='Mat khau' disabled={false} value={newItem.password} type="password"
                    name='userPassword'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, password: text })
                    })} /> : null}
                <FormInput label='Ho ten' disabled={false} value={newItem.fullname}
                    name='userFullname'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, fullname: text })
                    })} />
                <FormInput label='CMND' disabled={false} value={newItem.cmnd}
                    name='userCmnd'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, cmnd: text })
                    })} />
                <FormInput label='So dien thoai' disabled={false} value={newItem.phone}
                    name='userPhone'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, phone: text })
                    })} />
                <FormInput label='Email' disabled={false} value={newItem.email}
                    name='userPhone'
                    onChange={this.validate((text) => {
                        setState({ ...newItem, email: text })
                    })} />
                {type === 1 ?
                    <FormInput label='Phong ban' disabled={false} value={newItem.department}
                        name='adminDepartment'
                        onChange={this.validate((text) => {
                            setState({ ...newItem, department: text })
                        })} /> : null}
                {type === 2 ?
                    <FormInput label='Diem ca nhan' disabled={false} value={newItem.point}
                        name='memberPoint'
                        onChange={this.validate((text) => {
                            setState({ ...newItem, point: text })
                        })} /> : null}
            </form>
        )
    }

    renderInfoForm(remove) {
        const type = this.state.type
        let newItem = type === 1 ? this.state.newAdmin : this.state.newMember
        return (
            <form ref={ref => this.newForm = ref}>
                <FormInput label='Ma tai khoan' disabled={true} value={newItem.id} />
                <FormInput label='Ten dang nhap' disabled={true} value={newItem.username} />
                <FormInput label='Ho ten' disabled={true} value={newItem.fullname} />
                <FormInput label='CMND' disabled={true} value={newItem.cmnd} />
                <FormInput label='So dien thoai' disabled={true} value={newItem.phone} />
                <FormInput label='Email' disabled={true} value={newItem.email} />
                {type === 1 ? <FormInput label='Phong ban' disabled={true} value={newItem.department} /> : null}
                {type === 2 ? <FormInput label='Diem ca nhan' disabled={true} value={newItem.point} /> : null}
            </form>
        )
    }

    renderModals() {
        const type = this.state.type
        let newItem = type === 1 ? this.state.newAdmin : this.state.newMember
        const setState = (() => {
            switch (type) {
                case 1:
                    return () => this.setState({ modalOpen: false }, () => this.setState({ newAdmin: { ...nullAdmin } }))
                case 2:
                    return () => this.setState({ modalOpen: false }, () => this.setState({ newMember: { ...nullMember } }))
                default:
                    return () => console.error('unknown user type')
            }
        })()
        const upload = (() => {
            switch (type) {
                case 1:
                    return (item, addNew) => this.props.uploadAdmin(item, addNew)
                case 2:
                    return (item, addNew) => this.props.uploadMember(item, addNew)
                default:
                    return () => console.error('unknown user type')
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
        members: state.users.members,
        admins: state.users.admins
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadContent: () => dispatch(loadContent()),
        loadAdmins: (page, options) => dispatch(loadAdmins(page, options)),
        uploadAdmin: (item, addNew) => dispatch(uploadAdmin(item, addNew)),
        removeAdmin: (item) => dispatch(removeAdmin(item)),
        loadMembers: (page, options) => dispatch(loadMembers(page, options)),
        uploadMember: (item, addNew) => dispatch(uploadMember(item, addNew)),
        removeMember: (item) => dispatch(removeMember(item)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)