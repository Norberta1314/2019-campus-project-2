import React, {Component} from 'react';
import connect from 'react-redux/es/connect/connect';
import './style.scss'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import {Breadcrumb, Button, Form, Icon, Input, DatePicker, Select, Upload, Switch, Row, Spin} from "antd";
import * as actionCreators from './store/actionCreators'
import {cAward, queryAward, uAward} from "../../services/api";
import moment from "moment";
import {Link} from "react-router-dom";

const {Option} = Select;
const {MonthPicker, RangePicker} = DatePicker;

const TypeEnum = {
    0: '创建',
    1: '更新'
}

class EditAward extends Component {
    state = {
        type: 0,
        spin: false
    }

    constructor(props) {
        super(props)


    }

    async componentWillMount() {
        this.openSpin()
        const {match} = this.props
        const {query} = this.props.location

        const {changeOrganizations, getAward} = this.props


        if (match.params.id !== undefined) {
            if (query !== undefined) {
                if (query.type === 'clone') {
                    this.setState({
                        type: 0
                    })
                    const award = await queryAward(match.params.id)
                    Object.keys(award).forEach((item) => {
                        if (item === 'content') {
                            this.props.form.setFieldsValue({
                                content: BraftEditor.createEditorState(award[item])
                            })
                            return
                        }
                        this.props.form.setFieldsValue({
                            [item]: award[item]
                        })
                    })

                    this.props.form.setFieldsValue({
                        time: [moment(award.start), moment(award.end_time)]
                    })
                }
            } else {
                this.setState({
                    type: 1
                })
                const award = await queryAward(match.params.id)
                Object.keys(award).forEach((item) => {
                    if (item === 'content') {
                        this.props.form.setFieldsValue({
                            content: BraftEditor.createEditorState(award[item])
                        })
                        return
                    }
                    this.props.form.setFieldsValue({
                        [item]: award[item]
                    })
                })

                this.props.form.setFieldsValue({
                    time: [moment(award.start), moment(award.end_time)]
                })
            }

        }

        changeOrganizations()
        this.closeSpin()
    }

    componentDidMount() {
        const {award} = this.props
        console.log(award)


    }


    componentWillUnmount() {
        this.props.reset()
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    name: values.name,
                    content: values.content.toHTML(),
                    level: values.level,
                    organization_id: values.organization_id,
                    start_time: values.time[0].format('YYYY-MM-DD HH:mm:ss'),
                    end_time: values.time[1].format('YYYY-MM-DD HH:mm:ss'),
                    have_attachment: values.have_attachment,
                    is_active: values.is_active
                }
                if (this.state.type === 0) {
                    this.createAward(data)
                } else {
                    this.updateAward(data)
                }
            }
            console.log('Received values of form: ', values);

        });
    }


    async createAward(data) {
        this.openSpin()
        await cAward(data)
        this.closeSpin()
        const {replace} = this.props.history
        replace('/award')

    }

    async updateAward(data) {
        this.openSpin()
        const {match} = this.props

        await uAward({id: match.params.id, data: data})
        this.closeSpin()
        const {replace} = this.props.history
        replace('/award')
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

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20}
        }
        const tailFormItemLayout = {
            wrapperCol: {
                span: 8,
                offset: 4,
            }
        };

        return (
            <div className='editAward-background'>
                <Breadcrumb style={{marginBottom: 40}}>
                    <Breadcrumb.Item><Link to='/'>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>
                        个人中心
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/award'>奖项管理</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        奖项编辑
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Spin spinning={this.state.spin}>
                    <Form layout='horizontal' style={{marginTop: 40}} onSubmit={this.handleSubmit}>
                        <Form.Item {...formItemLayout}
                                   label="奖项名称"
                        >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: '请输入奖项名称',
                                }],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout}
                                   label="评奖条件"
                        >
                            {getFieldDecorator('content', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true,
                                    validator: (_, value, callback) => {
                                        if (value.isEmpty()) {
                                            callback('请输入正文内容')
                                        } else {
                                            callback()
                                        }
                                    }
                                }],
                            })(
                                <BraftEditor className='editor'/>
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout}
                                   label="奖项级别"
                        >
                            {getFieldDecorator('level', {
                                rules: [{
                                    required: true, message: '请选择奖项级别',
                                }],
                            })(
                                <Select>
                                    <Option value="0">中心级</Option>
                                    <Option value="1">部门级</Option>
                                    <Option value="2">小组级</Option>
                                    <Option value="3">公司级</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout}
                                   label="所属组织"
                        >
                            {getFieldDecorator('organization_id', {
                                rules: [{
                                    required: true, message: '请选择所属组织',
                                }],
                            })(
                                <Select>
                                    {
                                        this.props.organizations.map(function (item) {
                                            return (<Option value={item.id}>{item.name}</Option>)
                                        })
                                    }

                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout}
                                   label="日期"
                        >
                            {getFieldDecorator('time', {
                                rules: [{type: 'array', required: true, message: '请确定时间'}],
                            })(
                                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout}
                                   label="上传附件"
                        >
                            {getFieldDecorator('have_attachment', {
                                initialValue: true,
                                valuePropName: 'checked'
                            })(
                                <Switch checkedChildren="允许" unCheckedChildren="不允许" defaultChecked/>)}
                        </Form.Item>
                        <Form.Item {...formItemLayout}
                                   label="状态"
                        >
                            {getFieldDecorator('is_active', {
                                initialValue: true,
                                valuePropName: 'checked'
                            })(
                                <Switch checkedChildren="生效" unCheckedChildren="过期" defaultChecked/>)}
                        </Form.Item>

                        <Form.Item  {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">{TypeEnum[this.state.type]}奖项</Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        )
    }

}

const mapState = (state) => ({
    organizations: state.editAward.organizations,
    award: state.editAward.award
})

const mapDispatch = (dispatch) => ({
    changeOrganizations() {
        const action = actionCreators.changeOrganizations()
        dispatch(action)
    },
    getAward(id) {
        const action = actionCreators.getAwardOp(id)
        dispatch(action)
    },
    reset() {
        const action = actionCreators.reset()
        dispatch(action)
    }

})


export default connect(mapState, mapDispatch)(Form.create({})(EditAward))