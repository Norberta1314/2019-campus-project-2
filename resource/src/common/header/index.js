import React, { Component } from 'react';
import { connect } from 'react-redux';
import headers from './style.scss'

function mapStateToProps(state) {
  return {};
}

class Header extends Component {
  render() {

    console.log(headers)
    return (
      <div className={`${headers.m}`}>
       miu
      </div>
    );
  }
}

// export default connect(
//   mapStateToProps,
// )(Header);

export default Header;