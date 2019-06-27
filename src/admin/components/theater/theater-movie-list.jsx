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
import { loadUsers } from '../../stores/users/users.action'
import { loadTickets } from '../../stores/tickets/tickets.action'
import { loadShowTimes, uploadShowTime, removeShowTime } from '../../stores/theaters/theaters.action'
import { GridPicker } from '../common/grid-picker';

const validationRules = {
    errorElement: 'span',
    rules: {
        movieTime: {
            required: true
        }
    },
    messages: {
        movieTime: {
            required: buildErrorTooltip("Vui long chon thoi gian chieu"),
        }
    }
}
const nullItem = {
    id: null,
    time: null,
    movie: null,
    ticket: null,
    ordered: [],
}
class TheaterMovieList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            modalState: null,
            date: new Date(),
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
        this.props.loadShowTimes(this.props.theater, this.state.date)
        this.props.loadAvailableMovies(this.state.date)
        this.props.loadAvailableTickets()
    }

    validate(cb) {
        return (txt) => {
            $(this.newForm).validate(validationRules)
            $(this.newForm).valid()
            cb(txt)
        }
    }

    isDependenciesLoadFailed() {
        return this.props.tickets.isFailed
            || this.props.movies.isFailed
            || this.props.showTimes.isFailed
    }

    isDependenciesLoading() {
        return this.props.tickets.isLoading || this.props.tickets.currentPage !== 0
            || this.props.movies.isLoading || this.props.movies.currentPage !== 0
            || this.props.showTimes.isLoading
    }

    renderList() {
        let header = (
            <tr>
                <td className="text-center">Thoi gian</td>
                <td>Ten phim</td>
                <td>Loai ve</td>
                <td className="text-center">Da dat</td>
            </tr>
        )
        let movies = this.props.movies.data
        let tickets = this.props.tickets.data
        return (
            <React.Fragment>
                <StaticListContainer
                    className={this.props.disabled ? 'my-5' : 'mt-5 mb-3'}
                    minHeight={200}
                    title={`Lich chieu - Ngay ${formatDate(this.state.date)}`}
                    header={header}
                    items={this.props.showTimes.data}
                    pageSize={5}
                    renderItem={item => {
                        let movie = movies.filter(c => c.id === item.movie)[0]
                        let ticket = tickets.filter(c => c.id === item.ticket)[0]
                        return (
                            <tr>
                                <ClickableTableCells onClick={() => {
                                    this.setState({
                                        newItem: item,
                                        modalState: this.props.disabled ? ModalState.INFO_NO_EDIT : ModalState.INFO,
                                        modalOpen: true
                                    })
                                }}>
                                    <div className="text-center">{formatTime(item.time)}</div>
                                    <div>{movie.name}</div>
                                    <div>{ticket.name}</div>
                                    <div className="text-center">{item.ordered.length}</div>
                                </ClickableTableCells>
                                {this.props.disabled ? null :
                                    <td className="text-right">
                                        <InlineClickableView onClick={() => {
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
                            label="Them suat chieu"
                            onClick={() => {
                                this.setState({
                                    newItem: { ...nullItem },
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
                    editCallback={() => {
                        if ($(this.newForm).valid()) {
                            this.props.uploadShowTime(this.props.theater, this.state.date, this.state.newItem)
                            this.setState({ modalOpen: false })
                        }
                    }}
                    newCallback={() => {
                        if ($(this.newForm).valid()) {
                            this.props.uploadShowTime(this.props.theater, this.state.date, this.state.newItem, true)
                            this.setState({ modalOpen: false })
                        }
                    }}
                    removeCallback={() => {
                        if ($(this.newForm).valid()) {
                            this.props.removeShowTime(this.props.theater, this.state.date, this.state.newItem)
                            this.setState({ modalOpen: false })
                        }
                    }}
                />
            </React.Fragment>
        )
    }

    renderEditForm(addNew) {
        let movies = this.props.movies.data.map(f => ({ id: f.id, label: f.name }))
        let tickets = this.props.tickets.data.map(f => ({ id: f.id, label: f.name }))
        let { newItem } = this.state
        if (!newItem.movie) {
            this.state.newItem.movie = movies[0].id
        }
        if (!newItem.ticket) {
            this.state.newItem.ticket = tickets[0].id
        }
        let { row, column } = this.props.theater
        return (
            <form ref={ref => this.newForm = ref}>
                <FormTimePicker label='Thoi gian chieu' disabled={false} value={newItem.time}
                    onChange={this.validate((time) => {
                        console.log(time)
                        this.setState({ newItem: { ...newItem, time: time } })
                    })} />
                <FormSelect label='Ten phim' disabled={false} value={!newItem.movie ? movies[0].id : newItem.movie} options={movies}
                    onChange={movie => {
                        this.setState({ newItem: { ...newItem, movie: parseInt(movie) } })
                    }}
                />
                <FormSelect label='Loai ve' disabled={false} value={!newItem.ticket ? tickets[0].id : newItem.ticket} options={tickets}
                    onChange={ticket => {
                        this.setState({ newItem: { ...newItem, ticket: parseInt(ticket) } })
                    }}
                />
                <GridPicker
                    disabled={true}
                    width='100%' height={400}
                    row={row} column={column}
                    chosen={newItem.ordered}
                    onChange={chosen => this.setState({ newItem: { ...newItem, ordered: chosen } })}
                />
            </form>
        )
    }

    renderInfoForm(remove) {
        let movies = this.props.movies.data.map(f => ({ id: f.id, label: f.name }))
        let tickets = this.props.tickets.data.map(f => ({ id: f.id, label: f.name }))
        let { newItem } = this.state
        let { row, column } = this.props.theater
        return (
            <form ref={ref => this.newForm = ref}>
                <FormTimePicker label='Thoi gian chieu' disabled={true} value={newItem.time} />
                <FormSelect label='Ten phim' disabled={true} value={newItem.movie} options={movies} />
                <FormSelect label='Loai ve' disabled={true} value={newItem.ticket} options={tickets} />
                <GridPicker
                    label='So do ghe'
                    disabled={true}
                    width='100%' height={400}
                    row={row} column={column}
                    chosen={newItem.ordered}
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
                        this.props.loadShowTimes(this.props.theater, date)
                        this.setState({ date: date })
                    }} />
                <RemoteLoader
                    isLoading={this.isDependenciesLoading()}
                    isFailed={this.isDependenciesLoadFailed()}
                    renderOnSuccess={this.renderList}
                    renderOnFailed={() => {
                        return this.props.showTimes.error
                            + this.props.tickets.error
                            + this.props.movies.error
                    }}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        tickets: state.tickets.tickets,
        movies: state.movies.movies,
        showTimes: state.theaters.showTimes
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadAvailableMovies: (date) => dispatch(loadUsers(0, { date: date })),
        loadAvailableTickets: () => dispatch(loadTickets(0)),
        loadShowTimes: (theater, date) => dispatch(loadShowTimes(theater, date)),
        uploadShowTime: (theater, date, showTime, addNew) => dispatch(uploadShowTime(theater, date, showTime, addNew)),
        removeShowTime: (theater, date, showTime) => dispatch(removeShowTime(theater, date, showTime))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TheaterMovieList)