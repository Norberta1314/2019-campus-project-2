import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Input, Dropdown, Menu, Icon, DatePicker, Table, Divider, Breadcrumb, Popconfirm, Spin
} from 'antd'
import './style.scss'
import 'antd/dist/antd.css';
import * as actionCreators from './store/actionCreators';
import { dAward } from '../../services/api';
import { levelEnum, suffix } from '../../utils/utils';
import { Link } from 'react-router-dom';

const onClickSearchApplyState = ({key}) => {

}
let stateList = ['不限', '生效中', '已过期']
let currentState = 0

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${ selectedRowKeys }`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

class Award extends Component {
  state = {
    spin: false
  }

  constructor(props) {
    super(props)
    this.state = {
      ApplyState: [
        {key: 1, applyName: '生效中'},
        {key: 2, applyName: '已过期'},
      ],
      searchCurrentApplyState: 1,
      cloneList: []
    }
    this.toCreate = this.toCreate.bind(this)
    this.columns = [{
      title: '所属单位',
      dataIndex: 'organization',
      key: 'organization',
      render: text => <a href="javascript:;">{ suffix(text, 20) }</a>,
    }, {
      title: '所属级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <span>
      { levelEnum[level] }
    </span>
      )
    }, {
      title: '申报奖项',
      dataIndex: 'name',
      key: 'name',
      render: text => suffix(text, 20),

    }, {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <span>
      { is_active ? <div>开启</div> : <div>结束</div> }
    </span>
      )
    }, {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time'
    }, {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time'
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
      render: (_, record) => (
        <span>
      <a href="javascript:;" onClick={ () => this.detail(record.id) }>查看</a>
      <Divider type="vertical"/>
      <a href="javascript:;" onClick={ () => this.toClone(record.id) }>克隆</a>
      <Divider type="vertical"/>
      <a href="javascript:;" onClick={ () => this.edit(record.id) }>编辑</a>
      <Divider type="vertical"/>
      <Popconfirm title="你确定要删除这个奖项嘛？" okText="删除" cancelText="取消"
                  onConfirm={ () => this.deleteAward(record.id) }>
          <a href="javascript:;">删除</a>
      </Popconfirm>

    </span>
      ),
    }]
    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          cloneList: selectedRows
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
  }

  componentWillMount() {
    this.openSpin()
    const {changePage} = this.props
    changePage(1, () => {
      this.closeSpin()
    })
  }

  async deleteAward(id) {
    await dAward(id)
    const {changePage} = this.props
    changePage()
  }

  edit(id) {
    const {push} = this.props.history
    push(`/editAward/${ id }`)
  }


  detail(id) {
    const {push} = this.props.history
    push(`/award/${ id }`)
  }


  toClone(id) {
    const {push} = this.props.history
    const path = {
      pathname: `/editAward/${ id }`,
      query: {
        type: 'clone'
      }
    }
    push(path)
  }

  toCreate() {
    const {push} = this.props.history
    push('/editAward/')
  }

  toCloneAward() {
    const {push} = this.props.history
    const path = {
      pathname: '/cloneAward',
      query: {
        cloneList: this.state.cloneList
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
    const {changePage} = this.props
    changePage(page, () => {
      this.closeSpin()
    })
  }


  render() {
    const {RangePicker} = DatePicker
    const {total, data, currentPage} = this.props

    let pagination = {
      total: total,
      showTotal: (total) => `总共${ total }个奖项`,
      pageSize: 10,
      onChange: (page) => this.onChange(page),
      current: currentPage
    }
    return (
      <div className='award-background'>
        <Breadcrumb style={ {marginBottom: 40} }>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>系统管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>奖项管理</a>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Form layout='inline'>
          <Form.Item>
            <Button><a onClick={ () => this.toCloneAward() }>批量克隆</a> </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={ () => this.toCreate() }>新增</Button>
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
                  <Menu.Item key={ item.key }
                             onClick={ onClickSearchApplyState }>
                    { item.applyName }
                  </Menu.Item>
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
          <Table columns={ this.columns } dataSource={ data } style={ {marginTop: '30px'} }
                 pagination={ pagination } rowSelection={ this.rowSelection } rowKey='id'/>
        </Spin>
      </div>
    );
  }


}

const mapState = (state) => ({
  data: state.award.data,
  total: state.award.count,
  currentPage: state.award.currentPage
})

const mapDispatch = (dispatch) => ({
  changePage(page = 1, cb) {
    const action = actionCreators.changePageData(page, cb)
    dispatch(action)
  }
})
export default connect(mapState, mapDispatch)(Award);