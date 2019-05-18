import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import './style.scss'
import AwardDetail from '../../common/awardDetail'
import {
  Form,
  Steps,
  Input,
  Upload,
  Button,
  Icon,
  Radio,
  Breadcrumb,
  Table,
  DatePicker,
  Dropdown,
  Menu,
  Alert
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { levelEnum, suffix } from '../../utils/utils';
import { actionCreators } from './store';
import { pitchCloneAward } from '../../services/api';


class cloneAward extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
      cloneList: [],
      newList: [],
      oldNameValue: '',
      newNameValue: '',
      startDate: '',
      endDate: '',
      organID: '',
      organName: '',
      showAlert: false,
      showAlert2: false
    }

    this.handleOldName = this.handleOldName.bind(this)
    this.handleNewName = this.handleNewName.bind(this)
    this.onClickChooseOrgan = this.onClickChooseOrgan.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
    this.Look = this.Look.bind(this)

    this.columns = [
      {
        title: '所属单位',
        dataIndex: 'organization',
        key: 'organization',
        render: text => <a href="javascript:;">{ suffix(text, 20) }</a>,
      },
      {
        title: '替换后单位',
        dataIndex: 'organName',
        key: 'organName',
        render: (level) => (
          <span>
      { levelEnum[level] }
    </span>
        )
      }, {
        title: '申报奖项',
        dataIndex: 'name',
        key: 'name',
        render: text => suffix(text, 20),
      },
      {
        title: '替换后奖项名称',
        dataIndex: 'newname',
        key: 'newname',
        // render: text => suffix(text, 20),
      }, {
        title: '开始时间',
        dataIndex: 'start_time',
        key: 'start_time'
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        key: 'end_time'
      }]
  }

  componentWillMount() {
    const {query} = this.props.location
    console.log(query)
    this.setState({
      cloneList: query.cloneList,
      newList: query.newList
    })
  }

  onSubmit() {
    const currentList = []

    if ( this.state.startDate === '' ) {
      this.setState({
        showAlert: true
      })
    } else if ( this.state.organID === '' ) {
      this.setState({
        showAlert2: true
      })
    } else {

      this.state.cloneList.map((item) => {
        item.name = item.name.replace(this.state.oldNameValue, this.state.newNameValue)
        item.organization_id = this.state.organID
        item.start_time = this.state.startDate
        item.end_time = this.state.endDate
        let currentItem = {
          name: item.name,
          organization_id: item.organization_id,
          start_time: item.start_time,
          end_time: item.end_time,
          id: item.id
        }
        currentList.push(currentItem)
      })

      this.cloneAward(currentList)
    }

  }

  async cloneAward(data) {
    await pitchCloneAward({data})
    const {goBack} = this.props.history
    goBack()
  }

  handleOldName(e) {
    this.setState({
      oldNameValue: e.target.value
    })
  }

  handleNewName(e) {
    this.setState({
      newNameValue: e.target.value
    })
  }

  onClickChooseOrgan(key) {
    console.log(key)

    this.setState({
      organID: key.key,
      organName: key.item.props.children
    }, () => {
      console.log(this.state.organName)

    })
    console.log(key.item.props.children)
  }

  onDateChange(date, dateString) {
    console.log(date, dateString)
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    })
  }

  Look() {
    let currList = this.state.cloneList

    currList.map((item) => {
      item.newname = item.name.replace(this.state.oldNameValue, this.state.newNameValue)
      item.organization_id = this.state.organID
      item.organName = this.state.organName
      item.start_time = this.state.startDate
      item.end_time = this.state.endDate
    })

    this.setState({
      newList: currList
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20}
    }

    return (
      <div className='layout-background'>
        {
          this.state.showAlert ? (<Alert
            message="Error Text"
            description=" 请输入修改后的时间"
            type="error"
            closable
          />) : ''
        }
        {
          this.state.showAlert2 ? (<Alert
            message="Error Text"
            description=" 请输入修改后的组织名称"
            type="error"
            closable
          />) : ''
        }
        <Form layout="vertical">
          <Form.Item
            label='申报奖项'
            { ...formItemLayout }
            required={ true }
          >
            <div style={ {display: 'flex', flexDirection: 'row'} }>
              <Input style={ {width: 150} }
                     value={ this.state.oldNameValue }
                     onChange={ this.handleOldName }
              />
              <div style={ {margin: 5} }>替换</div>
              <Input style={ {width: 150} }
                     value={ this.state.newNameValue }
                     onChange={ this.handleNewName }
              />
            </div>

          </Form.Item>

          <Form.Item
            label='所属组织'
            { ...formItemLayout }
            required={ true }
          >
            <Dropdown overlay={ () =>
              <Menu onClick={ this.onClickChooseOrgan }>
                { this.props.organList.map((item) =>
                  <Menu.Item key={ item.id }>{ item.name }</Menu.Item>) }
              </Menu>
            }>
              <a className="ant-dropdown-link">
                选择组织
                <Icon type="down"/>
              </a>
            </Dropdown>
          </Form.Item>

          <Form.Item
            label='申报时间'
            { ...formItemLayout }
            required={ true }
          >
            <DatePicker.RangePicker showTime onChange={ this.onDateChange } format="YYYY-MM-DD HH:mm:ss"/>
          </Form.Item>

          <Form.Item>
            <Button onClick={ () => this.onSubmit() }>确定</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={ () => this.Look() }>预览</Button>
          </Form.Item>
        </Form>
        <Table columns={ this.columns } dataSource={ this.state.newList } style={ {marginTop: '30px'} } rowKey='id'/>
      </div>
    );
  }

  componentDidMount() {
    this.props.getOrganList()
  }
}

const mapState = (state) => ({
  organList: state.cloneAward.organizationList
})

const mapDispatch = (dispatch) => ({
  getOrganList() {
    const action = actionCreators.getOrganList()
    dispatch(action)
  }
})

export default connect(mapState, mapDispatch)(cloneAward);