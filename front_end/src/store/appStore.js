import {observable, action} from 'mobx'
import {isAuthenticated,authenticateSuccess,logout} from '../utils/Session'

class AppStore {
  @observable isLogin = !!isAuthenticated()  //利用cookie来判断用户是否登录，避免刷新页面后登录状态丢失
  // @observable users = []  //模拟用户数据库
  @observable loginUser = {}  //当前登录用户信息
  /*  loginUser 具体数据如下：
    username,  // 用户名
    password,  // 密码
    usertype,  // 用户类型（1为hr，2为员工）
    userid,    // 用户id
    corporationid, // 公司id
  */

  @action toggleLogin(flag,info={}) {
    this.loginUser = info  //设置登录用户信息
    if (flag) {
      authenticateSuccess(
        info.username,  // 用户名
        info.password,  // 密码
        info.usertype,  // 用户类型（1为hr，2为员工）
      )
      this.isLogin = true
    } else {
      logout()
      this.isLogin = false
    }

  }
  // @action initUsers() {
  //   // const localUsers = localStorage['users']?JSON.parse(localStorage['users']):[]
  //   // this.users = [{username: 'admin', password: 'admin'},...localUsers]
  //   this.users = [
  //     {username: 'hr01', password: '123456'},
  //     {username: 'staff', password: 'staff'},
  //   ]
  // }
}

export default new AppStore()