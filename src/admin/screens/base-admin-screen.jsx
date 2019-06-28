import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { Spinner } from '../components/common/spinner'
import SideNavbar from '../components/side-navbar/side-navbar'

import { tryLogin, reload } from '../stores/app-state/app-state.action'
import { changeActiveNavOption } from '../stores/side-navbar/side-navbar.action'
import { routes } from '../routes'

export class BaseAdminScreen extends React.Component {
    constructor(props) {
        super(props)
        this.requireLogin = this.requireLogin.bind(this)
        this.isLogin = this.isLogin.bind(this)
    }

    requireLogin() {
        return this.props.requireLogin
    }

    isLogin() {
        return this.props.isLogin
    }

    componentWillMount() {
        let cb = () => {
            if (this.isLogin()) {
                return this.props.callback ? this.props.callback() : null
            }
            this.props.history.push(routes.LOGIN.path)
        }
        if (this.requireLogin()) {
            // this.props.tryLogin(cb, () => this.props.history.push(routes.LOGIN.path))
            this.props.tryLogin(cb, () => null)
        } else {
            cb()
        }
        this.props.changeActiveNavOption(this.props.pathId)
    }

    componentWillReceiveProps(props) {
        // if (this.requireLogin() && !props.isLogin) {
        //     props.tryLogin(() => null, () => props.history.push(routes.LOGIN.path))
        // }
    }

    render() {
        if ((this.requireLogin() && !this.isLogin())) {
            return (
                <div
                    style={{
                        display: 'flex',
                        minHeight: '100vh',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Spinner
                        size='5rem'
                    />
                </div>
            )
        } else {
            if (this.props.needReload) {
                this.props.callback && this.props.callback()
                this.props.reload(false)
            }
            return (
                <div className="container-fluid h-100 mx-0">
                    <div className="row h-100 align-items-stretch">
                        <SideNavbar />
                        <div className="col-lg-10 px-0">
                            {this.props.header()}
                            <div className="mx-5" id="content-body">
                                {this.props.content()}
                            </div>
                            <div style={{ height: 150 }}></div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        state: state,
        isLogin: state.appState.isLogin,
        needReload: state.appState.reload
    }
}
const mapDispatchToProps = dispatch => {
    return {
        tryLogin: (cb, failCb) => dispatch(tryLogin(cb, failCb)),
        reload: (r) => dispatch(reload(r)),
        changeActiveNavOption: (id) => dispatch(changeActiveNavOption(id))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaseAdminScreen))