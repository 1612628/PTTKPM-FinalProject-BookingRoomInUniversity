import React from 'react'
import { connect } from 'react-redux'
import { formatDate, formatDateTime } from '../libs/datetime'
import BaseAdminScreen from './base-admin-screen'
import { BaseHeader } from '../components/header/base-header';
import { NotificationHelp } from '../components/header/notification-help'
import { routes } from '../routes';
import { Button } from '../components/common/button';
import { CurrentDateTime } from '../components/common/datetime';
import { BasicInfo } from '../components/dashboard/basic-info';
import { DashboardDatePicker } from '../components/dashboard/dashboard-datepicker';
import { formatMoney } from '../libs//money'
import { RemoteDataListContainer } from '../components/common/remote-data-list-container'

import { loadContent, loadMovies, loadOrders, loadTheaters, loadCharts } from '../stores/dashboard/dashboard.action'
import { RemoteLoader } from '../components/common/remote-loader';
import { PageSectionHeader } from '../components/common/page-section-header';
import { RemoteLineChart } from '../components/dashboard/line-chart';
import { RemoteBarChart } from '../components/dashboard/bar-chart';
import { RemotePieChart } from '../components/dashboard/pie-chart';
import { FloatingButton } from '../components/common/floating-button';

class DashboardScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            start: new Date(),
            end: new Date(),
            theater: 0
        }

        this.handleDateChange = this.handleDateChange.bind(this)

        this.renderHeader = this.renderHeader.bind(this)
        this.renderContent = this.renderContent.bind(this)

        this.renderSystemInfo = this.renderSystemInfo.bind(this)
        this.renderSystemInfoDetails = this.renderSystemInfoDetails.bind(this)
        this.renderOrdersSection = this.renderOrdersSection.bind(this)
        this.renderMoviesSection = this.renderMoviesSection.bind(this)
        this.renderTheatersSection = this.renderTheatersSection.bind(this)
        this.renderChartSection = this.renderChartSection.bind(this)
        this.renderFloatingButton = this.renderFloatingButton.bind(this)
    }

    handleDateChange(s, e) {
        this.setState({ start: s, end: e })
        this.props.loadCharts(s, e, this.state.theater)
    }

    renderHeader() {
        return (
            <BaseHeader
                title="Trang chinh"
                rightChild={<NotificationHelp />}
            />
        )
    }

    renderSystemInfoDetails(data) {
        return (
            <RemoteLoader
                isLoading={data.isLoading}
                isFailed={data.data === null || (data.error !== null && data.error !== undefined)}
                renderOnSuccess={() => data.total}
                renderOnFailed={() => data.error}
            />
        )
    }

    renderSystemInfo() {
        return (
            <React.Fragment>
                <div className="row justify-content-between my-5 mx-0">
                    <Button label='Cap nhat du lieu' onClick={this.props.loadContent} />
                    <div className='mt-3'>
                        <div className="h6 font-weight-bold mb-2 text-center">Đăng nhập lần cuối: &nbsp;&nbsp;&nbsp;
                                <span className="h6 font-weight-normal">{formatDateTime(this.props.userInfo.lastLogin)}</span></div>
                        <CurrentDateTime />
                    </div>
                </div>
                <div className="row align-items-start mb-5">
                    <BasicInfo
                        className='col-sm-4'
                        label='So phim dang chieu'
                        details={this.renderSystemInfoDetails(this.props.movies)}
                    />
                    <BasicInfo
                        className='col-sm-4'
                        label='Don hang da ban hom nay'
                        details={this.renderSystemInfoDetails(this.props.orders)}
                    />
                    <BasicInfo
                        className='col-sm-4'
                        label='So rap dang hoat dong'
                        details={this.renderSystemInfoDetails(this.props.theaters)}
                    />
                </div>
            </React.Fragment>
        )
    }

    renderOrdersSection() {
        let { orders } = this.props
        let header = (
            <tr>
                <td>Người dùng</td>
                <td className="text-center">Ngày</td>
                <td className="text-center">Giờ</td>
                <td className="text-right">Tổng tiền</td>
            </tr>
        )
        return (
            <RemoteDataListContainer
                remoteData={orders}
                title='Don hang moi nhat'
                header={header}
                renderItem={(item) => {
                    return (
                        <tr>
                            <td>{item.username}</td>
                            <td className="text-center">{item.date}</td>
                            <td className="text-center">{item.time}</td>
                            <td className="text-right">{formatMoney(item.total) + ' VND'}</td>
                        </tr>
                    )
                }}
                onRequestPage={this.props.loadOrders}
            />
        )
    }

    renderMoviesSection() {
        let { movies } = this.props
        let header = (
            <tr>
                <td>Tên phim</td>
                <td>Thể loại</td>
                <td>Đạo diễn</td>
                <td>Rạp</td>
                <td className="text-center">Suất chiếu</td>
            </tr>
        )
        return (
            <RemoteDataListContainer
                remoteData={movies}
                title='Phim dang chieu'
                header={header}
                renderItem={(item) => {
                    return (
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>{item.director}</td>
                            <td>{item.theater}</td>
                            <td className="text-center">{item.showTime}</td>
                        </tr>
                    )
                }}
                onRequestPage={this.props.loadMovies}
            />
        )
    }

    renderTheatersSection() {
        let { theaters } = this.props
        let header = (
            <tr>
                <td>Ten rap</td>
                <td>Dia chi</td>
                <td className="text-center">So ghe da dat</td>
                <td className="text-center">Suc chua</td>
            </tr>
        )
        return (
            <RemoteDataListContainer
                remoteData={theaters}
                title='Rap dang hoat dong'
                header={header}
                renderItem={(theater) => {
                    return (
                        <tr>
                            <td>{theater.name}</td>
                            <td>{theater.address}</td>
                            <td className="text-center">{theater.ordered}</td>
                            <td className="text-center">{theater.capacity}</td>
                        </tr>
                    )
                }}
                onRequestPage={this.props.loadTheaters}
            />
        )
    }

    renderChartSection() {
        let { charts } = this.props
        return (
            <React.Fragment>
                <div className="row mx-0 my-5 align-items-center">
                    <DashboardDatePicker
                        className='col-lg-8'
                        onChange={this.handleDateChange}
                    />
                </div>
                <div className="row justify-content-between mx-0">
                    <RemoteLineChart
                        title='Doanh thu (trieu VND)'
                        className='col-md-5 my-5'
                        label='Doanh thu'
                        data={charts.income}
                        isLoading={charts.isLoading}
                        isFailed={charts.income === null || (charts.error !== null && charts.error !== undefined)}
                        error={charts.error}
                    />
                    <RemoteBarChart
                        title='So nguoi dung moi'
                        className='col-md-5 my-5'
                        label='So nguoi dung moi'
                        data={charts.newUser}
                        isLoading={charts.isLoading}
                        isFailed={charts.newUser === null || (charts.error !== null && charts.error !== undefined)}
                        error={charts.error}
                    />
                    <RemotePieChart
                        title='Ty le phan chia doanh thu'
                        className='col-md-5 my-5'
                        label='Ty le phan chia doanh thu'
                        data={charts.incomeShare}
                        isLoading={charts.isLoading}
                        isFailed={charts.incomeShare === null || (charts.error !== null && charts.error !== undefined)}
                        error={charts.error}
                    />
                </div>
            </React.Fragment>
        )
    }

    renderFloatingButton() {
        return (
            <FloatingButton
                onClick={() => window.scrollTo(0, 0)}
                iconName='arrow-up'
            />
        )
    }

    renderContent() {
        return (
            <React.Fragment>
                {this.renderSystemInfo()}
                {this.renderOrdersSection()}
                {this.renderMoviesSection()}
                {this.renderTheatersSection()}
                <PageSectionHeader label={'Bieu do tong hop'} />
                {this.renderChartSection()}
                {this.renderFloatingButton()}
            </React.Fragment>
        )
    }

    render() {
        return (
            <BaseAdminScreen
                pathId={routes.DASHBOARD.id}
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
        orders: state.dashboard.orders,
        movies: state.dashboard.movies,
        theaters: state.dashboard.theaters,
        userInfo: state.appState.userInfo,
        charts: state.dashboard.charts,
        theaterChoices: state.dashboard.theaterChoices
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadContent: () => dispatch(loadContent()),
        loadOrders: (page) => dispatch(loadOrders(page)),
        loadMovies: (page) => dispatch(loadMovies(page)),
        loadTheaters: (page) => dispatch(loadTheaters(page)),
        loadCharts: (start, end) => dispatch(loadCharts(start, end))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)