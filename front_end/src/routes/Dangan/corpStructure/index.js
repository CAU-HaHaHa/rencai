import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { Descriptions, Radio, Button, Card, Form, Modal, message } from 'antd';
import { Input } from 'antd';
import { getCorInfo, changeCorInfo } from '../../../api/loginRequest'
import axios from "axios";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Treee from './Tree'

@withRouter @inject('appStore') @observer
export default class corpInfo extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      size: 'default',

      name: "1",
      email: "2",
      tel: "3",
      website: "4",
      location: "5",
      requirementinfo: "6",
    }
  }

  componentDidMount(){
    this.GetCorporation();
  }

  // 获得公司信息
  GetCorporation(){
    let data = getCorInfo( this.props.appStore.loginUser.corporationid);
    axios.all([data]).then(
      (res) => {
        this.setState({
          name: res[0].data.data.name,
          email: res[0].data.data.email,
          tel: res[0].data.data.tel,
          website: res[0].data.data.website,
          location: res[0].data.data.location,
          requirementinfo: res[0].data.data.requirementinfo,
        })
      }
    ).catch(
      ()=>{
        message.error("公司信息数据请求出错")
      }
    )
  }


  onChange = e => {
    console.log('size checked', e.target.value);
    this.setState({
      size: e.target.value,
    });
  };

  //  初始化公司信息
  initCorp = () =>{
    const [visible, setVisible] = useState(false);
    const { confirm } = Modal;
    const onCreate = (values) =>{
      console.log(values);
      confirm({
        title: '公司信息修改确认',
        icon: <ExclamationCircleOutlined />,
        content: '您确定要修改公司信息吗？',
        onOk: () => {
          let data = changeCorInfo(
            this.props.appStore.loginUser.corporationid,
            values.name,
            values.email,
            values.tel,
            values.website,
            values.location,
            values.requirementinfo,
            )
          axios.all([data]).then(
            (res) => {
              this.setState({
                name: values.name,
                email: values.email,
                tel: values.tel,
                website: values.website,
                lacation: values.lacation,
                requirementinfo: values.requirementinfo,
              })
              message.success('修改公司信息成功');
            }
          ).catch(
            () => {
              message.success('修改公司信息失败');
            }
          )
          console.log('OK');
          setVisible(false);
        },
        onCancel: () => {
          console.log('Cancel');
        },
      });
    } 

    return(
      <Descriptions
        bordered
        title="公司信息"
        size={this.state.size}
        extra={
        <div>
          <Button type="primary"onClick={() => { setVisible(true);}}>Edit</Button>
          <this.Func
            visible={visible}
            onCreate={onCreate}
            onCancel={() => { setVisible(false);}}
          />  
        </div>
      }
      >
        <Descriptions.Item label="公司名称" span={2}> {this.state.name}</Descriptions.Item>
        <Descriptions.Item label="邮箱" span={2}>{this.state.email}</Descriptions.Item>
        <Descriptions.Item label="电话" span={2}>{this.state.tel}</Descriptions.Item>
        <Descriptions.Item label="公司官网" span={2}>{this.state.website}</Descriptions.Item>
        <Descriptions.Item label="公司地址" span={4}>{this.state.location}</Descriptions.Item>
        <Descriptions.Item label="公司简介" >{this.state.requirementinfo}</Descriptions.Item>
      </Descriptions>
    )
  }
  
  Func = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();
    return(
      <Modal
        visible={visible}
        title="编辑公司信息"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form.validateFields().then((values) => {
              onCreate(values);
            }).catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        width = {1100}
      >
      <Form form={form} name="form_in_modal">
      <Descriptions
        form={form}
        bordered
        title="公司信息"
        size="middle"
      >
        <Descriptions.Item label="公司名称"> 
        <Form.Item name="name" initialValue={this.state.name}><Input defaultValue={this.state.name}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="邮箱">
        <Form.Item name="email" initialValue={this.state.email}><Input defaultValue={this.state.email}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="电话">
        <Form.Item name="tel" initialValue={this.state.tel}><Input defaultValue={this.state.tel}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="公司官网">
        <Form.Item name="website" initialValue={this.state.website}><Input defaultValue={this.state.website}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="公司地址" span={2}>
        <Form.Item name="locaction" initialValue={this.state.location}><Input defaultValue={this.state.location}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="公司简介">
        <Form.Item name="requirementinfo" initialValue={this.state.requirementinfo}><Input defaultValue={this.state.requirementinfo}/></Form.Item>
        </Descriptions.Item>
      </Descriptions>
      </Form>
      </Modal>
    )
  }
  
  render() {
    return (
      <div>
        <Card>
        <Radio.Group onChange={this.onChange} value={this.state.size}>
          <Radio value="default">default</Radio>
          <Radio value="middle">middle</Radio>
          <Radio value="small">small</Radio>
        </Radio.Group>
          <this.initCorp />
        </Card>
        <Treee />
      </div>
    );
  }
}