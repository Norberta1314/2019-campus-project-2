import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style.scss'
import {Form, Modal, Spin, Table, Tag} from 'antd';
import * as actionCreators from "./store/actionCreators";
import {levelEnum, stateEnum} from "../../utils/utils";


class awardDetail extends Component {
    static defaultProps = {
        showApply: true
    }
    state = {
        visible: false,
        show: {},
        spin: false
    }

    constructor(props) {
        super(props)
        this.columns_detail = [{
            title: '奖项名称',
            dataIndex: 'item',
            key: 'item',
            width: 100
        }, {
            title: '运营安全组2017年Q3季度奖评选',
            dataIndex: 'detail',
            key: 'detail',
            render: (values, record) => {
                if (record.item === '审核人') {
                    return (<span>
          {values.map(value => <Tag color="blue" key={value}>{value}</Tag>)} </span>)
                }

                if (record.item === '参评要求') {
                    return (
                        <div dangerouslySetInnerHTML={{__html: values}}/>
                    )
                }
                return values


            }
        }]
        this.columns = [
            {
                title: '申报人/团队',
                dataIndex: 'name',
                key: 'name',
                render: text => <a href="javascript:;">{text}</a>,
            }, {
                title: '申报状态',
                dataIndex: 'state',
                key: 'state',
                render: (value) => (stateEnum[value])
            }, {
                title: '申报时间',
                dataIndex: 'apply_time',
                key: 'apply_time'
            }, {
                title: '事迹介绍',
                dataIndex: 'apply_des',
                key: 'apply_des',
                render: (value) => (value.slice(0, 20) + '...')
            }, {
                title: '上传附件',
                dataIndex: 'attachment',
                key: 'attachment',
                render: (value) => (
                    value == '-1' ? '无附件' : (
                        <a href={value.url} target='_blank' >{value.attachment_name}</a>
                    )
                )
            }, {
                title: '评语',
                dataIndex: 'remark',
                key: 'remark',
                render: (value) => (value.slice(0, 20) + '...')
            }, {
                title: '操作',
                key: 'action',
                render: (_, record) => {
                    return (<a onClick={() => this.showModal(record)}>查看</a>)
                }
            }
        ]
    }

    componentWillMount() {
        this.openSpin()

        const {match} = this.props
        const {getDetail} = this.props
        getDetail(match.params.id, () => {
            this.closeSpin()
        })
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

    showModal = (show) => {
        this.setState({
            visible: true,
            show
        });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const {detail} = this.props
        const {show} = this.state
        const data = [{
            item: '奖项名称',
            detail: detail.name
        }, {
            item: '参评要求',
            detail: detail.content
        }, {
            item: '审核人',
            detail: detail.heads || []
        }, {
            item: '状态',
            detail: detail.is_active ? '生效中' : '已失效'
        }, {
            item: '奖项级别',
            detail: levelEnum[detail.level]
        }, {
            item: '所属组织',
            detail: detail.organization
        }, {
            item: '开始日期',
            detail: detail.start_time
        }, {
            item: '结束日期',
            detail: detail.end_time
        },]
        return (
            <div className='layout-background'>
                <Spin spinning={this.state.spin}>
                    <Table columns={this.columns_detail} dataSource={data} showHeader={false}
                           style={{marginTop: '30px'}}
                           pagination={false}/>
                    {
                        this.props.showApply ? (
                            <Table columns={this.columns} dataSource={detail.applys} style={{marginTop: '30px'}}
                                   pagination={false}/>
                        ) : ''
                    }

                    {
                        this.state.visible ? (
                            <Modal
                                title="详细信息"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                                <Form>
                                    <Form.Item label='获奖人/团队'>
                                        <p>{show.name}</p>
                                    </Form.Item>
                                    <Form.Item label='事迹介绍'>
                                        <p>{show.apply_des}</p>
                                    </Form.Item>
                                    <Form.Item label='附件'>
                                        {show.attachment === -1 ? '无附件' : (
                                            <a target='_blank' href={show.attachment.url}>{show.attachment.attachment_name}</a>
                                        )}
                                    </Form.Item>
                                    <Form.Item label='评审结果'>
                                        <p>{stateEnum[show.state]}</p>
                                    </Form.Item>
                                    <Form.Item label='评语'>
                                        <p>{show.remark}</p>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        ) : ''
                    }
                </Spin>
            </div>
        )
            ;
    }
}

const mapState = (state) => ({
    detail: state.awardDetail.detail
})

const mapDispatch = (dispatch) => ({
    getDetail(id, cb) {
        const action = actionCreators.getDetail(id, cb)
        dispatch(action)
    }
})

export default connect(mapState, mapDispatch)(awardDetail);