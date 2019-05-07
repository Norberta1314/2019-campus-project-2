import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Input, Dropdown, Menu, Icon, DatePicker, Table, Divider
} from 'antd'
import { Link } from 'react-router-dom';
import './style.scss'
import 'antd/dist/antd.css';
import * as actionCreators from './store/actionCreators'

const onClickSearchApplyState = ({key}) => {

}
let stateList = ['未申报', '申报中', '未通过', '已通过', '未获奖', '已获奖']
let currentState = 0
const columns = [{
  title: '所属单位',
  dataIndex: 'organization',
  key: 'organization',
  render: text => <a href="javascript:;">{ text }</a>,
}, {
  title: '申报奖项',
  dataIndex: 'apply_award',
  key: 'apply_award',
}, {
  title: '奖项状态',
  dataIndex: 'award_state',
  key: 'award_state'
}, {
  title: '申报人/团队',
  dataIndex: 'apply_info',
  key: 'apply_info'
}, {
  title: '申报状态 ',
  dataIndex: 'state',
  key: 'state',
  render: (state) => (
    <span>
      <div>{ stateList[state + 1] }</div>
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
      { record.state === -1 ? <Link to={'/newApply/' + record.apply_id}>申报</Link> : '' }
      { record.state === 0 || record.state === 2 ? <Link to={'/editApply/' + record.apply_id}>编辑</Link> : '' }
      { record.state === 1 ? <div><Link to={'/editApply/' + record.apply_id}>编辑</Link>
        <Divider type="vertical"/>
        <Link to={'/newApply/' + record.apply_id}>重新申请</Link>
      </div> : '' }
      { record.state === 3 || record.state === 4 ? <Link to={'/applyDetail/' + record.apply_id}>查看</Link>  : '' }
    </span>
  ),
}]

const applyList = [{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: -1,
  apply_time: '2014-12-31 18:20:1',
}, {
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 0,
  apply_time: '2014-12-31 18:20:1',
}, {
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 1,
  apply_time: '2014-12-31 18:20:1',
}, {
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 2,
  apply_time: '2014-12-31 18:20:1',
}, {
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 3,
  apply_time: '2014-12-31 18:20:1',
}, {
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 4,
  apply_time: '2014-12-31 18:20:1',
}]

class Apply extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ApplyState: [
        {key: 1, applyName: '不限'},
        {key: 2, applyName: '未审核'},
        {key: 3, applyName: '审核中'},
        {key: 4, applyName: '未通过'},
        {key: 5, applyName: '通过'},
        {key: 6, applyName: '已获奖'},
        {key: 7, applyName: '未获奖'}
      ],
      searchCurrentApplyState: 1,
    }
    this.onClickSearchApplyState = this.onClickSearchApplyState.bind(this)
  }

  render() {
    const {RangePicker} = DatePicker

    return (
      <div className='apply-background'>
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
                  <Menu.Item key={ item.key } onClick={ onClickSearchApplyState }>{ item.applyName }</Menu.Item>
                ) }
              </Menu>
            }>
              <a className="ant-dropdown-link" href="#">
                { this.state.ApplyState[this.state.searchCurrentApplyState].applyName } <Icon type="down"/>
              </a>
            </Dropdown>
          </Form.Item>
          <Form.Item
            label="申报时间"
            style={ {marginLeft: '20px'} }
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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
        <Table columns={ columns } dataSource={ applyList } style={ {marginTop: '30px'} }/>
      </div>
    );
  }

  onClickSearchApplyState() {
    console.log('123')
    // console.log(key)
  }
}

const mapState = (state) => ({})

const mapDispatch = (dispatch) => ({})

export default connect(mapState, mapDispatch)(Apply);