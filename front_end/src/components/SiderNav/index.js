import React from 'react'
import CustomMenu from "../CustomMenu/index";
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { getCookie } from '../../utils/Session'
import logo from './logo.png'
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
      {key: '/home/dangan/corporation', title: '公司档案', icon: '',},
      {key: '/home/dangan/list', title: '人力总览', icon: '',},
      {key: '/home/dangan/jixiao', title: '绩效管理', icon: '',},
      {key: '/home/dangan/jiangcheng', title: '奖惩管理', icon: '',},
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
    title: '档案管理',
    icon: 'laptop',
    key: '/home/staffdangan',
    subs: [
      {key: '/home/staffdangan/basicinfo', title: '基本信息', icon: '',},
      {key: '/home/staffdangan/jixiao', title: '我的绩效', icon: '',},
      {key: '/home/staffdangan/jiangcheng', title: '我的奖惩', icon: '',},
    ]
  },
  {
    title: '职业生涯发展',
    icon: 'laptop',
    key: '/home/zhiye',
    subs: [
      {key: '/home/zhiye/gangwei', title: '岗位池', icon: '',},
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
          <div style={styles.logo}>
            <h3 style={styles.contentStyle}>ZY</h3>
          </div>
          <CustomMenu menus={menus1}/>
        </div>
      )
    }
    else{
      return (
        <div style={{height: '100vh',overflowY:'scroll'}}>
          <div style={styles.logo}>
            <h3 style={styles.contentStyle}>ZY</h3>
          </div>
          <CustomMenu menus={menus2}/>
        </div>
      )
    }
  }
}
const styles = {
  contentStyle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logo: {
    height: '32px',
    margin: '16px'
  }
}
export default SiderNav