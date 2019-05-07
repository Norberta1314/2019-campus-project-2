import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss'
import {Table} from 'antd';

const columns = [{
  title:'奖项名称',
  dataIndex: 'item',
  key: 'item',
  width: 100
}, {
  title:'运营安全组2017年Q3季度奖评选',
  dataIndex: 'detail',
  key: 'detail'
}]

const data = [{
  item:'奖项名称',
  detail:'运营安全组2017年Q3季度奖评选'
},{
  item: '参评要求',
  detail: '旨在表彰正确传承公司企业文化精神、精确执行BG本年度管理战略的团队，具体评选标准如下：\n' +
    ' 该项目或产品能够支撑公司及BG战略目标的实现；\n' +
    ' 该项目或产品达到如下精品的标准：\n' +
    '※ 满足甚至超越目标用户的需求；\n' +
    '※ 功能简单易用，有独特的价值和体验，且细节做到极致；\n' +
    '※ 能体现产品功能背后的人文关怀；\n' +
    '※ 至少有1个或以上的口碑传播点。'
},{
  item:'奖金',
  detail: '2000'
},{
  item: '审核人',
  detail: 'xyz'
},{
  item: '状态',
  detail: '生效中'
},{
  item: '奖项级别',
  detail: '部门级'
},{
  item: '所属组织',
  detail: '蓝鲸产品中心'
},{
  item: '开始日期',
  detail: '2017-11-01'
},{
  item: '结束日期',
  detail: '2017-11-30'
},]

class awardDetail extends Component {
  render() {
    return (
      <div>
        <Table columns={ columns } dataSource={ data } showHeader={false} style={ {marginTop: '30px'} }/>
      </div>
    );
  }
}

function mapStatetoProps(state) {

}

function mapDispatch() {

}

export default connect(mapStatetoProps, mapDispatch)(awardDetail);