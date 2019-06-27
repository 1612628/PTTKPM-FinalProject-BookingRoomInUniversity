import React from 'react'
import { NigamonIcon } from './nigamon-icon';

export class Modal extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }

    componentWillReceiveProps(nextProps) {
        let { show } = nextProps;
        if (show) {
            $(this.ref).modal('show')
        } else {
            $(this.ref).modal('hide')
        }
    }

    componentDidMount() {
        $(this.ref).on('hide.bs.modal', e => {
            e.stopImmediatePropagation()
            if ($(this.ref).is(e.target)) {
                this.props.onHide()
            }
        })
        $(this.ref).on('hidden.bs.modal', e => {
            e.stopImmediatePropagation()
            if ($(this.ref).is(e.target) && this.props.nestedModal) {
                $('body').addClass('modal-open')
            }
        })
    }

    render() {
        return (
            <div className="modal fade" tabIndex="-1" role="dialog"
                ref={(ref) => this.ref = ref}
                aria-hidden="true">
                <div className={`modal-dialog ${this.props.large ? 'modal-lg' : ''}`} role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title h3 font-weight-bold">{this.props.header}</div>
                            <button type="button" className="close" onClick={() => $(this.ref).modal('hide')}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        <div className="modal-footer">
                            {this.props.footer}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export const ModalState = {
    EDIT: 'EDIT',
    NEW: 'NEW',
    INFO: 'INFO',
    REMOVE: 'REMOVE',
    INFO_NO_EDIT: 'INFO_NO_EDIT',
}
export class RemoteDataModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalState: this.props.initialState
        }

        this.setModalState = this.setModalState.bind(this)

        this.renderHeader = this.renderHeader.bind(this)
        this.renderFooterButtons = this.renderFooterButtons.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
    }

    setModalState(state) {
        this.setState({ modalState: state })
        this.props.onStateChange(state)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initialState !== this.state.modalState) {
            this.setState({ modalState: nextProps.initialState })
        }
    }

    renderFooter() {
        switch (this.state.modalState) {
            case ModalState.NEW: {
                return this.renderFooterButtons('Tao moi', () => {
                    if (this.props.newCallback) {
                        this.props.newCallback()
                    } else {
                        console.log('new')
                    }
                })
            }
            case ModalState.EDIT: {
                return this.renderFooterButtons('Luu', () => {
                    if (this.props.editCallback) {
                        this.props.editCallback()
                    } else {
                        console.log('save')
                    }
                })
            }
            case ModalState.INFO: {
                return this.renderFooterButtons('Chinh sua', () => this.setModalState(ModalState.EDIT))
            }
            case ModalState.REMOVE: {
                return this.renderFooterButtons('Xoa', () => {
                    if (this.props.removeCallback) {
                        this.props.removeCallback()
                    } else {
                        console.log('remove')
                    }
                })
            }
            default: {
                return null
            }
        }
    }

    renderFooterButtons(confirmBtnText, callback) {
        return (
            <React.Fragment>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Huy</button>
                <button type="button" onClick={callback} className="btn btn-primary">{confirmBtnText}</button>
            </React.Fragment>
        )
    }

    renderHeader() {
        switch (this.state.modalState) {
            case ModalState.NEW: {
                return 'Them moi'
            }
            case ModalState.EDIT: {
                return 'Chinh sua'
            }
            case ModalState.INFO_NO_EDIT:
            case ModalState.INFO: {
                return 'Thong tin'
            }
            case ModalState.REMOVE: {
                return (
                    <div className="text-danger">
                        <NigamonIcon name='exclamation-triangle' className='text-danger' />
                        &nbsp;
                        Xoa
                    </div>
                )
            }
            default: {
                return null
            }
        }
    }

    render() {
        return (
            <Modal
                nestedModal={this.props.nestedModal}
                large={this.props.large}
                show={this.props.show}
                onHide={this.props.onHide}
                header={this.renderHeader()}
                footer={this.renderFooter()}
                body={this.props.body()}
            />
        )
    }
}