import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Input, Dropdown, Menu, Icon, DatePicker, Table, Divider, Card, Col, Row, Empty
} from 'antd'
import { Link } from 'react-router-dom';
import './style.scss'
import 'antd/dist/antd.css';
import * as actionCreators from './store/actionCreators'
import awardList1 from '../../statics/1.jpg'
import awardList2 from '../../statics/2.jpg'
import awardList3 from '../../statics/3.jpg'
import { suffix } from '../../utils/utils';

const {Meta} = Card
let stateList = ['未申报', '申报中', '未通过', '已通过', '未获奖', '已获奖']
let currentState = 0


class Home
  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchCurrentApplyState: 1,
    }

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
      title: '申报人/团队',
      dataIndex: 'apply_info',
      key: 'apply_info',
      render: text => suffix(text, 20),

    }, {
      title: '申报时间',
      dataIndex: 'apply_time',
      key: 'apply_time'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
      <a onClick={ () => this.detail(record.id) }>查看</a>
    </span>
      ),
    }]
  }

  detail(id) {
    const {push} = this.props.history
    const path = {
      pathname: `/applyDetail/${ id }`,
      query: {
        type: 'detail'
      }
    }
    push(path)
  }

  toApply(id) {
    const {push} = this.props.history
    const path = {
      pathname: `/applyDetail/${ id }`,
      query: {
        type: 'apply'
      }
    }
    push(path)
  }

  pageChange(page) {
    const {changePage} = this.props
    changePage(page)
  }

  render() {
    const {RangePicker} = DatePicker
    const {total, lastData, applys, currentPage} = this.props
    let pagination = {
      total: total,
      showTotal: (total) => `总共${ total }获奖`,
      pageSize: 10,
      onChange: (page) => this.pageChange(page),
      current: currentPage
    }

    const data = lastData.map((item) => {
      return {
        organization: item.award.organization,
        apply_award: item.award.name,
        apply_info: item.myapply.apply_info,
        apply_time: item.myapply.apply_time,
        id: item.myapply.id
      }
    })


    return (
      <div className='home-background'>
        <div className='title'>
          当前可申报奖项
        </div>
        <Row gutter={ 16 }>
          { applys.length > 0 ? applys.map((item, index) => {
            if ( index > 3 ) return
            return (

              <Col span={ 6 } key={index}>
                <Card
                  hoverable
                  style={ {width: 200} }
                  cover={ <img alt={ item.apply_award }
                               src={ awardList3 }/> }
                  actions={ [<Button onClick={ () => this.toApply(item.award_id) }>申请</Button>] }
                >
                  <Meta
                    title={ item.organization }
                    description={ item.apply_award }
                  />
                  <Meta
                    description={ '提报人数:' + item.count }
                  />
                </Card>
              </Col>
            )
          }) : <Empty/> }
        </Row>
        <div className='title'>
          上次获奖名单
        </div>
        <Table columns={ this.columns } dataSource={ data } style={ {marginTop: '30px'} } pagination={ pagination } rowKey='id'/>
      </div>
    );
  }

  componentDidMount() {
    this.props.changePage()
    // this.props.changeUserPer()
    this.props.getApplys()
  }

}

const mapState = (state) => ({
  lastData: state.home.lastData,
  total: state.home.count,
  currentPage: state.home.currentPage,
  applys: state.home.applys
})

const mapDispatch = (dispatch) => ({
  changeUserPer() {
    const action = actionCreators.changeUserPer()
    dispatch(action)
  },
  changePage(page = 1) {
    const action = actionCreators.changePage(page)
    dispatch(action)
  },
  getApplys() {
    const action = actionCreators.getApplys()
    dispatch(action)
  }
})

export default connect(mapState, mapDispatch)(Home);