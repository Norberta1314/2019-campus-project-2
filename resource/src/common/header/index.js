import React, { Component } from 'react';
import logoimg from '../../statics/logo.png'
import avatar from '../../statics/avatar.png'
import { connect } from 'react-redux';
import './style.scss'
import { Link } from 'react-router-dom';

function mapStateToProps(state) {
  return {};
}

class Header extends Component {
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
            系统管理
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
          <img className='avatar' src={ avatar } alt=''/>
          <div className='nickname'>
            norberta
          </div>
        </div>

      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(Header);