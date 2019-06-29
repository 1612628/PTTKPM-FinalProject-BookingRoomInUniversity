import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from '../common/link'
import { NigamonIcon } from '../common/nigamon-icon'
import { userInfo, logOut } from '../../stores/app-state/app-state.action'
import { routes } from '../../routes'
import { InlineClickableView } from '../common/clickable-view';

class UserInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { email } = this.props.userInfo
        return (
            <div className="row justify-content-between align-items-center mx-2 border-bottom border-secondary">
                <p className="text-secondary h6" onClick={this.props.onClick}>{email}</p>
                <p className="h2">
                    <InlineClickableView
                        onClick={() => {
                            this.props.logOut()
                            this.props.history.push(routes.LOGIN.path)
                        }}
                    >
                        <NigamonIcon name="sign-out-alt" />
                    </InlineClickableView>
                </p>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.appState.userInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeUserInfo: (info) => dispatch(userInfo(info)),
        logOut: () => dispatch(logOut())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfo))