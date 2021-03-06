import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Input, Dropdown, Menu, Icon, DatePicker, Table, Divider, Breadcrumb, Spin, Select
} from 'antd'
import { Link } from 'react-router-dom';
import './style.scss'
import 'antd/dist/antd.css';
import * as actionCreators from './store/actionCreators'
import { stateEnum, suffix } from '../../utils/utils';
import { queryApplys } from '../../services/api';

class Apply
  extends Component {
  state = {
    spin: false
  }

  constructor(props) {
    super(props)
    this.state = {
      ApplyState: [
        {key: 0, applyName: '不限'},
        {key: '-1', applyName: '未申请'},
        {key: '0', applyName: '审核中'},
        {key: '1', applyName: '未通过'},
        {key: '2', applyName: '通过'},
        {key: '4', applyName: '已获奖'},
        {key: '3', applyName: '未获奖'}
      ],
      searchCurrentApplyState: 1,
    }
    this.onClickSearchApplyState = this.onClickSearchApplyState.bind(this)
    this.columns = [
      {
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
    }
    ]
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

  handleSubmit() {
    const form = this.props.form;
    form.validateFields(async (err, values) => {
      if ( !err ) {
        // console.log(values)
        let data = {}

        if (values.apply_award) {
          data.apply_award = values.apply_award
        } else if (values.check_state) {
          data.check_state = values.check_state
        } else if (values.time) {
          data.start_time = values.time[0].format('YYYY-MM-DD')
          data.end_time = values.time[1].format('YYYY-MM-DD')
        }
        this.toSubmit(data)

      }
    })
  }

  async toSubmit(data) {
    const newApplyList = await queryApplys({query: data})
    this.props.setAwardList(newApplyList)
    console.log(newApplyList)
  }

  render() {
    const {RangePicker} = DatePicker
    const {applyList, total, currentPage, form} = this.props
    const {getFieldDecorator} = form;
    const Option = Select.Option;
    const pagination = {
      total: total,
      showTotal: (total) => `总共${ total }个`,
      pageSize: 10,
      onChange: (page) => this.onChange(page),
      current: currentPage
    }

    return (
      <div className='apply-background'>
        <Breadcrumb style={ {marginBottom: 40} }>
          <Breadcrumb.Item><Link to='/'>Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            个人中心
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            我的申报
          </Breadcrumb.Item>
        </Breadcrumb>
        <Form layout="inline">
          <Form.Item
            label="申报奖项">
            { getFieldDecorator('apply_award')(
              <Input
                type="text"
                size='small'
                style={ {width: '80%', marginRight: '3%'} }
              />
            ) }
          </Form.Item>
          <Form.Item
            label="审核状态">
            { getFieldDecorator('check_state')(
              <Select defaultValue={ '-1' } style={ {width: 120} }>
                {
                  this.state.ApplyState.map((item) => (
                    <Option value={ item.key }>{ item.applyName }</Option>
                  ))
                }
              </Select>
            ) }

          </Form.Item>
          <Form.Item
            label="申报时间"
            style={ {marginLeft: '20px'} }
          >
            { getFieldDecorator('time')(
              <RangePicker/>
            ) }

          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={ {marginLeft: '20px'} }
              onClick={ () => this.handleSubmit() }
            >
              查询
            </Button>
          </Form.Item>
        </Form>
        <Spin spinning={ this.state.spin }>
          <Table columns={ this.columns } dataSource={ applyList } style={ {marginTop: '30px'} } rowKey='award_id' pagination={ pagination }/>
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
  },
  setAwardList(newApplyList) {
    const action = actionCreators.setApplyList(newApplyList)
    dispatch(action)
  }
})

const applyForm = Form.create({})(Apply)

export default connect(mapState, mapDispatch)(applyForm);
