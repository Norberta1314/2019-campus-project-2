import React, { Component } from 'react';
import { Divider, Table, Button, Breadcrumb } from 'antd';

const columns = [{
  title: '所属单位',
  dataIndex: 'organization',
  key: 'organization',
  render: text => <a href="javascript:;">{ text }</a>,
}, {
  title: '负责人',
  dataIndex: 'head',
  key: 'head',
}, {
  title: '参评人员',
  dataIndex: 'eva_member',
  key: 'eva_member'
}, {
  title: '更新人 ',
  dataIndex: 'up_member',
  key: 'up_member',
}, {
  title: '申报时间',
  dataIndex: 'apply_time',
  key: 'apply_time'
}, {
  title: '操作',
  key: 'action',
  render: () => (
    <div>
      <a href="javascript:;">编辑</a>
      <Divider type="vertical"/>
      <a href="javascript:;">删除</a>
    </div>
  ),
}]

const OrginzationList = [{
  organization: '蓝鲸产品中心',
  head: ['邹伟'],
  eva_member: ['赖铭'],
  up_member: 'admin',
  apply_time: '2014-12-31 18:20:1'
}, {
  organization: '蓝鲸产品中心',
  head: ['赖铭'],
  eva_member: ['邹伟'],
  up_member: 'admin',
  apply_time: '2014-12-31 18:20:1'
}, {
  organization: '蓝鲸产品中心',
  head: ['邹伟'],
  eva_member: ['赖铭'],
  up_member: 'admin',
  apply_time: '2014-12-31 18:20:1'
}, {
  organization: '蓝鲸产品中心',
  head: ['赖铭'],
  eva_member: ['邹伟'],
  up_member: 'admin',
  apply_time: '2014-12-31 18:20:1'
}]

class Organization extends Component {
  render() {
    return (
      <div className='check-background'>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">系统管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">组织管理</a>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Button style={ {marginTop: '30px'} }>添加</Button>
        <Table columns={ columns } dataSource={ OrginzationList } style={ {marginTop: '30px'} }/>

      </div>
    );
  }
}

export default Organization;