import React from 'react'
import { ListContainer } from './list-container'

export class RemoteDataListContainer extends React.Component {
    render() {
        let data = this.props.remoteData
        let { title, header, renderItem, onRequestPage } = this.props

        let isFailed = data.data === null || (data.error !== null && data.error !== undefined)
        if (this.props.otherFailConditions) {
            isFailed = isFailed || this.props.otherFailConditions()
        }

        let isLoading = data.isLoading
        if (this.props.notRenderUntil) {
            isLoading = isLoading || !this.props.notRenderUntil()
        }
        return (
            <ListContainer
                isLoading={isLoading}
                isFailed={isFailed}
                error={data.error}
                title={title}
                header={header}
                items={data.data}
                currentPage={data.currentPage}
                lastPage={data.lastPage}
                onPaginationClick={(page) => onRequestPage(page)}
                renderItem={renderItem}
            />
        )
    }
}