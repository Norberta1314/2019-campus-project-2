import React, {Component} from 'react';
import connect from 'react-redux/es/connect/connect';
import {Breadcrumb, Divider, Popconfirm, Spin, Table} from 'antd';
import './style.scss'
import {Link} from 'react-router-dom';
import * as actionCreators from "./store/actionCreators";
import {passApply, rejectApply} from "../../services/api";
import {stateEnum} from "../../utils/utils";


class Check extends Component {
    state = {
        spin: false
    }

    constructor(props) {
        super(props)
        this.columns = [{
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
      <div>{stateEnum[state]}</div>
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
      {record.state === '1' || record.state === '3' || record.state === '4' ? <span>--</span> : ''}
                    {record.state === '0' ? <div>
                        <Popconfirm title="你确定通过嘛？" okText="通过" cancelText="取消"
                                    onConfirm={() => this.passApply(record.apply_id)}
                        >
                            <a href="javascript:;">通过</a>
                        </Popconfirm>
                        <Divider type="vertical"/>
                        <Popconfirm title="你确定通过嘛？" okText="通过" cancelText="取消"
                                    onConfirm={() => this.rejectApply(record.apply_id)}
                        >
                            <a href="javascript:;">驳回</a>
                        </Popconfirm>
                    </div> : ''}
                    {record.state === '2' ? <Link to={'/checkDetail/' + record.apply_id}>评奖</Link> : ''}
    </span>
            ),
        }]
    }

    async passApply(id) {
        await passApply(id)
        const {changePage} = this.props
        changePage(this.props.currentPage)

    }

    async rejectApply(id) {
        await rejectApply(id)
        const {changePage} = this.props
        changePage(this.props.currentPage)
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

    componentWillMount() {
        this.openSpin()
        const {changePage} = this.props
        changePage(1, () => {
            this.closeSpin()
        })
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
                <Spin spinning={this.state.spin}>
                    <Table columns={this.columns} dataSource={data} style={{marginTop: '30px'}}
                           pagination={pagination}/>
                </Spin>
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
    changePage(page = 1, cb) {
        const action = actionCreators.changePageData(page, cb)
        dispatch(action)
    }
})

export default connect(mapState, mapDispatch)(Check);