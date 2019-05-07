import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Input, Dropdown, Menu, Icon, DatePicker, Table, Divider
} from 'antd'
import { Link } from 'react-router-dom';
import './style.scss'
import 'antd/dist/antd.css';
import * as actionCreators from './store/actionCreators'
import awardList1 from '../../statics/1.jpg'
import awardList2 from '../../statics/2.jpg'
import awardList3 from '../../statics/3.jpg'

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
  title: '申报人/团队',
  dataIndex: 'apply_info',
  key: 'apply_info'
}, {
  title: '申报时间',
  dataIndex: 'apply_time',
  key: 'apply_time'
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Link to={ '/applyDetail/' + record.apply_id }>查看</Link>
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

class Home extends Component {
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
      awardList: [{
        award_id: 1,
        img: awardList1,
        award_title: '运营安全组2017年Q3季度奖评选'
      }, {
        award_id: 1,
        img: awardList2,
        award_title: '运营安全组2017年Q3季度奖评选'
      }, {
        award_id: 1,
        img: awardList3,
        award_title: '运营安全组2017年Q3季度奖评选'
      }],
      searchCurrentApplyState: 1,
    }
    this.onClickSearchApplyState = this.onClickSearchApplyState.bind(this)
  }

  render() {
    const {RangePicker} = DatePicker

    return (
      <div className='home-background'>
        <div className='title'>
          当前可申报奖项
        </div>
        <div className='currentAward'>
          { this.state.awardList.map((item) => (
            <div className='awardList'>
              <img className='awardImg' src={ item.img } alt=''/>
              <p>{ item.award_title }</p>
            </div>
          )) }
        </div>
        <div className='title'>
          上次获奖人名单
        </div>
        <Table columns={ columns } dataSource={ applyList } style={ {marginTop: '30px'} }/>
      </div>
    );
  }

  componentDidMount() {
    this.props.changeUserPer
  }

  onClickSearchApplyState() {
    console.log('123')
    // console.log(key)
  }
}

const mapState = (state) => ({})

const mapDispatch = (dispatch) => ({
  changeUserPer() {
    const action = actionCreators.changeUserPer()
    dispatch(action)
  }
})

export default connect(mapState, mapDispatch)(Home);