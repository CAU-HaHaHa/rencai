import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'
import { inject, observer } from 'mobx-react/index'
import { getCookie } from '../../utils/Session'
import {loginRequest} from '../../api/loginRequest'
import axios from "axios";
const Home = LoadableComponent(()=>import('../../routes/Home/index'))  //参数一定要是函数，否则不会懒加载，只会代码拆分
//档案Demo
const ListDemo = LoadableComponent(()=>import('../../routes/Dangan/ListDemo/index'))
const JixiaoDemo = LoadableComponent(()=>import('../../routes/Dangan/JixiaoDemo/index'))
const JiangchengDemo = LoadableComponent(()=>import('../../routes/Dangan/JiangchengDemo/index'))
const JiangchengviweDemo = LoadableComponent(()=>import('../../routes/Dangan/JiangchengDemo/view'))
const HRLiZhiDemo = LoadableComponent(()=>import('../../routes/Dangan/HRLiZhiDemo/index'))
const corpStructure = LoadableComponent(()=>import('../../routes/Dangan/corpStructure/index'))


//导航组件Demo
const RencaiDemo = LoadableComponent(()=>import('../../routes/Navigation/RencaiDemo/index'))
const RencaiViewDemo = LoadableComponent(()=>import('../../routes/Navigation/RencaiDemo/view'))
//new
const JixiaoAddDemo = LoadableComponent(()=>import('../../routes/Dangan/JixiaoDemo/add'))

//职业生涯发展
const jixiaocheckDemo = LoadableComponent(()=>import('../../routes/Test/JixiaoCheckDemo/index'))
const StfLiZhiDemo = LoadableComponent(()=>import('../../routes/Test/stfLiZhiDemo/index'))

//关于
const About = LoadableComponent(()=>import('../../routes/About/index'))

const basicInfo = LoadableComponent(()=>import('../../routes/staffDangan/basicInfo/index'))
const Myzhaopin = LoadableComponent(()=>import('../../routes/Test/Myzhaopin/index'))

@withRouter @inject('appStore') @observer
class ContentMain extends React.Component {
  refresh(){
    ///  请求数据库返回结果
    let cookie = getCookie();
    let data = loginRequest(
      cookie[0], 
      cookie[1],
      cookie[2],
      );
    axios.all([data]).then(
      res => {
        if(cookie[2]=="1"){
          this.props.appStore.toggleLogin(true, 
            {
              username: cookie[0], 
              password: cookie[1], 
              usertype: cookie[2], 
              userid: res[0].data.data.hr_id,
              corporationid: res[0].data.data.corporation_id,
            });
        }
        else{
          this.props.appStore.toggleLogin(true, 
            {
              username: cookie[0], 
              password: cookie[1], 
              usertype: cookie[2], 
              userid: res[0].data.data.user_id,
              corporationid: res[0].data.data.corporation_id,
            });
        }
      }).catch(
        ()=>{
          alert("未知错误")
        }
      )
  }
  render () {
    if(this.props.appStore.loginUser.usertype==null){
      this.refresh();
    }
    if(this.props.appStore.loginUser.usertype=="1"){
      return (
        <div style={{padding: 16, position: 'relative'}}>
          <Switch>
            <PrivateRoute exact path='/homeHr' component={Home}/>

            {/* 档案管理 */}
            <PrivateRoute exact path='/home/dangan/corporation' component={corpStructure}/>
            <PrivateRoute exact path='/home/dangan/list' component={ListDemo}/>
            <PrivateRoute exact path='/home/dangan/jixiao' component={JixiaoDemo}/>
            <PrivateRoute exact path='/home/dangan/jiangcheng' component={JiangchengDemo}/>
            <PrivateRoute exact path='/home/dangan/jiangcheng/view/:id' component={JiangchengviweDemo}/>
            <PrivateRoute exact path='/home/dangan/hrlizhi' component={HRLiZhiDemo}/>
            <PrivateRoute exact path='/add/:id' component={JixiaoAddDemo}/>
            {/* 人才招聘 */}
            <PrivateRoute exact path='/home/navigation/rencai' component={RencaiDemo}/>
            <PrivateRoute exact path='/home/navigation/rencai/view/:id/:department/:posttype' component={RencaiViewDemo}/>
            <PrivateRoute exact path='/home/navigation/fabu' component={Home}/>
            
            <PrivateRoute exact path='/home/about' component={About}/>
            <Redirect exact from='/' to='/homeHr' component={Home}/>
          </Switch>
        </div>
      )
    }
    else{
      return (
        <div style={{padding: 16, position: 'relative'}}>
          <Switch>
            <PrivateRoute exact path='/homeStaff' component={Home}/>
            {/* 个人档案管理 */}
            <PrivateRoute exact path='/home/staffdangan/basicinfo' component={basicInfo}/>
            <PrivateRoute exact path='/home/staffdangan/jixiao' component={jixiaocheckDemo}/>
            <PrivateRoute exact path='/home/staffdangan/jiangcheng' component={Home}/>

            {/* 职业生涯发展 */}
            <PrivateRoute exact path='/home/zhiye/gangwei' component={Home}/>
            <PrivateRoute exact path='/home/zhiye/myzhaopin' component={Myzhaopin}/>
            <PrivateRoute exact path='/home/zhiye/lizhi' component={StfLiZhiDemo}/>
            <Redirect exact from='/' to='/homeStaff' component={Home}/>
          </Switch>
        </div>
      )
    }
  }
}
export default ContentMain