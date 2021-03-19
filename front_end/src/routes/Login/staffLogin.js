import React, { useState } from 'react'
import { randomNum, calculateWidth } from '../../utils/utils'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Col,Modal, Button, Form as Form4, Radio, Alert, notification   } from 'antd';
import PromptBox from '../../components/PromptBox'
import { loginRequest, staffRegister } from '../../api/loginRequest'
import axios from "axios";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

@withRouter @inject('appStore') @observer @Form.create()
class StaffLoginForm extends React.Component {
  state = {
    load: false,
    focusItem: -1,   //保存当前聚焦的input
    code: '',         //验证码
    usertype: "2"    // 用户类型
  }

  componentDidMount () {

  }

  componentWillUpdate(){
    if(this.state.load==false){
      this.createCode();
      this.setState({
        load: true,
      })
    }
  }


  /**
   * 生成验证码
   */
  createCode = () => {
    const ctx = this.canvas.getContext('2d')//document.getElementById("myCanvas").getContext('2d')
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
              notification.open({
                message: '登录失败',
                icon: <CloseCircleOutlined style={{ color: "red"}}/>,
              });
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
                  userid: res[0].data.data.user_id,
                  corporationid: res[0].data.data.corporation_id,
              });
              this.props.history.push("/#/homeStaff");
            }
          }
        ).catch(
          ()=>{
            notification.open({
              message: '数据请求失败',
              description: '数据请求失败，请检查网络环境',
              icon: <CloseCircleOutlined style={{ color: "red"}}/>,
            });
          }
        )
      
        // console.log(this.props.location.state || {from: {pathname: '/'}});
        // const {from} = this.props.location.state || {from: {pathname: '/'}}
        // this.props.history.push(from)
      }
    })
  }
  register = () => {
    this.props.switchShowBox('login')
    var c=this.canvas
    c.height=c.height;  
    this.setState({
      load: false
    })
    setTimeout(() => this.props.form.resetFields(), 500)
  }

  render () {
    const {getFieldDecorator, getFieldError} = this.props.form
    const {focusItem, code} = this.state
    
    return (
      <div className={this.props.className}>
        <h3 className='title'>卓越人才管理系统-员工登录</h3>
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
                    <canvas id="myCanvas" onClick={this.createCode} width="80" height='39' ref={el => this.canvas = el}/>
                </Col>
              </Row>
            )}
          </Form.Item>
          <div className='bottom'>
            <input className='loginBtn' type="submit" value='登录'/>
            <span className='registerBtn' onClick={this.register}>转HR登录</span>
          </div>
        </Form>
        <div className='bottom'>
            <CollectionsPage />
        </div>
        
        {/* <div className='footer'>
          <div>欢迎登陆后台管理系统</div>
        </div> */}
      </div>
    )
  }
}

const CollectionsPage = () => {
    const [visible, setVisible] = useState(false);
  
    const onCreate = (values) => {
      if(values.affirmpassword!=values.password){
        alert("两次输入的密码不同！")
      }
      else{
        let data = staffRegister(values.username, values.password, values.telephone, values.email);
        console.log(values.username)
        console.log(values.password)
        axios.all([data]).then(
          res => {
            if(res[0].data.status=="1"){  // 注册成功，请登录邮箱激活该账号
              notification.open({
                message: '注册成功',
                description: '请登录邮箱激活该账号',
                icon:<CheckCircleOutlined style={{ color: "green"}}/>,
              });
              setVisible(false);
            }
            else if(res[0].data.status=="2"){ // 注册失败，该账号已存在
              notification.open({
                message: '注册失败',
                description: '该账号已存在',
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
              else if(res[0].data.message=="id card is not valid"){
                notification.open({
                  message: '请输入正确的身份证号',
                  icon: <CloseCircleOutlined style={{ color: "red"}}/>,
                });
              }
              else{
                notification.open({
                  message: '注册信息错误',
                  description: '请填写正确的注册信息！',
                  icon: <CloseCircleOutlined style={{ color: "red"}}/>,
                });
              }
            }
          }
        ).catch(
          () =>{
            notification.open({
              message: '数据请求失败',
              description: '数据请求失败，请检查网络环境',
              icon: <CloseCircleOutlined style={{ color: "red"}}/>,
            });
          }
        )
        
      }
      
    };
  
    return (
      <div>
        <Button type="primary" onClick={() => { setVisible(true);}}>
          员工注册
        </Button>
        <CollectionCreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => { setVisible(false);}}
        />  
      </div>
    );
  };

  const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form4.useForm();
    return (
      <Modal
        visible={visible}
        title="员工注册"
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
          <Form4.Item name="username" label="用户名"
            rules={[{
                required: true,
                message: 'Please input the username!',
              },]}>
            <Input />
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
          <Form4.Item name="telephone" label="电话" rules={[{
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

export default StaffLoginForm