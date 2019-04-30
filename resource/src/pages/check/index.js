import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { Divider, Table } from 'antd';
import './style.scss'

let stateList = [ '申报中', '未通过', '已通过', '未获奖', '已获奖']
const columns = [{
  title: '所属单位',
  dataIndex: 'organization',
  key: 'organization',
  render: text => <a href="javascript:;">{ text }</a>,
}, {
  title: '申报奖项',
  dataIndex: 'apply_award',
  key: 'apply_award',
},{
  title: '申报人/团队',
  dataIndex: 'apply_info',
  key: 'apply_info'
}, {
  title: '申报状态 ',
  dataIndex: 'state',
  key: 'state',
  render: (state) => (
    <span>
      <div>{ stateList[state] }</div>
    </span>
  )
}, {
  title: '申报时间',
  dataIndex: 'apply_time',
  key: 'apply_time'
}, {
  title: '操作人',
  dataIndex: 'op_user',
  key: 'op_user'
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      { record.state === 1 || record.state === 3 || record.state === 4 ? <span>--</span> : '' }
      { record.state === 0 ? <div><a href="javascript:;">通过</a>
        <Divider type="vertical"/>
        <a href="javascript:;">驳回</a>
      </div> : '' }
      { record.state === 2 ? <a href="javascript:;">评奖</a> : '' }
    </span>
  ),
}]

const checkList = [{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 0,
  op_user: '美男',
  apply_time: '2014-12-31 18:20:1',
},{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 1,
  op_user: '美男',
  apply_time: '2014-12-31 18:20:1',
},{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state:2,
  op_user: '美男',
  apply_time: '2014-12-31 18:20:1',
},{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 3,
  op_user: '美男',
  apply_time: '2014-12-31 18:20:1',
},{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 4,
  op_user: '美男',
  apply_time: '2014-12-31 18:20:1',
},{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  apply_award: '季度之星',
  award_state: '生效中',
  apply_info: '黄树华',
  state: 4,
  op_user: '美男',
  apply_time: '2014-12-31 18:20:1',
},]


class Check extends Component {
  render() {
    return (
      <div className='check-background'>
        <Table columns={ columns } dataSource={ checkList } style={ {marginTop: '30px'} }/>
      </div>
    );
  }
}

const mapState = (state) => ({})

const mapDispatch = (dispatch) => ({})

export default connect(mapState, mapDispatch)(Check);