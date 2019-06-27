import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { routes } from '../routes'
import { login, loginError } from '../stores/app-state/app-state.action'
import { Link } from '../components/common/link';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showError: false,
            email: '',
            password: ''
        }
    }

    render() {
        if (this.props.isLogin) {
            return <Redirect to={routes.DASHBOARD.path} />
        }
        let allowLogin = this.state.email !== '' && this.state.password !== ''
        return (
            <div className='container-fluid'>
                <div className="row justify-content-center">
                    <div className="col-4">
                        <img className="mb-4" src="/img/brand-admin.svg" alt="" width="100%" />
                        <div className="h2 mb-5 font-weight-bold text-primary text-center">Dang nhap Admin</div>
                        {this.props.loginError ?
                            <div className="alert alert-danger alert-dismissible fade show py-3" role="alert">
                                {this.props.loginError}
                                <button type="button" className="close" aria-label="Close"
                                    onClick={() => this.props.clearError()}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div> : null
                        }
                        <label htmlFor="inputEmail" className="font-weight-bold h5">Email</label>
                        <input type="email" className="form-control rounded-0"
                            placeholder="Dia chi Email (test@dev.com)" autoFocus
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                        <label htmlFor="inputPassword" className="font-weight-bold mt-3 h5">Mat khau</label>
                        <input type="password" id="inputPassword" className="form-control rounded-0" placeholder="Mat khau (test)"
                            onChange={(e) => this.setState({ password: e.target.value })}
                        />
                        <div className="checkbox my-3">
                            <label className="h6">
                                <input type="checkbox" value="remember-me" /> Ghi nho dang nhap
                </label>
                        </div>
                        <button
                            className={`btn btn-lg btn-primary btn-block font-weight-bold rounded-0`}
                            disabled={!allowLogin}
                            onClick={() => {
                                this.props.login(this.state.email, this.state.password)
                            }}
                        >
                            Dang nhap
                        </button>
                        <Link className="btn btn-lg btn-secondary btn-block font-weight-bold rounded-0"
                            href={routes.RESET_PASSWORD.path}>
                            Quen mat khau
                        </Link>
                        <p className="mt-5 mb-3 text-muted text-center">&copy; Nigamon Cinema</p>
                    </div>
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        isLogin: state.appState.isLogin,
        loginError: state.appState.loginError
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(login(email, password)),
        clearError: () => dispatch(loginError(null))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)