import React from 'react'
import CustomMenu from "../CustomMenu/index";
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { getCookie } from '../../utils/Session'

const menus1 = [
  {
    title: 'HR首页',
    icon: 'home',
    key: '/homeHr'
  },
  {
    title: '员工档案管理',
    icon: 'laptop',
    key: '/home/dangan',
    subs: [
      {key: '/home/dangan/list', title: '员工列表', icon: '',},
      {key: '/home/dangan/jixiao', title: '绩效评价', icon: '',},
      {key: '/home/dangan/jiangcheng', title: '员工奖惩', icon: '',},
    ]
  },
  {
    title: '导航组件',
    icon: 'bars',
    key: '/home/navigation',
    subs: [
      {key: '/home/navigation/rencai', title: '备选人才', icon: ''},
      {key: '/home/navigation/dropdown', title: '下拉菜单', icon: ''},
      {key: '/home/navigation/menu', title: '导航菜单', icon: ''},
      {key: '/home/navigation/steps', title: '步骤条', icon: ''},
    ]
  },
  {
    title: '输入组件',
    icon: 'edit',
    key: '/home/entry',
    subs: [
      {
        key: '/home/entry/form',
        title: '表单',
        icon: '',
        subs: [
          {key: '/home/entry/form/basic-form', title: '基础表单', icon: ''},
          {key: '/home/entry/form/step-form', title: '分步表单', icon: ''}
        ]
      },
      {key: '/home/entry/upload', title: '上传', icon: ''},
    ]
  },
  {
    title: '关于',
    icon: 'info-circle-o',
    key: '/home/about'
  }
]

const menus2 = [
  {
    title: '员工首页',
    icon: 'home',
    key: '/homeStaff'
  },
  {
    title: 'test',
    icon: 'laptop',
    key: '/home/test',
    subs: [
      {key: '/home/test/test1', title: 'test1', icon: '',},
      {key: '/home/test/test2', title: 'test2', icon: '',},
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