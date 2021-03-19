import React from 'react'
import { Button, Row, Col, Card, Checkbox, message, Input, BackTop, Descriptions, Modal} from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { withRouter } from 'react-router';
import {
  observer,
  inject,
} from 'mobx-react'
import appStore from '../../../store/appStore'
import stafflizhiRequest from '../../../api/stafflizhiRequest'
import stafflizhiApply from '../../../api/stafflizhiApply'
import {ExclamationCircleOutlined} from '@ant-design/icons';

const { TextArea } = Input;
const { confirm } = Modal;

@withRouter @inject('appStore') @observer
export default class StfLiZhiDemo extends React.Component {
  
  state = {
    dataSource:[],
    isLoaded:[],
    checked:false,
    isDisabled:true,
    dictTitle: {
      "user_name": "姓名",
      "department": "部门",
      "dutytype": "岗位",
    },
    nothing:" ",
  };

  componentDidMount() {
    if(appStore.loginUser.corporationid==0){
      message.error(' 无在职信息，无法申请离职！ ');
      // 禁用提交按钮
      this.setState({isDisabled:true});
    }
    else{
      // 向后端请求数据
      const _this = this;
      let data = stafflizhiRequest(appStore.loginUser.userid);
      console.log(data,"data")
      axios.all([data]).then(
        res => {
          _this.setState({
            dataSource: res[0].data.data,
            isLoaded: true
          },
          ()=>{if(this.state.dataSource["flag"]==1){
            message.info(' 您已提交过申请，不能重复申请，请耐心等待审核 ');
            // 禁用提交按钮
            this.setState({isDisabled:true});
          }else{
            // 启用提交按钮
            this.setState({isDisabled:false});
          }}
          );
        }
      ).catch(
        (err)=>{
          alert("未知错误11")
        }
      )
    }
  }
  
  // 获得输入框的数据
  inputChange = (event) => {
    this.setState({
      text:event.target.value
    })
  }
  
  // 检查checkbox是否勾选
  onChange=(e)=> {
    console.log(`checked = ${e.target.checked}`);
    this.setState({
      checked:e.target.checked
    })
  }
  
  // 提交申请
  onClick = () => {
    if(this.state.checked){
      const _this = this;
      confirm({
        title: '操作确认',
        icon: <ExclamationCircleOutlined />,
        content:"确定要提交离职申请吗？",
        // 点击确定
        onOk() {
          console.log('OK');
          stafflizhiApply(appStore.loginUser.userid,_this.state.text);
          message.info("申请提交成功，请耐心等待审核");
            
          // 重新请求数据    ---------------------------------------------
          let data = stafflizhiRequest(appStore.loginUser.userid);
          console.log(data,"data")
          axios.all([data]).then(
            res => {
              _this.setState({
                dataSource: res[0].data.data,
                isLoaded: true
              });
            }
          ).catch(()=>{alert("未知错误11")})
            // 重新请求数据结束-----------------------------------------------
        },
        //点击取消
        onCancel() {
          console.log('Cancel');
        }
      });
      console.log(this.state);
      this.setState({isDisabled:true});
    }else{
      // 如果checkbox没有勾的提示
      message.info('请确认与上级领导沟通，达成一致后再提交申请');
    }
  }

  render() {
    const upToTopStyle = {
      height: 40,
      width: 60,
      lineHeight: '40px',
      borderRadius: 4,
      backgroundColor: '#1088e9',
      color: '#fff',
      textAlign: 'center',
      fontSize: 21,
    };
    return (
      <div>
        <div className="site-page-header-ghost-wrapper">
        <CustomBreadcrumb arr={['职业生涯发展', '离职申请']} />
          <Card hoverable title="离职申请" className='card-item' block>
            <Descriptions size="middle" column={5}>
                <Descriptions.Item label="姓名">{this.state.dataSource["user_name"]} </Descriptions.Item>
                <Descriptions.Item label="部门">{this.state.dataSource["department"]}   </Descriptions.Item>
                <Descriptions.Item label="岗位">{this.state.dataSource["dutytype"]}   </Descriptions.Item>
            </Descriptions>
            </Card>
        </div>
        <div>
          <Card hoverable>
            <TextArea placeholder="请输入200字内离职原因" allowClear onChange={(event)=>{ this.inputChange(event) }} showCount maxLength={200} rows={10}/>
            <p></p>
                <Checkbox onChange={this.onChange}> 我已经与上级领导沟通，达成一致 </Checkbox>
            <p></p>
            <Row justify="end">
                <Col span={2}>
                  <Button disabled={this.state.isDisabled} shape="round" type="primary" onClick={()=>this.onClick()} block>
                    提交
                  </Button>
                </Col>
            </Row>
          </Card>
          
        </div>
        <BackTop>
          <div style={upToTopStyle}>UP</div>
        </BackTop>
      </div >
    )
  }
} 