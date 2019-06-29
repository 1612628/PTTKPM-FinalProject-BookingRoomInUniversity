import React from 'react'
import { connect } from 'react-redux'
import { StaticListContainer } from '../common/list-container'
import { NigamonIcon } from '../common/nigamon-icon'
import { ClickableTableCells, InlineClickableView } from '../common/clickable-view'
import { formatMoney } from '../../libs/money'
import { formatDate } from '../../libs/datetime'
import { Button } from '../common/button'
import { RemoteLoader } from '../common/remote-loader';
import { FormInput, FormDatePicker } from '../common/form'
import { RemoteDataListContainer } from '../common/remote-data-list-container'
import { RemoteDataModal, ModalState } from '../common/modal';
import { loadRoomDevices, uploadRoomDevice, removeRoomDevice, loadAvailableDevices } from '../../stores/rooms/rooms.action'
import { isFailed } from '../../libs/remote-data';
import { PRIMARY_COLOR } from '../../libs/colors';

const validationRules = {
    errorElement: 'span',
    rules: {

    },
    messages: {

    }
}
const nullItem = {
    id: null,
    name: null,
    date: null,
    company: null,
    price: null,
}
class DeviceList extends React.Component {
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
        this.props.loadRoomDevices(this.props.room)
    }

    validate(cb) {
        return (txt) => {
            $(this.newForm).valid()
            cb(txt)
        }
    }

    isDependenciesLoadFailed() {
        let failed = isFailed
        return failed(this.props.roomDevices)
    }

    isDependenciesLoading() {
        return this.props.roomDevices.isLoading
    }

    renderList() {
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
            <React.Fragment>
                <StaticListContainer
                    className={'my-5'}
                    minHeight={200}
                    title={`Thiet bi quan ly`}
                    header={header}
                    items={this.props.roomDevices.data}
                    pageSize={5}
                    renderItem={item => {
                        return (
                            <tr>
                                <ClickableTableCells onClick={() => {
                                    this.setState({
                                        newItem: item,
                                        modalState: ModalState.INFO_NO_EDIT,
                                        modalOpen: true
                                    })
                                }}>
                                    <div className="text-center">{item.id}</div>
                                    <div>{item.name}</div>
                                    <div className="text-center">{formatDate(item.date)}</div>
                                    <div>{item.company}</div>
                                    <div className="text-right">{formatMoney(item.price) + ' VND'}</div>
                                </ClickableTableCells>
                                {this.props.disabled ? null :
                                    <td className="text-right">
                                        {/* <InlineClickableView onClick={() => {
                                            this.setState({
                                                newItem: item,
                                                modalState: ModalState.EDIT,
                                                modalOpen: true
                                            })
                                        }}>
                                            <NigamonIcon name='cog' />
                                        </InlineClickableView>
                                        / */}
                                        <InlineClickableView onClick={() => {
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
                {this.props.disabled ? null : <div className='d-flex justify-content-center my-4'>
                    <Button active={true} label='Them thiet bi' onClick={() => {
                        this.props.loadAvailableDevices(1)
                        this.setState({
                            modalOpen: true,
                            modalState: ModalState.NEW,
                            newItem: { ...nullItem }
                        })
                    }} />
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
                    newCallback={() => {
                        this.props.uploadRoomDevice(this.props.room, this.state.newItem, true)
                        this.setState({ modalOpen: false }, () => this.setState({ newItem: { ...nullItem } }))
                    }}
                    removeCallback={() => {
                        if ($(this.newForm).valid()) {
                            this.props.removeRoomDevice(this.props.room, this.state.newItem)
                            this.setState({ modalOpen: false }, () => this.setState({ newItem: { ...nullItem } }))
                        }
                    }}
                />
            </React.Fragment>
        )
    }

    renderEditForm(addNew) {
        let { availableDevices } = this.props
        let { newItem } = this.state
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
                remoteData={availableDevices}
                title='Thiet bi'
                header={header}
                renderItem={(item) => {
                    return (
                        <tr
                            style={{
                                ...(item.id === newItem.id ? ({
                                    backgroundColor: PRIMARY_COLOR,
                                    color: '#000'
                                }) : {})
                            }}
                        >
                            <ClickableTableCells onClick={() => {
                                this.setState({ newItem: item })
                            }}>
                                <div className="text-center">{item.id}</div>
                                <div>{item.name}</div>
                                <div className="text-center">{formatDate(item.date)}</div>
                                <div>{item.company}</div>
                                <div className="text-right">{formatMoney(item.price) + ' VND'}</div>
                            </ClickableTableCells>
                        </tr>
                    )
                }}
                onRequestPage={(page) => this.props.loadAvailableDevices(page)}
            />
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
            <React.Fragment>
                <RemoteLoader
                    isLoading={this.isDependenciesLoading()}
                    isFailed={this.isDependenciesLoadFailed()}
                    renderOnSuccess={this.renderList}
                    renderOnFailed={() => {
                        return this.props.roomDevices.error
                    }}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        roomDevices: state.rooms.roomDevices,
        availableDevices: state.rooms.availableDevices
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadRoomDevices: (room) => dispatch(loadRoomDevices(room)),
        uploadRoomDevice: (room, device) => dispatch(uploadRoomDevice(room, device)),
        removeRoomDevice: (room, device) => dispatch(removeRoomDevice(room, device)),
        loadAvailableDevices: (page) => dispatch(loadAvailableDevices(page))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DeviceList)