import React, { useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { Descriptions, Radio, Button, Card, Form, Modal, message } from 'antd';
import { Input, Tooltip } from 'antd';
import { loginRequest, changeStaffInfo } from '../../../api/loginRequest'
import axios from "axios";
import { getCookie } from '../../../utils/Session'
import { ExclamationCircleOutlined } from '@ant-design/icons';

@withRouter @inject('appStore') @observer
export default class personInfo extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      size: 'default',

      name: "",
      sex: "",
      identitycard: "",
      politicsstatus: "",
      edubackground: "",
      eduschool: "",
      tel: "",
      email: "",
      address: "",
      postcode: "",
      briefintro: "",
    }
  }
  // 初始化数据
  componentDidMount(){
    let data = loginRequest(
      getCookie()[0],
      getCookie()[1],
      "2"
      );
    axios.all([data]).then(
      (res) => {
        this.setState({
          name: res[0].data.data.name,
          sex: res[0].data.data.sex,
          identitycard: res[0].data.data.identitycard,
          politicsstatus: res[0].data.data.politicsstatus,
          edubackground: res[0].data.data.edubackground,
          eduschool: res[0].data.data.eduschool,
          tel: res[0].data.data.tel,
          email: res[0].data.data.email,
          address: res[0].data.data.address,
          postcode: res[0].data.data.postcode,
          briefintro: res[0].data.data.briefintro,
        })
      }
    ).catch(
      ()=>{
        message.error("加载数据出错")
      }
    )
  }

  onChange = e => {
    console.log('size checked', e.target.value);
    this.setState({
      size: e.target.value,
    });
  };

  // 初始化组件
  init = () =>{
    const [visible, setVisible] = useState(false);

    const onCreate = (values) =>{
      console.log(values);
      const { confirm } = Modal;
      confirm({
        title: '个人信息修改确认',
        icon: <ExclamationCircleOutlined />,
        content: '您确定要修改个人信息吗？',
        onOk: () => {
          let data = changeStaffInfo(
            this.props.appStore.loginUser.userid,
            values.name,
            values.sex,
            values.identitycard,
            values.politicsstatus,
            values.edubackground,
            values.eduschool,
            values.tel,
            values.email,
            values.address,
            values.postcode,
            values.briefintro,
          )
          axios.all([data]).then(
            (res) => {
              console.log(res);
              this.setState({
                name: values.name,
                sex: values.sex,
                identitycard: values.identitycard,
                politicsstatus: values.politicsstatus,
                edubackground: values.edubackground,
                eduschool: values.eduschool,
                tel: values.tel,
                email: values.email,
                address: values.address,
                postcode: values.postcode,
                briefintro: values.briefintro,
              })
              message.success('修改个人信息成功');
            }
          ).catch(
            () => {
              message.error("请求数据出错，请重试")
            }
          )
          console.log('OK')
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
        title="个人基本信息"
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
        <Descriptions.Item label="姓名"> {this.state.name}</Descriptions.Item>
        <Descriptions.Item label="性别">{this.state.sex}</Descriptions.Item>
        <Descriptions.Item label="身份证号">{this.state.identitycard}</Descriptions.Item>
        <Descriptions.Item label="政治面貌">{this.state.politicsstatus}</Descriptions.Item>
        <Descriptions.Item label="最高学历">{this.state.edubackground}</Descriptions.Item>
        <Descriptions.Item label="毕业院校">{this.state.eduschool}</Descriptions.Item>
        <Descriptions.Item label="电话">{this.state.tel}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{this.state.email}</Descriptions.Item>
        <Descriptions.Item label="邮政编码">{this.state.postcode}</Descriptions.Item>
        <Descriptions.Item label="家庭住址" span={4}>{this.state.address}</Descriptions.Item>
        <Descriptions.Item label="个人简介">{this.state.briefintro}</Descriptions.Item>
      </Descriptions>
    )
  }
  
  Func = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();
    return(
      <Modal
        visible={visible}
        title="编辑个人信息"
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
        title="个人基本信息"
        size="middle"
      >
        <Descriptions.Item label="姓名"> 
        <Form.Item name="name" initialValue={this.state.name}><Input defaultValue={this.state.name}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="性别">
        <Form.Item name="sex" initialValue={this.state.sex}><Input defaultValue={this.state.sex}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="身份证号">
        <Form.Item name="identitycard" initialValue={this.state.identitycard}><Input defaultValue={this.state.identitycard}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="政治面貌">
        <Form.Item name="politicsstatus" initialValue={this.state.politicsstatus}><Input defaultValue={this.state.politicsstatus}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="最高学历">
        <Form.Item name="edubackground" initialValue={this.state.edubackground}><Input defaultValue={this.state.edubackground}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="毕业院校">
        <Form.Item name="eduschool" initialValue={this.state.eduschool}><Input defaultValue={this.state.eduschool}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="电话">
        <Form.Item name="tel" initialValue={this.state.tel}><Input defaultValue={this.state.tel}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="邮箱">
        <Form.Item name="email" initialValue={this.state.email}><Input defaultValue={this.state.email}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="邮政编码">
        <Form.Item name="postcode" initialValue={this.state.postcode}><Input defaultValue={this.state.postcode}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="家庭住址" span={4}>
        <Form.Item name="address" initialValue={this.state.address}><Input defaultValue={this.state.address}/></Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="个人简介">
        <Form.Item name="briefintro" initialValue={this.state.briefintro}><Input defaultValue={this.state.briefintro}/></Form.Item>
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
        <br />
        <br />
          <this.init />
        <br />
        <br />
        </Card>
      </div>
    );
  }
}