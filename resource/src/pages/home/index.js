import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Form, Button, Input, Dropdown, Menu, Icon, DatePicker, Table, Divider, Card, Col, Row
} from 'antd'
import {Link} from 'react-router-dom';
import './style.scss'
import 'antd/dist/antd.css';
import * as actionCreators from './store/actionCreators'
import awardList1 from '../../statics/1.jpg'
import awardList2 from '../../statics/2.jpg'
import awardList3 from '../../statics/3.jpg'

const {Meta} = Card
let stateList = ['未申报', '申报中', '未通过', '已通过', '未获奖', '已获奖']
let currentState = 0
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
    title: '申报时间',
    dataIndex: 'apply_time',
    key: 'apply_time'
}, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <span>
      <Link to={'/applyDetail/' + record.apply_id}>查看</Link>
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
            awardList: [{
                award_id: 1,
                img: awardList1,
                award_title: '运营安全组2017年Q3季度奖评选',
                organization: 'xxxx',
                count: 12
            }, {
                award_id: 1,
                img: awardList1,
                award_title: '运营安全组2017年Q3季度奖评选',
                organization: 'xxxx',
                count: 12
            }, {
                award_id: 1,
                img: awardList1,
                award_title: '运营安全组2017年Q3季度奖评选',
                organization: 'xxxx',
                count: 12
            }, {
                award_id: 1,
                img: awardList1,
                award_title: '运营安全组2017年Q3季度奖评选',
                organization: 'xxxx',
                count: 12
            }, {
                award_id: 1,
                img: awardList1,
                award_title: '运营安全组2017年Q3季度奖评选',
                organization: 'xxxx',
                count: 12
            },],
            searchCurrentApplyState: 1,
        }
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
            showTotal: (total) => `总共${total}获奖`,
            pageSize: 10,
            onChange: this.pageChange,
            current: currentPage
        }



        return (
            <div className='home-background'>
                <div className='title'>
                    当前可申报奖项
                </div>
                <Row gutter={16}>
                    {applys.map((item, index) => {
                        if (index > 3) return
                        return (

                            <Col span={6}>
                                <Card
                                    hoverable
                                    style={{width: 200}}
                                    cover={<img alt={item.apply_award}
                                                src={awardList3}/>}
                                    actions={[<Button>申请</Button>]}
                                >
                                    <Meta
                                        title={item.organization}
                                        description={item.apply_award}
                                    />
                                    <Meta
                                        description={'提报人数:' + item.count}
                                    />
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                <div className='title'>
                    上次获奖名单
                </div>
                <Table columns={columns} dataSource={this.props.lastData} style={{marginTop: '30px'}} pagination={pagination}/>
            </div>
        );
    }

    componentDidMount() {
        this.props.changePage()
        this.props.changeUserPer()
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