import React, { Component } from 'react';
import logoimg from '../../statics/logo.png'
import avatar from '../../statics/avatar.png'
import { connect } from 'react-redux';
import './style.scss'
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';


function mapStateToProps(state) {
  return {};
}

class Header extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className="header-background">
        <Link to='/'>
          <div className='logo-block'>
            <img className="logo" src={ logoimg } alt=''/>
            <p className="logo-name">奖项申报系统</p>
          </div>
        </Link>
        <div className='content'>
          <div className='manage content-box'>
            <Dropdown overlay={ () =>
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
              <a className="ant-dropdown-link" href="#">
                系统管理 <Icon type="down"/>
              </a>
            </Dropdown>
          </div>
          <div className='check content-box'>
            <Link to='/check'>
              我的审核
            </Link>
          </div>

          <div className='apply content-box'>
            <Link to='/apply'>
              我的申报
            </Link>
          </div>
        </div>

        <div className='userinfo'>
          <img className='avatar' src={ this.props.user.avatar } alt=''/>
          <div className='nickname'>
            {/*norberta*/}
            {this.props.user.nick}
          </div>
        </div>

      </div>
    );
  }
}

const mapState = (state) => ({
  user: state.home.user
})

const mapDispatch = (dispatch) => ({})

export default connect(
  mapState, mapDispatch
)(Header);