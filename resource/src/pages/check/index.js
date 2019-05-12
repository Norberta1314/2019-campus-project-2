import React, {Component} from 'react';
import connect from 'react-redux/es/connect/connect';
import {Breadcrumb, Divider, Table} from 'antd';
import './style.scss'
import {Link} from 'react-router-dom';
import * as actionCreators from "./store/actionCreators";

let stateList = ['申报中', '未通过', '已通过', '未获奖', '已获奖']
const columns = [{
    title: '所属单位',
    dataIndex: 'organization',
    key: 'organization',
    render: text => <a href="javascript:;">{text}</a>,
}, {
    title: '申报奖项',
    dataIndex: 'apply_award',
    key: 'apply_award',
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
      <div>{stateList[state]}</div>
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
      {record.state === 1 || record.state === 3 || record.state === 4 ? <span>--</span> : ''}
            {record.state === 0 ? <div><a href="javascript:;">通过</a>
                <Divider type="vertical"/>
                <a href="javascript:;">驳回</a>
            </div> : ''}
            {record.state === 2 ? <Link to={'/checkDetail/' + record.apply_id}>评奖</Link> : ''}
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
}, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 1,
    op_user: '美男',
    apply_time: '2014-12-31 18:20:1',
}, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 2,
    op_user: '美男',
    apply_time: '2014-12-31 18:20:1',
}, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 3,
    op_user: '美男',
    apply_time: '2014-12-31 18:20:1',
}, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 4,
    op_user: '美男',
    apply_time: '2014-12-31 18:20:1',
}, {
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

    componentWillMount() {
        const {changePage} = this.props
        changePage()
    }

    render() {

        const {total, data, currentPage} = this.props

        let pagination = {
            total: total,
            showTotal: (total) => `总共${total}个申请`,
            pageSize: 10,
            onChange: this.pageChange,
            current: currentPage
        }
        return (
            <div className='check-background'>
                <Breadcrumb style={{marginBottom: 40}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">个人中心</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">我的审核</a>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Table columns={columns} dataSource={data} style={{marginTop: '30px'}} pagination={pagination}/>
            </div>
        );
    }
}

const mapState = (state) => ({
    data: state.check.data,
    total: state.check.count,
    currentPage: state.check.currentPage
})

const mapDispatch = (dispatch) => ({
    changePage(page = 1) {
        const action = actionCreators.changePageData(page)
        dispatch(action)
    }
})

export default connect(mapState, mapDispatch)(Check);