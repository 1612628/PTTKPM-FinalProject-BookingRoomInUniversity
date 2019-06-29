import React from 'react'
import { connect } from 'react-redux'
import { Logo } from './logo'
import UserInfo from './user-info'
import { NavList } from './nav-list';

import { changeActiveNavOption } from '../../stores/side-navbar/side-navbar.action'

class SideNavbar extends React.Component {
    render() {
        let { activeIndex, navOptions } = this.props.navList
        return (
            <div className="shadow h-100 col-lg-2 px-0 pb-5">
                <Logo />
                <UserInfo />
                <NavList
                    navOptions={navOptions}
                    activeIndex={activeIndex}
                    onItemClick={this.props.changeActiveNavOption}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        navList: state.sideNavbar.navList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeActiveNavOption: (opt, index) => dispatch(changeActiveNavOption(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNavbar)