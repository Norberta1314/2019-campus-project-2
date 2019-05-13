import React, {Component} from 'react';
import logoimg from '../../statics/logo.png'
import avatar from '../../statics/avatar.png'
import {connect} from 'react-redux';
import './style.scss'
import {Link} from 'react-router-dom';
import {Menu, Dropdown, Icon} from 'antd';
import * as actionCreators from "../../pages/home/store/actionCreators";


function mapStateToProps(state) {
    return {};
}

class Header extends Component {
    constructor(props) {
        super(props)

    }

    componentWillMount() {
        const {changeUserPer} = this.props
        changeUserPer()
    }

    isHead() {
        let perm = this.props.user.permission
        return Array.isArray(perm) ? perm.indexOf('head') > -1 : false
    }

    isAdmin() {
        let perm = this.props.user.permission
        return Array.isArray(perm) ? perm.indexOf('admin') > -1 : false
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href={window.site_url + 'accounts/logout/'}>退出登录</a>
                </Menu.Item>
            </Menu>
        )
        return (
            <div className="header-background">
                <Link to='/'>
                    <div className='logo-block'>
                        <img className="logo" src={logoimg} alt=''/>
                        <p className="logo-name">奖项申报系统</p>
                    </div>
                </Link>
                <div className='content'>
                    {
                        this.isAdmin() ? (<div className='manage content-box'>
                            <Dropdown overlay={() =>
                                <Menu>

                                    <Menu.Item>
                                        <Link to='/organization'>
                                            组织管理
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Link to='/award'>
                                            奖项信息
                                        </Link>
                                    </Menu.Item>
                                </Menu>
                            }>
                                <a className="ant-dropdown-link">
                                    系统管理 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        </div>) : ''
                    }

                    {
                        this.isHead() ? (<div className='check content-box'>
                            <Link to='/check'>
                                我的审核
                            </Link>
                        </div>) : ''
                    }


                    <div className='apply content-box'>
                        <Link to='/apply'>
                            我的申报
                        </Link>
                    </div>
                </div>

                <div className='userinfo'>
                    <img className='avatar' src={this.props.user.avatar} alt=''/>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a className="nickname" href="#">
                            {this.props.user.nick}
                        </a>
                    </Dropdown>
                </div>

            </div>
        );
    }
}

const mapState = (state) => ({
    user: state.home.user
})

const mapDispatch = (dispatch) => ({
    changeUserPer() {
        const action = actionCreators.changeUserPer()
        dispatch(action)
    }
})

export default connect(
    mapState, mapDispatch
)(Header);