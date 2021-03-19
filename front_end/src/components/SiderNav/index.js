import React from 'react'
import CustomMenu from "../CustomMenu/index";
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { getCookie } from '../../utils/Session'
import logo from './logo.png'
import HRLiZhiDemo from '../../routes/Dangan/HRLiZhiDemo';
const menus1 = [
  {
    title: 'HR首页',
    icon: 'home',
    key: '/homeHr'
  },
  {
    title: '档案管理',
    icon: 'laptop',
    key: '/home/dangan',
    subs: [
      {key: '/home/dangan/corporation', title: '公司架构', icon: '',},
      {key: '/home/dangan/list', title: '员工列表', icon: '',},
      {key: '/home/dangan/jixiao', title: '绩效评价', icon: '',},
      {key: '/home/dangan/jiangcheng', title: '员工奖惩', icon: '',},
      {key: '/home/dangan/hrlizhi', title: '离职管理', icon: '',},
    ]
  },
  {
    title: '人才招聘工作台',
    icon: 'bars',
    key: '/home/navigation',
    subs: [
      {key: '/home/navigation/fabu', title: '发布招聘岗位', icon: ''},
      {key: '/home/navigation/rencai', title: '备选人才', icon: ''},
    ]
  },
]
const menus2 = [
  {
    title: '员工首页',
    icon: 'home',
    key: '/homeStaff'
  },
  {
    title: '个人档案管理',
    icon: 'laptop',
    key: '/home/staffdangan',
    subs: [
      {key: '/home/staffdangan/basicinfo', title: '基本信息管理', icon: '',},
      {key: '/home/staffdangan/jixiao', title: '绩效查看', icon: '',},
      {key: '/home/staffdangan/jiangcheng', title: '奖惩查看', icon: '',},
    ]
  },
  {
    title: '职业生涯发展',
    icon: 'laptop',
    key: '/home/zhiye',
    subs: [
      {key: '/home/zhiye/gangwei', title: '招聘岗位', icon: '',},
      {key: '/home/zhiye/myzhaopin', title: '我的招聘', icon: '',},
      {key: '/home/zhiye/lizhi', title: '离职申请', icon: '',},
    ]
  },
]
@withRouter @inject('appStore') @observer
class SiderNav extends React.Component {
  render() {
    if(getCookie()[2]=="1"){
      return (
        <div style={{height: '100vh',overflowY:'scroll'}}>
          <div style={styles.logo}></div>
          <CustomMenu menus={menus1}/>
        </div>
      )
    }
    else{
      return (
        <div style={{height: '100vh',overflowY:'scroll'}}>
          <div style={styles.logo}></div>
          <CustomMenu menus={menus2}/>
        </div>
      )
    }
  }
}
const styles = {
  logo: {
    height: '32px',
    background: 'rgba(255, 255, 255, .2)',
    margin: '16px'
  }
}
export default SiderNav