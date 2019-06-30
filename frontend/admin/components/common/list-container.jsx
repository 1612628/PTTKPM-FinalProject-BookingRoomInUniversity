import React from 'react'
import { ClickableView } from './clickable-view';
import { Container } from './container'
import { RemoteLoader } from './remote-loader';

export class ListContainer extends React.Component {
    constructor(props) {
        super(props)

        this.renderList = this.renderList.bind(this)
        this.renderPagination = this.renderPagination.bind(this)
        this.renderPaginationNumbers = this.renderPaginationNumbers.bind(this)

        this.handleNextClick = this.handleNextClick.bind(this)
        this.handlePreviousClick = this.handlePreviousClick.bind(this)
    }

    handleNextClick() {
        this.props.onPaginationClick(this.props.currentPage + 1)
    }

    handlePreviousClick() {
        this.props.onPaginationClick(this.props.currentPage - 1)
    }

    renderPagination() {
        return (
            <tfoot className="section-footer">
                <tr aria-label="Page navigation example">
                    <td className="pagination">
                        <li className={`page-item ${this.props.currentPage === 1 ? 'disabled' : ''}`}>
                            <ClickableView className="page-link"
                                onClick={this.handlePreviousClick}
                            >
                                <span aria-hidden="true">&laquo;</span>
                                <span className="sr-only">Previous</span>
                            </ClickableView>
                        </li>
                        {this.renderPaginationNumbers(this.props.currentPage, this.props.lastPage)}
                        <li className={`page-item ${this.props.currentPage === this.props.lastPage ? 'disabled' : ''}`}>
                            <ClickableView className="page-link"
                                onClick={this.handleNextClick}
                            >
                                <span aria-hidden="true">&raquo;</span>
                                <span className="sr-only">Next</span>
                            </ClickableView>
                        </li>
                    </td>
                </tr>
            </tfoot>
        )
    }

    renderPaginationNumbers(currentPage, lastPage) {
        let cb = this.props.onPaginationClick
        if (currentPage === 1 || lastPage <= 2) {
            return (
                <React.Fragment>
                    <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(1)}>1</ClickableView>
                    </li>
                    <li className={`page-item ${lastPage <= 1 ? 'disabled' : ''} ${currentPage === 2 ? 'active' : ''}`}>
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(2)}>2</ClickableView>
                    </li>
                    <li className={`page-item ${lastPage <= 2 ? 'disabled' : ''} ${currentPage === 3 ? 'active' : ''}`}>
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(3)}>3</ClickableView>
                    </li>
                </React.Fragment>
            )
        } else if (currentPage === lastPage) {
            return (
                <React.Fragment>
                    <li className="page-item">
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(lastPage - 2)}>{lastPage - 2}</ClickableView>
                    </li>
                    <li className="page-item">
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(lastPage - 1)}>{lastPage - 1}</ClickableView>
                    </li>
                    <li className="page-item active">
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(lastPage)}>{lastPage}</ClickableView>
                    </li>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <li className="page-item">
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(currentPage - 1)}>{currentPage - 1}</ClickableView>
                    </li>
                    <li className="page-item active">
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(currentPage)}>{currentPage}</ClickableView>
                    </li>
                    <li className="page-item">
                        <ClickableView
                            className="page-link"
                            onClick={() => cb(currentPage + 1)}>{currentPage + 1}</ClickableView>
                    </li>
                </React.Fragment>
            )
        }
    }

    renderList() {
        return (
            <React.Fragment>
                <div className="overflow-auto d-flex w-100">
                    <table className="section-items">
                        <thead className="h6">
                            {this.props.header}
                        </thead>
                        <tbody>
                            {this.props.items.map((data, i) => {
                                if (this.props.onItemClick) {
                                    return (
                                        <ClickableView
                                            key={this.props.keyExtractor ? this.props.keyExtractor(data, i) : i}
                                            onClick={this.props.onItemClick}>
                                            {this.props.renderItem(data, i)}
                                        </ClickableView>
                                    )
                                }
                                return (
                                    <React.Fragment key={this.props.keyExtractor ? this.props.keyExtractor(data, i) : i}>
                                        {this.props.renderItem(data, i)}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                        {this.renderPagination()}
                    </table>
                </div>

            </React.Fragment>

        )
    }

    render() {
        return (
            <Container title={this.props.title} minHeight={this.props.minHeight} className={this.props.className}>
                {this.props.static ?
                    this.renderList() :
                    <RemoteLoader
                        isLoading={this.props.isLoading}
                        isFailed={this.props.isFailed}
                        renderOnSuccess={this.renderList}
                        renderOnFailed={() => this.props.error}
                    />}
            </Container>
        )
    }
}

export class StaticListContainer extends React.Component {
    constructor(props) {
        super(props)
        this.pageNums = Math.max(Math.ceil(props.items.length / props.pageSize), 1)
        this.pages = new Array(this.pageNums).fill(null).map(() => new Array())
        for (let i = 0; i < props.items.length; i++) {
            let pageIndex = Math.floor(i / props.pageSize)
            this.pages[pageIndex].push(props.items[i])
        }
        this.state = {
            currentPage: (props.currentPage && props.currentPage <= this.pageNums) ? props.currentPage : 1
        }
    }

    render() {
        let { currentPage } = this.state
        return (
            <ListContainer
                static={true}
                className={this.props.className}
                minHeight={this.props.minHeight}
                title={this.props.title}
                header={this.props.header}
                items={this.pages[currentPage - 1]}
                currentPage={currentPage}
                lastPage={this.pageNums}
                onPaginationClick={(page) => this.setState({ currentPage: page })}
                renderItem={this.props.renderItem}
            />
        )
    }
}