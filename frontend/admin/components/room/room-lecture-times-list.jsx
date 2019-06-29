import React from 'react'
import { connect } from 'react-redux'
import { StaticListContainer } from '../common/list-container'
import { NigamonIcon } from '../common/nigamon-icon'
import { ClickableTableCells, InlineClickableView } from '../common/clickable-view'
import { formatMoney } from '../../libs/money'
import { formatTime, formatDate } from '../../libs/datetime'
import { Button } from '../common/button'
import { RemoteLoader } from '../common/remote-loader';
import { FormInput, FormSelect, FormDatePicker, FormTimePicker } from '../common/form'
import { buildErrorTooltip } from '../common/error-tooltip';
import { RemoteDataModal, ModalState } from '../common/modal';
import { loadAdmins } from '../../stores/users/users.action'
import { loadTickets } from '../../stores/tickets/tickets.action'
import { loadLectureTimes, uploadLectureTime } from '../../stores/rooms/rooms.action'
import { GridPicker } from '../common/grid-picker';
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
    start: null,
    end: null,
    status: null,
    members: [],
    chosenMember: null,
}
class LectureTimeList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            modalState: null,
            date: new Date(),
            chosenMember: null,
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
        this.props.loadLectureTimes(this.props.room, this.state.date)
    }

    validate(cb) {
        return (txt) => {
            $(this.newForm).valid()
            cb(txt)
        }
    }

    isDependenciesLoadFailed() {
        let failed = isFailed
        return failed(this.props.lectureTimes)
    }

    isDependenciesLoading() {
        return this.props.lectureTimes.isLoading
    }

    renderList() {
        let header = (
            <tr>
                <td className="text-center">Ma tiet hoc</td>
                <td className='text-center'>Gio bat dau</td>
                <td className='text-center'>Gio ket thuc</td>
                <td className="text-center">Tinh trang</td>
            </tr>
        )
        return (
            <React.Fragment>
                <StaticListContainer
                    className={'my-5'}
                    minHeight={200}
                    title={`Lich - Ngay ${formatDate(this.state.date)}`}
                    header={header}
                    items={this.props.lectureTimes.data}
                    pageSize={5}
                    renderItem={item => {
                        return (
                            <tr>
                                <ClickableTableCells onClick={() => {
                                    this.setState({
                                        newItem: item,
                                        chosenMember: item.chosenMember,
                                        modalState: this.props.disabled ? ModalState.INFO_NO_EDIT : ModalState.INFO,
                                        modalOpen: true
                                    })
                                }}>
                                    <div className="text-center">{item.id}</div>
                                    <div className='text-center'>{formatTime(item.start)}</div>
                                    <div className='text-center'>{formatTime(item.end)}</div>
                                    <div className="text-center">{item.status}</div>
                                </ClickableTableCells>
                                {this.props.disabled ? null :
                                    <td className="text-right">
                                        <InlineClickableView onClick={() => {
                                            this.setState({
                                                newItem: item,
                                                chosenMember: item.chosenMember,
                                                modalState: ModalState.EDIT,
                                                modalOpen: true
                                            })
                                        }}>
                                            <NigamonIcon name='cog' />
                                        </InlineClickableView>
                                    </td>}
                            </tr>
                        )
                    }}
                />
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
                    editCallback={() => {
                        if ($(this.newForm).valid()) {
                            this.props.uploadLectureTime(this.props.room, this.state.date, this.state.newItem)
                            this.setState({ modalOpen: false })
                        }
                    }}
                />
            </React.Fragment>
        )
    }

    renderEditForm(addNew) {
        let { newItem, chosenMember } = this.state
        const memberListHeader = (
            <tr>
                <td className="text-center">Ma thanh vien</td>
                <td>Ho ten</td>
                <td className="text-center">Diem</td>
            </tr>
        )
        return (
            <form ref={ref => {
                this.newForm = ref
                $(this.newForm).validate(validationRules)
            }}>
                <StaticListContainer
                    title='Thanh vien dat'
                    header={memberListHeader}
                    minHeight={200}
                    pageSize={5}
                    items={newItem.members}
                    renderItem={item => {
                        return (
                            <tr style={{
                                ...((item.id === chosenMember) ? ({
                                    backgroundColor: PRIMARY_COLOR,
                                    color: 'white'
                                }) : {})
                            }}>
                                <ClickableTableCells onClick={() => {
                                    this.setState({ chosenMember: item.id })
                                }}>
                                    <div className="text-center">{item.id}</div>
                                    <div>{item.name}</div>
                                    <div className='text-center'>{item.point}</div>
                                </ClickableTableCells>
                            </tr>
                        )
                    }}
                />
            </form>
        )
    }

    renderInfoForm(remove) {
        let { newItem, chosenMember } = this.state
        const memberListHeader = (
            <tr>
                <td className="text-center">Ma thanh vien</td>
                <td>Ho ten</td>
                <td className="text-center">Diem</td>
            </tr>
        )
        return (
            <form ref={ref => this.newForm = ref}>
                <StaticListContainer
                    title='Thanh vien dat'
                    header={memberListHeader}
                    minHeight={200}
                    pageSize={5}
                    items={newItem.members}
                    renderItem={item => {
                        return (
                            <tr style={{
                                ...((item.id === chosenMember) ? ({
                                    backgroundColor: PRIMARY_COLOR,
                                    color: 'white'
                                }) : {})
                            }}>
                                <ClickableTableCells onClick={() => {
                                }}>
                                    <div className="text-center">{item.id}</div>
                                    <div>{item.name}</div>
                                    <div className='text-center'>{item.point}</div>
                                </ClickableTableCells>
                            </tr>
                        )
                    }}
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
            <React.Fragment>
                <FormDatePicker label='Ngay' disabled={false} value={this.state.date}
                    width={300}
                    min={() => null} max={() => null}
                    onChange={(date) => {
                        this.props.loadLectureTimes(this.props.room, date)
                        this.setState({ date: date })
                    }} />
                <RemoteLoader
                    isLoading={this.isDependenciesLoading()}
                    isFailed={this.isDependenciesLoadFailed()}
                    renderOnSuccess={this.renderList}
                    renderOnFailed={() => {
                        return this.props.lectureTimes.error
                    }}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        lectureTimes: state.rooms.lectureTimes
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadLectureTimes: (room, date) => dispatch(loadLectureTimes(room, date)),
        uploadLectureTime: (room, date, lectureTime, addNew) => dispatch(uploadLectureTime(room, date, lectureTime, addNew)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LectureTimeList)