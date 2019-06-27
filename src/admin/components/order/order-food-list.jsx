import React from 'react'
import { connect } from 'react-redux'
import { StaticListContainer } from '../common/list-container'
import { NigamonIcon } from '../common/nigamon-icon'
import { ClickableTableCells, InlineClickableView } from '../common/clickable-view'
import { formatMoney } from '../../libs/money'
import { Button } from '../common/button'
import { loadDevices } from '../../stores/devices/devices.action'
import { RemoteLoader } from '../common/remote-loader';
import { FormInput, FormSelect } from '../common/form'
import { buildErrorTooltip } from '../common/error-tooltip';
import { RemoteDataModal, ModalState } from '../common/modal';

const validationRules = {
    errorElement: 'span',
    rules: {
        foodQuantity: {
            required: true,
            digits: true
        }
    },
    messages: {
        foodQuantity: {
            required: buildErrorTooltip("Vui long dien so luong"),
            digits: buildErrorTooltip("So luong phai la so nguyen")
        }
    }
}
const nullItem = {
    id: null,
    quantity: null
}
class OrderFoodList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            modalState: null,
            newItem: {
                ...nullItem
            }
        }
        this.newForm = React.createRef()

        this.renderList = this.renderList.bind(this)
        this.renderModalBody = this.renderModalBody.bind(this)
        this.renderEditForm = this.renderEditForm.bind(this)
        this.renderInfoForm = this.renderInfoForm.bind(this)
    }

    componentWillMount() {
        if (!this.props.foods.isLoading && this.props.foods.isFailed) {
            this.props.loadAvailableFoods()
        }
    }

    validate(cb) {
        return (txt) => {
            $(this.newForm).validate(validationRules)
            $(this.newForm).valid()
            cb(txt)
        }
    }

    renderList() {
        let header = (
            <tr>
                <td className="text-center">Ma thuc an</td>
                <td>Ten thuc an</td>
                <td className="text-right">Don gia</td>
                <td className="text-center">So luong</td>
                <td className="text-right">Tong cong</td>
            </tr>
        )
        let foods = this.props.foods.data
        return (
            <React.Fragment>
                <StaticListContainer
                    className={this.props.disabled ? 'my-5' : 'mt-4 mb-3'}
                    minHeight={200}
                    title="Thuc an"
                    header={header}
                    items={this.props.items}
                    pageSize={5}
                    renderItem={item => {
                        let food = foods.filter(c => c.id === item.id)[0]
                        return (
                            <tr>
                                <ClickableTableCells onClick={() => {
                                    this.setState({
                                        newItem: item,
                                        modalState: this.props.disabled ? ModalState.INFO_NO_EDIT : ModalState.INFO,
                                        modalOpen: true
                                    })
                                }}>
                                    <div className="text-center">{item.id}</div>
                                    <div>{food.name}</div>
                                    <div className="text-right">{formatMoney(food.price) + ' VND'}</div>
                                    <div className="text-center">{item.quantity}</div>
                                    <div className="text-right">{formatMoney(food.price * item.quantity) + ' VND'}</div>
                                </ClickableTableCells>
                                {this.props.disabled ? null :
                                    <td className="text-right">
                                        <InlineClickableView onClick={() => {
                                            this.setState({
                                                newItem: item,
                                                modalState: ModalState.EDIT,
                                                modalOpen: true
                                            })
                                        }}>
                                            <NigamonIcon name='cog' />
                                        </InlineClickableView>
                                        /
                                    <InlineClickableView onClick={() => {
                                            this.setState({
                                                newItem: item,
                                                modalState: ModalState.REMOVE,
                                                modalOpen: true
                                            })
                                        }}>
                                            <NigamonIcon name='times' />
                                        </InlineClickableView>
                                    </td>}
                            </tr>
                        )
                    }}
                />
                {this.props.disabled ? null :
                    <div className='d-flex justify-content-center mb-5'>
                        <Button active={true}
                            label="Them thuc an"
                            onClick={() => {
                                this.setState({
                                    newItem: { ...nullItem },
                                    modalState: ModalState.NEW,
                                    modalOpen: true
                                })
                            }}
                        />
                    </div>}

                <RemoteDataModal
                    nestedModal={true}
                    initialState={this.state.modalState}
                    show={this.state.modalOpen}
                    onHide={() => {
                        this.state.modalOpen = false
                        this.setState({
                            modalState: null
                        })
                    }}
                    body={this.renderModalBody}
                    onStateChange={s => this.setState({ modalState: s })}
                />
            </React.Fragment>
        )
    }

    renderEditForm(addNew) {
        let foods = this.props.foods.data.map(f => ({ id: f.id, label: f.name }))
        let { newItem } = this.state
        let id = newItem.id ? newItem.id : foods[0].id
        let quantity = Number.isInteger(newItem.quantity) ? newItem.quantity : 0
        let total = this.props.foods.data.find(f => f.id === id).price * quantity
        return (
            <form ref={ref => this.newForm = ref}>
                <FormSelect label='Ten thuc an' disabled={false} value={!newItem.id ? foods[0].id : newItem.id} options={foods}
                    onChange={id => {
                        this.setState({ newItem: { ...newItem, id: parseInt(id) } })
                    }}
                />
                <FormInput label='So luong' disabled={false} value={newItem.quantity}
                    name='foodQuantity'
                    onChange={this.validate((text) => {
                        let validated = text
                        if (text !== '' && text.split('').filter(c => '0' > c || c > '9').length === 0) {
                            validated = parseInt(text, 10)
                        }
                        this.setState({ newItem: { ...newItem, quantity: validated } })
                    })} />
                <FormInput label='Tong cong' disabled={true} value={formatMoney(total) + ' VND'} />
            </form>
        )
    }

    renderInfoForm(remove) {
        let foods = this.props.foods.data.map(f => ({ id: f.id, label: f.name }))
        let { newItem } = this.state
        let total = this.props.foods.data.find(f => f.id === newItem.id).price * newItem.quantity
        return (
            <form ref={ref => this.newForm = ref}>
                <FormSelect label='Ten thuc an' disabled={true} value={newItem.id} options={foods} />
                <FormInput label='So luong' disabled={true} value={newItem.quantity} />
                <FormInput label='Tong cong' disabled={true} value={formatMoney(total) + ' VND'} />
            </form>
        )
    }

    renderModalBody() {
        switch (this.state.modalState) {
            case ModalState.NEW:
                return this.renderEditForm(true)
            case ModalState.EDIT:
                return this.renderEditForm()
            case ModalState.INFO_NO_EDIT:
            case ModalState.INFO:
                return this.renderInfoForm(false)
            case ModalState.REMOVE:
                return this.renderInfoForm(true)
            default:
                return null
        }
    }

    render() {
        return (
            <RemoteLoader
                isLoading={this.props.foods.isLoading}
                isFailed={this.props.foods.isFailed}
                renderOnSuccess={this.renderList}
                renderOnFailed={() => this.props.foods.error}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        foods: state.foods.foods
    }
}
const mapDispatchToProps = dispatch => {
    return {
        loadAvailableFoods: () => dispatch(loadDevices(0))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderFoodList)