import React, {Component} from 'react';
import connect from 'react-redux/es/connect/connect';
import './style.scss'
import AwardDetail from '../../common/awardDetail'
import {Form, Steps, Input, Upload, Button, Icon, Breadcrumb, Table, Tag} from 'antd';
import {levelEnum} from "../../utils/utils";
import * as actionCreators from "./store/actionCreators";
import {toApplyAward} from "../../services/api";
import {baseURL} from "../../utils/request";
import {get} from "../../utils/cookie";


const applyEnum = {
    0: 'apply',
    1: 'edit',
    2: 'detail'
}

//申报
class applyDetail extends Component {

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
                    console.log(values)
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
    }

    componentWillMount() {
        console.log(this.props)
        const {query} = this.props.location
        const {match} = this.props
        if (query.type === 'apply') {
            this.props.getApply(match.params.id)
        }

        if (query.type === 'edit') {
            this.props.getDetail(match.params.id, 1)
        }

        if (query.type === 'detail') {
            this.props.getDetail(match.params.id, 2)
        }
    }


    handleSubmit() {
        const form = this.props.form;
        form.validateFields(async (err, values) => {
            console.log(values)
            if (!err) {
                const attachment_id = !this.props.awardDetail.have_attachment ? -1 : values.upload.length > 0 ? values.upload[0].attachment_id : -1
                const data = {
                    attachment_id: attachment_id,
                    apply_info: values.apply_info,
                    apply_des: values.apply_des
                }
                console.log(data)
                this.applyAward(data)
            }


        });
    }


    applyAward(data) {
        toApplyAward({id: this.props.awardDetail.id, data: data})
        const {goBack} = this.props.history
        goBack()

    }

    normFile(e) {
        let fileList = [...e.fileList]
        fileList = fileList.slice(-1)
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
                file = Object.assign(file, {attachment_id: file.response.attachment_id})
            }
            return file;
        });
        return fileList
    }

    render() {

        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14}
        }



        const uploadProps = {
            action: baseURL + 'attachment',
            withCredentials: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': get('csrftoken'),
            },
            name: 'file',
            onChange({file, fileList}) {
                if (file.status !== 'uploading') {
                    console.log(file, fileList);
                }
            },
            defaultFileList: [],
        };
        const {match, awardDetail, form} = this.props

        const {getFieldDecorator} = form;

                const data = [{
            item: '奖项名称',
            detail: awardDetail.name
        }, {
            item: '参评要求',
            detail: awardDetail.content
        }, {
            item: '审核人',
            detail: awardDetail.heads || []
        }, {
            item: '状态',
            detail: awardDetail.is_active ? '生效中' : '已失效'
        }, {
            item: '奖项级别',
            detail: levelEnum[awardDetail.level]
        }, {
            item: '所属组织',
            detail: awardDetail.organization
        }, {
            item: '开始日期',
            detail: awardDetail.start_time
        }, {
            item: '结束日期',
            detail: awardDetail.end_time
        },]
        return (
            <div className='Apply-background'>
                <Breadcrumb style={{marginBottom: 40}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">个人中心</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">我的申报</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">申报详情</a>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Table columns={this.columns_detail} dataSource={data} showHeader={false} style={{marginTop: '30px'}}
                       pagination={false}/>
                <Steps current={0} style={{marginTop: 40}}>
                    <Steps.Step title="申报" description="开始申报"/>
                    <Steps.Step title="审核"/>
                    <Steps.Step title="评奖"/>
                </Steps>

                <Form layout='horizontal' style={{marginTop: 40}}>
                    <Form.Item
                        {...formItemLayout}
                        label='申报人/社团'>
                        {getFieldDecorator('apply_info', {
                            rules: [{required: true, message: '填写申报人/社团'}],
                        })(
                            <Input placeholder='填写申报人/社团'/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label='事迹介绍'>
                        {getFieldDecorator('apply_des', {
                            rules: [{required: true, message: '请填写事迹介绍'}],
                        })(
                            <Input.TextArea autosize={{minRows: 6, maxRows: 16}}/>)}

                    </Form.Item>
                    {
                        awardDetail.have_attachment ? (
                            <Form.Item
                                labelCol={{span: 4}}
                                label='附件'
                            >
                                {getFieldDecorator('upload', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                })(
                                    <Upload {...uploadProps}>
                                        <Button>
                                            <Icon type="upload"/> 上传
                                        </Button>
                                    </Upload>)}
                            </Form.Item>
                        ) : ''

                    }

                    <Form.Item style={{marginLeft: 450}}>
                        <Button type="primary" style={{marginRight: 30}}
                                onClick={() => this.handleSubmit()}>我要申报</Button>
                        <Button type="primary" onClick={() => this.props.history.goBack()}>取消</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}


const mapState = (state) => ({
    awardDetail: state.applyDetail.awardDetail,
    apply: state.applyDetail.apply,
    type: state.applyDetail.type
})

const mapDispatch = (dispatch) => ({
    getDetail(id, type) {
        const action = actionCreators.getApply(id, type)
        dispatch(action)
    },

    getApply(id) {
        const action = actionCreators.getDetail(id)
        dispatch(action)
    }
})

const applyForm = Form.create({})(applyDetail)


export default connect(mapState, mapDispatch)(applyForm);