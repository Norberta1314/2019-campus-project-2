import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Input, Dropdown, Menu, Icon, DatePicker, Table, Divider, Breadcrumb, Spin
} from 'antd'
import { Link } from 'react-router-dom';
import './style.scss'
import 'antd/dist/antd.css';
import * as actionCreators from './store/actionCreators'
import { stateEnum, suffix } from '../../utils/utils';

const onClickSearchApplyState = ({key}) => {

}

let currentState = 0

class Apply
  extends Component {
  state = {
    spin: false
  }

  constructor(props) {
    super(props)
    this.state = {
      ApplyState: [
        {key: '-2', applyName: '不限'},
        {key: '-1', applyName: '未审核'},
        {key: '1', applyName: '审核中'},
        {key: '2', applyName: '未通过'},
        {key: '3', applyName: '通过'},
        {key: '4', applyName: '已获奖'},
        {key: '5', applyName: '未获奖'}
      ],
      searchCurrentApplyState: 1,
    }
    this.onClickSearchApplyState = this.onClickSearchApplyState.bind(this)
    this.columns = [{
      title: '所属单位',
      dataIndex: 'organization',
      key: 'organization',
      render: text => <a href="javascript:;">{ suffix(text, 20) }</a>,
    }, {
      title: '申报奖项',
      dataIndex: 'apply_award',
      key: 'apply_award',
      render: text => suffix(text, 20),
    }, {
      title: '奖项状态',
      dataIndex: 'award_state',
      key: 'award_state',
      render: (state) => (
        state ? '开启' : '关闭'
      )
    }, {
      title: '申报人/团队',
      dataIndex: 'apply_info',
      key: 'apply_info',
      render: text => suffix(text, 20),

    }, {
      title: '申报状态 ',
      dataIndex: 'state',
      key: 'state',
      render: (state) => (
        <span>
      { stateEnum[state] }
    </span>
      )
    }, {
      title: '申报时间',
      dataIndex: 'apply_time',
      key: 'apply_time'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
      { record.state == -1 ? <a onClick={ () => this.toApply(record.award_id) }>申报</a> : '' }
          { record.state == 0 || record.state == 2 ?
            <a onClick={ () => this.toEdit(record.apply_id) }>编辑</a> : '' }
          { record.state == 1 ? (<div><a onClick={ () => this.toEdit(record.apply_id) }>编辑</a>
            <Divider type="vertical"/>
            <a onClick={ () => this.toEdit(record.apply_id, true) }>重新申请</a>
          </div>) : '' }
          { record.state == 3 || record.state === 4 ?
            <a onClick={ () => this.toDetail(record.apply_id) }>查看</a> : '' }
    </span>
      ),
    }]
  }

  pageChange(page) {
    this.props.getAwardList(page)
  }

  toApply(award_id) {
    const {push} = this.props.history
    const path = {
      pathname: `/applyDetail/${ award_id }`,
      query: {
        type: 'apply'
      }
    }
    push(path)
  }

  toEdit(apply_id, reapply = false) {
    const {push} = this.props.history
    const path = {
      pathname: `/applyDetail/${ apply_id }`,
      query: {
        type: 'edit',
        reapply: reapply
      }
    }
    push(path)
  }

  toDetail(apply_id) {
    const {push} = this.props.history
    const path = {
      pathname: `/applyDetail/${ apply_id }`,
      query: {
        type: 'detail'
      }
    }
    push(path)
  }


  openSpin() {
    this.setState({
      spin: true
    })
  }

  closeSpin() {
    this.setState({
      spin: false
    })
  }

  onChange(page = 1) {
    this.openSpin()
    const {getAwardList} = this.props
    getAwardList(page, () => {
      this.closeSpin()

    })
  }

  render() {
    const {RangePicker} = DatePicker
    const {applyList, total, currentPage} = this.props
    const pagination = {
      total: total,
      showTotal: (total) => `总共${ total }个`,
      pageSize: 10,
      onChange: (page) => this.pageChange(page),
      current: currentPage
    }
    return (
      <div className='apply-background'>
        <Breadcrumb style={ {marginBottom: 40} }>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>个人中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>我的申报</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Form layout="inline">
          <Form.Item
            label="申报奖项">
            <Input
              type="text"
              size='small'
              style={ {width: '80%', marginRight: '3%'} }
            />
          </Form.Item>
          <Form.Item
            label="审核状态">
            <Dropdown overlay={ () =>
              <Menu onClick={ onClickSearchApplyState }>
                { this.state.ApplyState.map((item) =>
                  <Menu.Item key={ item.key }
                             onClick={ onClickSearchApplyState }>{ item.applyName }</Menu.Item>
                ) }
              </Menu>
            }>
              <a className="ant-dropdown-link" href="#">
                { this.state.ApplyState[this.state.searchCurrentApplyState].applyName } <Icon
                type="down"/>
              </a>
            </Dropdown>
          </Form.Item>
          <Form.Item
            label="申报时间"
            style={ {marginLeft: '20px'} }
          >
            <RangePicker/>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={ {marginLeft: '20px'} }
            >
              查询
            </Button>
          </Form.Item>
        </Form>
        <Spin spinning={ this.state.spin }>
          <Table columns={ this.columns } dataSource={ applyList } style={ {marginTop: '30px'} }/>
        </Spin>
      </div>
    );
  }

  componentDidMount() {
    this.openSpin()
    this.props.getAwardList(1, () => {
      this.closeSpin()
    })
  }

  onClickSearchApplyState() {
    console.log('123')
    // console.log(key)
  }
}

const mapState = (state) => ({
  applyList: state.apply.applyList,
  total: state.apply.count,
  currentPage: state.apply.currentPage

})

const mapDispatch = (dispatch) => ({
  getAwardList(page = 1, cb) {
    const action = actionCreators.getAwardList(page, cb)
    dispatch(action)
  }
})

export default connect(mapState, mapDispatch)(Apply);