import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { routes } from '../routes'
import { login, loginError } from '../stores/app-state/app-state.action'
import { Link } from '../components/common/link';

class ResetPasswordScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='container-fluid'>
                <div className="row justify-content-center">
                    <div className="col-4">
                        <img className="mb-4" src="/img/brand-admin.svg" alt="" width="100%" />
                        <div className="h2 mb-5 font-weight-bold text-primary text-center">Lay lai mat khau Admin</div>
                        <label htmlFor="inputEmail" className="font-weight-bold h5">Email</label>
                        <input type="email" id="inputEmail" className="form-control rounded-0 mb-5" placeholder="Dia chi Email" required
                            autoFocus />
                        <button className="btn btn-lg btn-primary btn-block font-weight-bold rounded-0">
                            Lay lai mat khau
                        </button>
                        <Link className="btn btn-lg btn-secondary btn-block font-weight-bold rounded-0" href={routes.LOGIN.path}>
                            Quay lai
                        </Link>
                        <p className="mt-5 mb-3 text-muted text-center">&copy; Nigamon Cinema</p>
                    </div>
                </div>
            </div >
        )
    }
}

export default ResetPasswordScreen