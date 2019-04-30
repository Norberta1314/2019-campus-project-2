import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Input, Dropdown, Menu, Icon, DatePicker, Table, Divider
} from 'antd'
import './style.scss'
import 'antd/dist/antd.css';

const onClickSearchApplyState = ({key}) => {

}
let stateList = ['不限', '生效中', '已过期']
let currentState = 0
const columns = [{
  title: '所属单位',
  dataIndex: 'organization',
  key: 'organization',
  render: text => <a href="javascript:;">{ text }</a>,
}, {
  title: '所属级别',
  dataIndex: 'level',
  key: 'level',
  render: (level) => (
    <span>
      { level === 0 ? <div>中心级</div> : <div>部门级</div> }
    </span>
  )
}, {
  title: '申报奖项',
  dataIndex: 'apply_award',
  key: 'apply_award',
}, {
  title: '状态',
  dataIndex: 'is_active',
  key: 'is_active',
  render: (is_active) => (
    <span>
      {is_active? <div>开启</div>:<div>结束</div>}
    </span>
  )
}, {
  title: '开始时间',
  dataIndex: 'start_time',
  key: 'start_time'
}, {
  title: '申报时间',
  dataIndex: 'apply_time',
  key: 'apply_time'
}, {
  title: '申报人数',
  dataIndex: 'apply_count',
  key: 'apply_count'
}, {
  title: '获奖人数',
  dataIndex: 'apply_award_count',
  key: 'apply_award_count'
}, {
  title: '操作',
  key: 'action',
  render: () => (
    <span>
      <a href="javascript:;">查看</a>
      <Divider type="vertical"/>
      <a href="javascript:;">克隆</a>
      <Divider type="vertical"/>
      <a href="javascript:;">编辑</a>
      <Divider type="vertical"/>
      <a href="javascript:;">删除</a>
    </span>
  ),
}]

const applyList = [{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  level:0,
  apply_award: '季度之星',
  is_active: true,
  award_state: '生效中',
  apply_time: '2014-12-31 18:20:1',
  start_time: '2014-12-31 18:20:1',
  apply_count: 10,
  apply_award_count: 1
}, {
  apply_id: '1',
  organization: '蓝鲸产品中心',
  level:0,
  apply_award: '季度之星',
  is_active: true,
  award_state: '生效中',
  apply_time: '2014-12-31 18:20:1',
  start_time: '2014-12-31 18:20:1',
  apply_count: 10,
  apply_award_count: 1
},{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  level:0,
  apply_award: '季度之星',
  is_active: true,
  award_state: '生效中',
  apply_time: '2014-12-31 18:20:1',
  start_time: '2014-12-31 18:20:1',
  apply_count: 10,
  apply_award_count: 1
},{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  level:0,
  apply_award: '季度之星',
  is_active: true,
  award_state: '生效中',
  apply_time: '2014-12-31 18:20:1',
  start_time: '2014-12-31 18:20:1',
  apply_count: 10,
  apply_award_count: 1
},{
  apply_id: '1',
  organization: '蓝鲸产品中心',
  level:0,
  apply_award: '季度之星',
  is_active: true,
  award_state: '生效中',
  apply_time: '2014-12-31 18:20:1',
  start_time: '2014-12-31 18:20:1',
  apply_count: 10,
  apply_award_count: 1
}]

class Award extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ApplyState: [
        {key: 1, applyName: '生效中'},
        {key: 2, applyName: '已过期'},
      ],
      searchCurrentApplyState: 1,
    }
    this.onClickSearchApplyState = this.onClickSearchApplyState.bind(this)
  }

  render() {
    const {RangePicker} = DatePicker

    return (
      <div className='award-background'>
        <Form layout='inline'>
          <Form.Item>
            <Button>批量克隆</Button>
          </Form.Item>
          <Form.Item>
          <Button>新增</Button>
        </Form.Item>
        </Form>
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
            label="所属组织">
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

export default connect(mapState, mapDispatch)(Award);