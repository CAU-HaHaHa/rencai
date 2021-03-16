import React, { useState } from 'react'
import { randomNum, calculateWidth } from '../../utils/utils'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Col, Select,Modal, Button, Form as Form4, notification } from 'antd';
import PromptBox from '../../components/PromptBox'
import { loginRequest, corporationRegister, hrRegister } from '../../api/loginRequest'
import axios from "axios";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

@withRouter @inject('appStore') @observer @Form.create()
class LoginForm extends React.Component {
  state = {
    focusItem: -1,   //保存当前聚焦的input
    code: '',         //验证码
    usertype: "1"    // 用户类型
  }

  componentDidMount () {
    this.createCode()
  }

  /**
   * 生成验证码
   */
  createCode = () => {
    const ctx = this.canvas.getContext('2d')
    const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let code = ''
    ctx.clearRect(0, 0, 80, 39)
    for (let i = 0; i < 4; i++) {
      const char = chars[randomNum(0, 57)]
      code += char
      ctx.font = randomNum(20, 25) + 'px SimHei'  //设置字体随机大小
      ctx.fillStyle = '#D3D7F7'
      ctx.textBaseline = 'middle'
      ctx.shadowOffsetX = randomNum(-3, 3)
      ctx.shadowOffsetY = randomNum(-3, 3)
      ctx.shadowBlur = randomNum(-3, 3)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      let x = 80 / 5 * (i + 1)
      let y = 39 / 2
      let deg = randomNum(-25, 25)
      /**设置旋转角度和坐标原点**/
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(char, 0, 0)
      /**恢复旋转角度和坐标原点**/
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    }
    this.setState({
      code
    })
  }
  loginSubmit = (e) => {
    e.preventDefault()
    this.setState({
      focusItem: -1
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 表单登录时，若验证码长度小于4则不会验证，所以我们这里要手动验证一次，线上的未修复
        if (this.state.code.toUpperCase() !== values.verification.toUpperCase()) {
          this.props.form.setFields({
            verification: {
              value: values.verification,
              errors: [new Error('验证码错误')]
            }
          })
          return
        }
        const {usertype} = this.state;
        let data = loginRequest(
          values.username, 
          values.password, 
          usertype,
          );
        axios.all([data]).then(
          res => {
            console.log(res[0].data);
            if(res[0].data.status=="2"){  // 用户名不存在
              this.props.form.setFields({
                username: {
                  value: values.username,
                  errors: [new Error('用户名不存在')]
                }
              })
              return
            }
            else if(res[0].data.status=="3"){ // 密码错误
              this.props.form.setFields({
                password: {
                  value: values.password,
                  errors: [new Error('密码错误')]
                }
              })
              return
            }
            else if(res[0].data.status=="0"){ // 未知错误
              alert("未知错误");
              return;
            }
            if(usertype=="1"){
              this.props.appStore.toggleLogin(true, 
                {
                  username: values.username, 
                  password: values.password, 
                  usertype: "1",
                  userid: res[0].data.data.hr_id,
                  corporationid: res[0].data.data.corporation_id,
              });
              this.props.history.push("/#/homeHr");
            }
            else{
              this.props.appStore.toggleLogin(true, 
                {username: values.username, 
                  password: values.password, 
                  usertype: "2",
                  userid: res[0].data.data.hr_id,
                  corporationid: res[0].data.data.corporation_id,
              });
              this.props.history.push("/#/homeStaff");
            }
          }
        ).catch(
          ()=>{
            alert("未知错误")
          }
        )
      
        // console.log(this.props.location.state || {from: {pathname: '/'}});
        // const {from} = this.props.location.state || {from: {pathname: '/'}}
        // this.props.history.push(from)
      }
    })
  }
  register = () => {
    this.props.switchShowBox('stafflogin')
    setTimeout(() => this.props.form.resetFields(), 500)
  }

  // handleChange = (value) =>{
  //   this.setState({
  //     usertype: value
  //   })
  // }

  render () {
    const {getFieldDecorator, getFieldError} = this.props.form
    const {focusItem, code} = this.state
    const { Option } = Select;
    return (
      <div className={this.props.className}>
        <h3 className='title'>HR登录</h3>
        <Form onSubmit={this.loginSubmit}>
          <Form.Item help={getFieldError('username') &&
          <PromptBox info={getFieldError('username')} width={calculateWidth(getFieldError('username'))}/>}>
            {getFieldDecorator('username', {
              rules: [{required: true, message: '请输入用户名'}]
            })(
              <Input
                onFocus={() => this.setState({focusItem: 0})}
                onBlur={() => this.setState({focusItem: -1})}
                maxLength={16}
                placeholder='用户名'
                addonBefore={<span className='iconfont icon-User' style={focusItem === 0 ? styles.focus : {}}/>}/>
            )}
          </Form.Item>
          <Form.Item help={getFieldError('password') &&
          <PromptBox info={getFieldError('password')} width={calculateWidth(getFieldError('password'))}/>}>
            {getFieldDecorator('password', {
              rules: [{required: true, message: '请输入密码'}]
            })(
              <Input
                onFocus={() => this.setState({focusItem: 1})}
                onBlur={() => this.setState({focusItem: -1})}
                type='password'
                maxLength={16}
                placeholder='密码'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 1 ? styles.focus : {}}/>}/>
            )}
          </Form.Item>
          <Form.Item help={getFieldError('verification') &&
          <PromptBox info={getFieldError('verification')} width={calculateWidth(getFieldError('verification'))}/>}>
            {getFieldDecorator('verification', {
              validateFirst: true,
              rules: [
                {required: true, message: '请输入验证码'},
                {
                  validator: (rule, value, callback) => {
                    if (value.length >= 4 && code.toUpperCase() !== value.toUpperCase()) {
                      callback('验证码错误')
                    }
                    callback()
                  }
                }
              ]
            })(
              <Row>
                <Col span={15}>
                  <Input
                    onFocus={() => this.setState({focusItem: 2})}
                    onBlur={() => this.setState({focusItem: -1})}
                    maxLength={4}
                    placeholder='验证码'
                    addonBefore={<span className='iconfont icon-securityCode-b'
                                       style={focusItem === 2 ? styles.focus : {}}/>}/>
                </Col>
                <Col span={9}>
                  <canvas onClick={this.createCode} width="80" height='39' ref={el => this.canvas = el}/>
                </Col>
              </Row>
            )}
          </Form.Item>
          {/* <Select defaultValue="1" className='selectBtn' style={{ width: 120, color: "#4FA1D9" }} onChange={this.handleChange}>
            <Option value="1">HR</Option>
            <Option value="2">员工</Option>
          </Select> */}
          <div className='bottom'>
            <input className='loginBtn' type="submit" value='登录'/>
            <span className='registerBtn' onClick={this.register}>转员工登录</span>
          </div>
        </Form>
        <div className='bottom'>
          <CollectionsPage1 />
          <CollectionsPage2 />
        </div>
        
        {/* <div className='footer'>
          <div>欢迎登陆后台管理系统</div>
        </div> */}
      </div>
    )
  }
}

const CollectionsPage1 = () => {
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    console.log('Received values of form: ', values);

    let data = corporationRegister(values.name, values.registeredCapital,
       values.legalRepresentative, values.telephone, values.email, values.webAddress, values.address);
        axios.all([data]).then(
          res => {
            console.log(res);
            if(res[0].data.status=="1"){  // 注册成功
              notification.open({
                message: '注册成功',
                description: '请耐心等待审核',
                icon:<CheckCircleOutlined style={{ color: "green"}}/>,
              });
              setVisible(false);
            }
            else if(res[0].data.status=="2"){ // 注册失败，该公司正在注册审核中
              notification.open({
                message: '注册失败',
                description: '该公司正在注册审核中',
                icon: <CloseCircleOutlined style={{ color: "red"}}/>,
              });
            }
            else if(res[0].data.status=="3"){ // 注册失败，该公司已注册
              notification.open({
                message: '注册失败',
                description: '该公司已注册',
                icon: <CloseCircleOutlined style={{ color: "red"}}/>,
              });
            }
            else{
              if(res[0].data.message=="phone number is not valid"){
                notification.open({
                  message: '请输入正确的电话号码',
                  icon: <CloseCircleOutlined style={{ color: "red"}}/>,
                });
              }
              else{
                notification.open({
                  message: '未知错误',
                  description: '未知错误',
                  icon: <CloseCircleOutlined style={{ color: "red"}}/>,
                });
              }
            }
          }
        ).catch(
          () =>{
            notification.open({
              message: '未知错误',
              description: '未知错误',
              icon: <CloseCircleOutlined style={{ color: "red"}}/>,
            });
          }
        )
    
    
  };

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true);}}>
        公司注册
      </Button>
      <CollectionCreateForm1
        visible={visible}
        onCreate={onCreate}
        onCancel={() => { setVisible(false);}}
      />  
    </div>
  );
};

const CollectionCreateForm1 = ({ visible, onCreate, onCancel }) => {
  const [form] = Form4.useForm();
  return (
    <Modal
      visible={visible}
      title="公司注册"
      okText="注册"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
            onCreate(values);
          }).catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form4 form={form} layout="vertical" name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form4.Item name="name" label="公司名称"
          rules={[{
              required: true,
              message: 'Please input the name!',
            },]}>
          <Input />
        </Form4.Item>
        <Form4.Item name="registeredCapital" label="注册资本" rules={[{
              required: true,
              message: 'Please input the registeredCapital!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
        <Form4.Item name="legalRepresentative" label="法人代表" rules={[{
              required: true,
              message: 'Please input the legalRepresentative!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
        <Form4.Item name="telephone" label="联系电话" rules={[{
              required: true,
              message: 'Please input the telephone!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
        <Form4.Item name="email" label="邮箱" rules={[{
              required: true,
              message: 'Please input the email!',
              type: 'email',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
        <Form4.Item name="webAddress" label="公司官网" rules={[{
              required: true,
              message: 'Please input the webAddress!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
        <Form4.Item name="address" label="公司地址" rules={[{
              required: true,
              message: 'Please input the address!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
      </Form4>
    </Modal>
  );
};

const CollectionsPage2 = () => {
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    if(values.affirmpassword!=values.password){
      alert("两次输入的密码不同！")
    }
    else{
      let data = hrRegister(values.name, values.username,
        values.password, values.realName, values.sex, values.idCard);
         axios.all([data]).then(
           res => {
             console.log(res);
             if(res[0].data.status=="1"){  // 注册成功
               notification.open({
                 message: '注册成功',
                 description: '请耐心等待审核',
                 icon:<CheckCircleOutlined style={{ color: "green"}}/>,
               });
               setVisible(false);
             }
             else if(res[0].data.status=="2"){ // 注册失败
               notification.open({
                 message: '注册失败',
                 description: '该公司尚未审核通过',
                 icon: <CloseCircleOutlined style={{ color: "red"}}/>,
               });
             }
             else if(res[0].data.status=="3"){ // 注册失败，
               notification.open({
                 message: '注册失败',
                 description: '该公司未注册',
                 icon: <CloseCircleOutlined style={{ color: "red"}}/>,
               });
             }
             else if(res[0].data.status=="4"){ // 注册失败，
              notification.open({
                message: '注册失败',
                description: '您已提交申请待审核，勿重复提交',
                icon: <CloseCircleOutlined style={{ color: "red"}}/>,
              });
            }
            else if(res[0].data.status=="5"){ // 注册失败，
              notification.open({
                message: '注册失败',
                description: '该身份证已被hr注册',
                icon: <CloseCircleOutlined style={{ color: "red"}}/>,
              });
            }
             else{
              if(res[0].data.message=="phone number is not valid"){
                notification.open({
                  message: '请输入正确的电话号码',
                  icon: <CloseCircleOutlined style={{ color: "red"}}/>,
                });
              }
              else{
                notification.open({
                  message: '未知错误',
                  description: '未知错误',
                  icon: <CloseCircleOutlined style={{ color: "red"}}/>,
                });
              }
             }
           }
         ).catch(
           () =>{
             notification.open({
               message: '未知错误',
               description: '未知错误',
               icon: <CloseCircleOutlined style={{ color: "red"}}/>,
             });
           }
         )
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true);}}>
        HR注册
      </Button>
      <CollectionCreateForm2
        visible={visible}
        onCreate={onCreate}
        onCancel={() => { setVisible(false);}}
      />  
    </div>
  );
};

const CollectionCreateForm2 = ({ visible, onCreate, onCancel }) => {
  const [form] = Form4.useForm();
  return (
    <Modal
      visible={visible}
      title="HR注册"
      okText="注册"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
            onCreate(values);
          }).catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form4 form={form} layout="vertical" name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form4.Item name="name" label="公司名称"
          rules={[{
              required: true,
              message: 'Please input the name!',
            },]}>
          <Input />
        </Form4.Item>
        <Form4.Item name="username" label="用户名" rules={[{
              required: true,
              message: 'Please input the username!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
        <Form4.Item name="password" label="密码" rules={[{
              required: true,
              message: 'Please input the password!',
            },]}>
          <Input.Password />
        </Form4.Item>
        <Form4.Item name="affirmpassword" label="再次输入密码" rules={[{
              required: true,
              message: 'Please input the password again!',
            },]}>
          <Input.Password />
        </Form4.Item>
        <Form4.Item name="realName" label="真实姓名" rules={[{
              required: true,
              message: 'Please input the real name!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
        <Form4.Item name="sex" label="性别" rules={[{
              required: true,
              message: 'Please input the sex!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
        <Form4.Item name="idCard" label="身份证号" rules={[{
              required: true,
              message: 'Please input the idCard!',
            },]}>
          <Input type="textarea" />
        </Form4.Item>
      </Form4>
    </Modal>
  );
};

const styles = {
  focus: {
    width: '20px',
    opacity: 1
  },
}

export default LoginForm