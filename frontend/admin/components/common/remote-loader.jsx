import React from 'react'
import { Spinner } from './spinner'

export class RemoteLoader extends React.Component {
    render() {
        if (this.props.isLoading) {
            return (
                <div
                    className={this.props.className}
                    style={{
                        display: 'flex',
                        minHeight: '100%',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Spinner
                        size='3rem'
                    />
                </div>
            )
        } else if (this.props.isFailed) {
            return this.props.renderOnFailed()
        } else {
            return this.props.renderOnSuccess()
        }
    }
}