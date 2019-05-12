import React, {Component} from 'react';
import {Divider, Table, Button, Breadcrumb, Modal, Input, Form, Tooltip, Tag, Icon, Spin, Popconfirm} from 'antd';
import * as actionCreators from "./store/actionCreators";
import {connect} from "react-redux";
import {createOrgan, deleteOrgan, updateOrgan} from "../../services/api";


const TypeEnum = {
    0: '创建',
    1: '更新'
}

class EditableTagGroup extends React.Component {
    state = {
        tags: [],
        inputVisible: false,
        inputValue: '',
    };

    constructor(props) {
        super(props)
        const {value, onChange} = this.props
        this.onChnage = onChange
        console.log(this.props)
        this.setState({
            tags: value || []
        })

    }


    componentDidMount() {
        const {value} = this.props
        console.log(this.props)
        this.setState({
            tags: value || []
        })
    }


    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({tags});
        this.onChnage(tags)
    }

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({inputValue: e.target.value});
    }

    handleInputConfirm = () => {
        const {inputValue} = this.state;
        let {tags} = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
        this.onChnage(tags)

    }

    saveInputRef = input => this.input = input

    render() {
        const {tags, inputVisible, inputValue} = this.state;
        return (
            <div>
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{width: 78}}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag
                        onClick={this.showInput}
                        style={{background: '#fff', borderStyle: 'dashed'}}
                    >
                        <Icon type="plus"/> New Tag
                    </Tag>
                )}
            </div>
        );
    }
}

const OrganizationFormT = Form.create({name: 'form_in_modal'})(
    class extends Component {
        constructor(props) {
            super(props)
            console.log('con', props)

        }


        componentDidMount() {
            const {type, updateId} = this.props
            if (type === 1) {
                const {data} = this.props
                let item = data.find((item) => item.id === updateId)
                console.log(item)
                this.props.form.setFieldsValue({
                    name: item.name,
                    head: item.head,
                    eva_member: item.eva_members
                });
                this.forceUpdate()
            }
        }

        setTitle(type) {
            return TypeEnum[type] + '组织'
        }


        setOkHanle(type) {
            const {onCreate} = this.props
            return onCreate

        }

        handleValTag(rule, value, callback) {


            if (Array.isArray(value)) {
                let reg = /^[1-9][0-9]{4,10}$/
                for (let item of value) {
                    console.log(item)
                    if (!reg.test(item)) {
                        return callback('必须是qq号')
                    }
                }
            }
            return callback()
        }


        render() {
            const {
                visible, onCancel, onCreate, form, type
            } = this.props;
            const {getFieldDecorator} = form;

            return (
                <Modal
                    visible={visible}
                    title={this.setTitle(type)}
                    okText={TypeEnum[type]}
                    onCancel={onCancel}
                    onOk={this.setOkHanle(type)}
                >
                    <Spin spinning={this.props.spinning}>

                        <Form layout="vertical">
                            <Form.Item label="所属组织">
                                {getFieldDecorator('name', {
                                    rules: [{required: true, message: '请输入组织名称'}],
                                })(
                                    <Input/>
                                )}
                            </Form.Item>
                            <Form.Item label="负责人员">
                                {getFieldDecorator('head', {
                                    rules: [{type: 'array', required: true, message: '请设置负责人员'}, {
                                        validator: this.handleValTag
                                    }],

                                })(
                                    <EditableTagGroup/>)}
                            </Form.Item>
                            <Form.Item label="参评人员">
                                {getFieldDecorator('eva_member', {
                                    rules: [{type: 'array', required: true, message: '请设置参评人员'}, {
                                        validator: this.handleValTag
                                    }],

                                })(
                                    <EditableTagGroup/>)}
                            </Form.Item>
                        </Form>
                    </Spin>

                </Modal>

            )
        }

    }
)

const mapStateForm = (state) => ({
    data: state.organization.data,
})
const OrganizationForm = connect(mapStateForm)(OrganizationFormT)


class Organization extends Component {

    state = {
        visible: false,
        type: 0,
        update_id: -1,
        spinning: true,
        modalSpin: false
    }

    constructor(props) {
        super(props)
        this.columns = [{
            title: '所属单位',
            dataIndex: 'name',
            key: 'name',
            width: 100,

            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '负责人',
            dataIndex: 'head',
            key: 'head',
            width: 100,

            render: (heads) => (
                <span>
          {heads.map(head => <Tag color="blue" key={head}>{head}</Tag>)}
        </span>
            )
        }, {
            title: '参评人员',
            dataIndex: 'eva_members',
            width: 100,
            key: 'eva_members',
            render: (evas) => (
                <span>
          {evas.map(eva => <Tag color="blue" key={eva}>{eva}</Tag>)}
        </span>
            )
        }, {
            title: '更新人 ',
            dataIndex: 'update_user',
            key: 'update_user',
        }, {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time'
        }, {
            title: '操作',
            key: 'action',
            render: (_, record) => {
                return (
                    <div>
                        <a href="javascript:;" onClick={() => this.updateOrganization(record.id)}>编辑</a>
                        <Divider type="vertical"/>
                        <Popconfirm title="你确定要删除这个组织嘛？" okText="删除" cancelText="取消"
                                    onConfirm={() => this.deleteOrganization(record.id)}>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    </div>
                )
            },
        }]
    }

    componentWillMount() {
        this.openSpin()
        const {changePage} = this.props
        changePage(1, () => {
            this.closeSpin()

        })
    }


    async deleteOrganization(id) {
        this.openSpin()
        await deleteOrgan(id)

        this.onChange()
        this.closeSpin()
    }

    createOrganization() {
        this.showModal(0)
    }

    updateOrganization(update_id) {
        this.setState({
            update_id: update_id
        })
        this.showModal(1)
    }

    onChange(page = 0) {
        const {changePage} = this.props
        changePage(page)
    }

    showModal = (type) => {
        this.setState({visible: true, type: type});
    }

    handleCancel = () => {
        this.setState({visible: false, type: 0});
    }

    openSpin() {
        this.setState({
            spinning: true
        })
    }

    closeSpin() {
        this.setState({
            spinning: false
        })
    }

    oepnModalSpin() {
        this.setState({
            modalSpin: true
        })
    }

    closeModalSpin() {
        this.setState({
            modalSpin: false
        })
    }

    handleOp = () => {
        this.oepnModalSpin()
        const form = this.formRef.props.form;
        console.log(form.getFieldsValue())
        form.validateFields(async (err, values) => {
            if (err) {
                console.log(values)
                this.closeModalSpin()
                return;
            }
            if (this.state.type === 0) {
                await this.createO(values)
            } else {
                await this.update(values)
            }
            form.resetFields();
            this.closeModalSpin()
            this.handleCancel()
            const {changePage} = this.props
            changePage()

        });
    }

    async update(values) {
        await updateOrgan({id: this.state.update_id, data: values})
    }

    async createO(values) {
        await createOrgan(values)
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        const {total, data, currentPage} = this.props

        let pagination = {
            total: total,
            showTotal: (total) => `总共${total}个组织`,
            pageSize: 10,
            onChange: this.pageChange,
            current: currentPage
        }
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

                <Button style={{marginTop: '30px'}} onClick={this.createOrganization.bind(this)}>添加</Button>
                <Spin spinning={this.state.spinning}>
                    <Table columns={this.columns} dataSource={data} style={{marginTop: '30px'}}
                           pagination={pagination}/>
                </Spin>
                {
                    this.state.visible ? (
                        <OrganizationForm
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleOp}
                            type={this.state.type}
                            updateId={this.state.update_id}
                            spinning={this.state.modalSpin}
                        />
                    ) : ''
                }


            </div>
        );
    }
}

const mapState = (state) => ({
    data: state.organization.data,
    total: state.organization.count,
    currentPage: state.organization.currentPage
})

const mapDispatch = (dispatch) => ({
    changePage(page = 1, cb) {
        const action = actionCreators.changePageData(page, cb)
        dispatch(action)
    }
})
export default connect(mapState, mapDispatch)(Organization);