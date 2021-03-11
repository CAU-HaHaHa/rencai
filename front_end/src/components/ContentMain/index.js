import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'
import { inject, observer } from 'mobx-react/index'
import { getCookie } from '../../utils/Session'
import loginRequest from '../../api/loginRequest'
import axios from "axios";

const Home = LoadableComponent(()=>import('../../routes/Home/index'))  //参数一定要是函数，否则不会懒加载，只会代码拆分

//档案Demo
const ListDemo = LoadableComponent(()=>import('../../routes/Dangan/ListDemo/index'))
const JixiaoDemo = LoadableComponent(()=>import('../../routes/Dangan/JixiaoDemo/index'))
const JiangchengDemo = LoadableComponent(()=>import('../../routes/Dangan/JiangchengDemo/index'))
const JiangchengviweDemo = LoadableComponent(()=>import('../../routes/Dangan/JiangchengDemo/view'))

//导航组件Demo
const DropdownDemo = LoadableComponent(()=>import('../../routes/Navigation/DropdownDemo/index'))
const MenuDemo = LoadableComponent(()=>import('../../routes/Navigation/MenuDemo/index'))
const StepsDemo = LoadableComponent(()=>import('../../routes/Navigation/StepsDemo/index'))

//输入组件Demo
const FormDemo1 = LoadableComponent(()=>import('../../routes/Entry/FormDemo/FormDemo1'))
const FormDemo2 = LoadableComponent(()=>import('../../routes/Entry/FormDemo/FormDemo2'))
const UploadDemo = LoadableComponent(()=>import('../../routes/Entry/UploadDemo/index'))
//new
const JixiaoAddDemo = LoadableComponent(()=>import('../../routes/Dangan/JixiaoDemo/add'))

//员工页面测试Demo
const Test1 = LoadableComponent(()=>import('../../routes/Test/Test1/index'))
const Test2 = LoadableComponent(()=>import('../../routes/Test/Test2/index'))

// //显示组件Demo
// const CarouselDemo = LoadableComponent(()=>import('../../routes/Display/CarouselDemo/index'))
// const CollapseDemo = LoadableComponent(()=>import('../../routes/Display/CollapseDemo/index'))
// const ListDemo = LoadableComponent(()=>import('../../routes/Display/ListDemo/index'))
// const TableDemo = LoadableComponent(()=>import('../../routes/Display/TableDemo/index'))
// const TabsDemo = LoadableComponent(()=>import('../../routes/Display/TabsDemo/index'))


//关于
const About = LoadableComponent(()=>import('../../routes/About/index'))

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
      this.props.appStore.toggleLogin(true, 
        {
          username: cookie[0], 
          password: cookie[1], 
          usertype: cookie[2], 
          userid: res[0].data.data.hr_id,
          corporationid: res[0].data.data.corporation_id,
        });
      }).catch(
        ()=>{
          alert("未知错误")
        }
      )
  }

  render () {
    return (
      <div style={{padding: 16, position: 'relative'}}>
        <Switch>
          <PrivateRoute exact path='/home' component={Home}/>

          <PrivateRoute exact path='/home/dangan/list' component={ListDemo}/>
          <PrivateRoute exact path='/home/dangan/jixiao' component={JixiaoDemo}/>
          <PrivateRoute exact path='/home/dangan/jiangcheng' component={JiangchengDemo}/>
          <PrivateRoute exact path='/home/dangan/jiangcheng/view/:id' component={JiangchengviweDemo}/>

          <PrivateRoute exact path='/home/navigation/dropdown' component={DropdownDemo}/>
          <PrivateRoute exact path='/home/navigation/menu' component={MenuDemo}/>
          <PrivateRoute exact path='/home/navigation/steps' component={StepsDemo}/>

          <PrivateRoute exact path='/home/entry/form/basic-form' component={FormDemo1}/>
          <PrivateRoute exact path='/home/entry/form/step-form' component={FormDemo2}/>
          <PrivateRoute exact path='/home/entry/upload' component={UploadDemo}/>

          {/* new */}
          <PrivateRoute exact path='/add/:id' component={JixiaoAddDemo}/>

          {/* <PrivateRoute exact path='/home/display/carousel' component={CarouselDemo}/>
          <PrivateRoute exact path='/home/display/collapse' component={CollapseDemo}/>
          <PrivateRoute exact path='/home/display/list' component={ListDemo}/>
          <PrivateRoute exact path='/home/display/table' component={TableDemo}/>
          <PrivateRoute exact path='/home/display/tabs' component={TabsDemo}/> */}

          {/* <PrivateRoute exact path='/home/feedback/modal' component={ModalDemo}/>
          <PrivateRoute exact path='/home/feedback/notification' component={NotificationDemo}/>
          <PrivateRoute exact path='/home/feedback/spin' component={SpinDemo}/> */}

          {/* <PrivateRoute exact path='/home/other/animation' component={AnimationDemo}/>
          <PrivateRoute exact path='/home/other/gallery' component={GalleryDemo}/>
          <PrivateRoute exact path='/home/other/draft' component={DraftDemo}/>
          <PrivateRoute exact path='/home/other/chart' component={ChartDemo}/>
          <PrivateRoute exact path='/home/other/loading' component={LoadingDemo}/>
          <PrivateRoute exact path='/home/other/404' component={ErrorPage}/>
          <PrivateRoute exact path='/home/other/springText' component={SpringText}/> */}

          <PrivateRoute exact path='/home/about' component={About}/>

          <Redirect exact from='/' to='/home'/>
        </Switch>
      </div>
    )
  }
}

export default ContentMain