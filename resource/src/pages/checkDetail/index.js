import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import './style.scss'
import AwardDetail from '../../common/awardDetail'
import { Form, Steps, Input, Upload, Button, Icon, Radio, Breadcrumb } from 'antd';
import FormItem from 'antd/lib/form/FormItem';


//申报
class CheckDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1
    }

    this.radioOnChange = this.radioOnChange.bind(this)
  }

  radioOnChange = (e) => {
    // console.log('radio checked', e.target.value);
    // this.setState({
    //   value: e.target.value,
    // });
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 14}
    }

    const uploadProps = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange({file, fileList}) {
        if ( file.status !== 'uploading' ) {
          console.log(file, fileList);
        }
      },
      defaultFileList: [],
    };
    return (
      <div className='newApply-background'>
        <Breadcrumb style={ {marginBottom: 40} }>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">个人中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">我的审核</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">审核细节</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <AwardDetail/>
        <Steps current={ 0 } style={ {marginTop: 40} }>
          <Steps.Step title="申报" description="开始申报"/>
          <Steps.Step title="审核"/>
          <Steps.Step title="评奖"/>
        </Steps>

        <Form layout='horizontal' style={ {marginTop: 40} }>
          <Form.Item
            { ...formItemLayout }
            label='申报人/社团'>
            <Input placeholder='填写申报人'/>
          </Form.Item>
          <Form.Item
            { ...formItemLayout }
            label='事迹介绍'>
            <Input.TextArea autosize={ {minRows: 6, maxRows: 16} }/>
          </Form.Item>
          <Form.Item
            labelCol={ {span: 4} }
            label='附件'
          >
            <Upload { ...uploadProps }>
              <Button>
                <Icon type="upload"/> 上传
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label='评奖'
            labelCol={ {span: 4} }
          >
            <Radio.Group onChange={ this.radioOnChange() }>
              <Radio value={ 1 }>获奖</Radio>
              <Radio value={ 2 }>未获奖</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label='评语'
            { ...formItemLayout }
          >
            <Input.TextArea autosize={ {minRows: 6, maxRows: 16} }/>
          </Form.Item>
          <Form.Item style={ {marginLeft: 480} }>
            <Button type="primary" style={ {marginRight: 30} }>提交</Button>
            <Button type="primary">取消</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default CheckDetail;