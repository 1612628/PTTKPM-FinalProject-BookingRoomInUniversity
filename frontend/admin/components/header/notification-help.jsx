import React from 'react'
import { ClickableView } from '../common/clickable-view'
import { NigamonIcon } from '../common/nigamon-icon'
import { Modal } from '../common/modal';

export class NotificationHelp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            notificationOpen: false,
            helpOpen: false
        }

        this.openNotification = this.openNotification.bind(this)
        this.openHelp = this.openHelp.bind(this)
    }

    openNotification() {
        this.setState({ notificationOpen: true })
    }

    openHelp() {
        this.setState({ helpOpen: true })
    }

    render() {
        return (
            <div className="row justify-content-between my-2">
                <div className="col-6">
                    <ClickableView onClick={this.openNotification}>
                        <NigamonIcon name="bell" />
                    </ClickableView>
                </div>
                <div className="col-6">
                    <ClickableView onClick={this.openHelp}>
                        <NigamonIcon name="question-circle" />
                    </ClickableView>
                </div>

                <Modal
                    header='Thong bao'
                    show={this.state.notificationOpen}
                    onHide={() => this.state.notificationOpen = false}
                />
                <Modal
                    header='Cau hoi thuong gap'
                    show={this.state.helpOpen}
                    onHide={() => this.state.helpOpen = false}
                />
            </div>
        )
    }
}