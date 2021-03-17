import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import {Table, Space ,Col,Row,Card ,Drawer, message,Descriptions} from 'antd';
import { ExclamationCircleOutlined} from '@ant-design/icons';
import { Button,Modal } from 'antd';
import { Input } from 'antd';
import axios from 'axios';
import { observer, inject } from "mobx-react"
import { withRouter } from 'react-router-dom'
const { confirm } = Modal;

@withRouter @inject('appStore') @observer
export default class Myzhaopin extends React.Component{
  constructor(props){ 
    super(props);
    this.setDrawerVisible = this.setDrawerVisible.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.state={
      userid: "",
      modalOKInfoVisible: false, //前往确认Modal的显示属性
      dataSource:[],
      dataselect:[],
      searchposttype:"",
      searchdepartment:"",
      isOffer:"",
      detailRow: {},
      dictTitle: {
        "corporation_id": "公司ID",
        "department": "部门",
        "posttype": "岗位",
        "description": "岗位描述",
        "registrationdate": "投递日期",
      },
      Column : [
        {
          title:"公司ID" ,
          dataIndex:"corporation_id" ,
          key:"corporation_id",
        },
        {
          title:"部门" ,
          dataIndex:"department" ,
          key:"department"
        },
        {
          title:"岗位" ,
          dataIndex:"posttype" ,
          key:"posttype"
        },
        {
          title:"岗位要求" ,
          dataIndex:"description" ,
          key:"description"
        },
        {
          title:"申请时间" ,
          dataIndex:"registrationdate" ,
          key:"registrationdate"
        },
        {
          title:"投递状态" ,
          dataIndex:"get_offer" ,
          key:"get_offer",
          render:(text,record)=>{
            let span='';
            console.log(record.get_offer);
            if (record.get_offer == 0){
              span = <span style={{color:'#343434'}}>已投递</span>
            }else if(record.get_offer == 1){
              span = <span style={{color:'#F5222E'}}>等待确认offer</span>
            }else if(record.get_offer == 2){
              span = <span style={{color:'#708090'}}>已结束</span>
            }else if(record.get_offer == 3){
              span = <span style={{color:'#FFD700'}}>您的offer已过期</span>
            }else if(record.get_offer == 4){
              span = <span style={{color:'#000080'}}>您已接收此offer</span>
            }
            return(
                <div>{span}</div>
            )
          }
        },
        {
          // title:"操作" ,
          key:"action",
          render:(text,record)=>{
            if (record.get_offer == 0){
              return(
                <Space size="middle">     
                <Button type="primary" disabled>不可操作</Button>
                <Button type="primary" onClick={this.showDrawer.bind(this, record)}>查看详情</Button>
                </Space>          
              )
            }else if(record.get_offer == 1){
              return(        
              <Space size="middle">     
              <Button type="primary"  onClick={()=>this.showConfirm(record.offer_out_of_date,record.recruitpost_id)}>前往确认</Button>
              <Button type="primary"  onClick={this.showDrawer.bind(this, record)}>查看详情</Button>
              </Space>
              )
            }else if(record.get_offer == 2){
              return(
                <Space size="middle">     
                <Button type="primary" disabled>不可操作</Button>
                <Button type="primary" onClick={this.showDrawer.bind(this, record)}>查看详情</Button>
                </Space>          
              )
            }else if(record.get_offer == 3){
              return(
                <Space size="middle">     
                <Button type="primary" disabled>不可操作</Button>
                <Button type="primary" onClick={this.showDrawer.bind(this, record)}>查看详情</Button>
                </Space>          
              )
            }else if(record.get_offer == 4){
              return(
                <Space size="middle">     
                <Button type="primary" disabled>不可操作</Button>
                <Button type="primary" onClick={this.showDrawer.bind(this, record)}>查看详情</Button>
                </Space>          
              )
            }
          }
        }
      ]

    }
    
  }

  // 弹窗
  showDrawer(row) {
    console.log(row)
    this.setState({
      detailRow: Object.assign({}, row)
    })
    this.setDrawerVisible()
  }
  // 弹窗
  setDrawerVisible = () => {
      this.setState({
        drawerVisible: !this.state.drawerVisible
      })
    }
   // 获取检索条目
   inputChange = (event, flag) => {
    console.log(event, "***", flag)
    if (flag == "department")
      this.setState({
        searchdepartment: event.target.value
      })
    else if (flag == "posttype")
      this.setState({
        searchposttype: event.target.value
      })
    else
      alert("Wrong input!")
    console.log(this.state.searchdepartment)
  } 
  // 确认操作
  showConfirm = (offer_out_of_date,rid) =>{
      console.log("rid")
      console.log(rid)
      const _this = this;
      // 设置提示语
      confirm({
        title: '操作确认',
        icon: <ExclamationCircleOutlined />,
        content:(<p>您已通过面试，请确认接收offer！ <br /> 您的offer有效期至：{offer_out_of_date}.</p>),
        // 点击确定
        onOk() {
          var isOK=111;
          console.log('OK');
          axios({
            method:'get',
            url: 'http://45.76.99.155/Zhiye/Myzhaopin/isOK',
            params :{
              //user_id: this.props.appStore.loginUser.userid
              user_id: 1
            }
          }).then(function(response){
            console.log(response.data)
            isOK=response.data.data;  //标志位
            console.log(isOK);
            if (isOK == 1)
            {
              console.log('isOK=1');
              message.error('您尚未从原公司离职，请先办理离职手续！');
            }
            else if (isOK == 0)
            {
              console.log('isOK=0');          
              axios({
                method:'get',
                url: 'http://45.76.99.155/Zhiye/Myzhaopin/getoffer',
                params :{
                  //user_id: this.props.appStore.loginUser.userid
                  user_id: 1,
                  recruitpost_id: rid
                }
              }).then(function(response){
                console.log(response.data)
              })    
              message.info('您已接收offer，可个人信息页进行核查。');     
              
              axios({
                method:'get',
                url: 'http://45.76.99.155/Zhiye/Myzhaopin/dataSource',
                params :{
                  //user_id: this.props.appStore.loginUser.userid
                  user_id: 1
                }
              }).then(function(response){
                console.log(response.data)
                _this.setState({
                         dataSource: response.data.data,
                         dataselect: response.data.data,
                         isLoaded: true
                });
              })              
            }     
          })
        },
        //点击取消
          onCancel() {
          console.log('Cancel');
        },
      });

    }
  //api
  componentDidMount() {
    const _this = this;
    axios({
      method:'get',
      url: 'http://45.76.99.155/Zhiye/Myzhaopin/dataSource',
      params :{
        //user_id: this.props.appStore.loginUser.userid
        user_id: 1
      }
    }).then(function(response){
      console.log(response.data)
      _this.setState({
               dataSource: response.data.data,
               dataselect: response.data.data,
               isLoaded: true
      });
    })
   
    // axios.get('http://45.76.99.155/Zhiye/Myzhaopin/dataSource',params)
    //   .then(function(response) {
    //     console.log(response.data)
    //     _this.setState({
    //       //dataSource: response.data.data,
    //      // dataselect: response.data.data,
    //       isLoaded: true
    //     });
    // });
  } 
 //点击查询按钮，进行多条件检索
 Search = (event) => {
  let testdata = []
  for (const temp of this.state.dataSource) {
    temp.posttype+=''
    temp.department+=''
    console.log(temp.department, typeof (temp.department))
    if (temp.department == this.state.searchdepartment || this.state.searchdepartment == "") {
      if (temp.posttype == this.state.searchposttype || this.state.searchposttype == ""){
              console.log(temp)
              testdata.push({
                corporation_id: temp.corporation_id,
                department: temp.department,
                posttype: temp.posttype,
                description: temp.description,
                registrationdate: temp.registrationdate,
                get_offer: temp.get_offer
              })
          }
    }
    this.setState({
      dataselect: testdata
    })
    console.log(this.state.dataselect)
  }
}


  render(){
    console.log(1111)
    console.log(this.props.appStore.loginUser.userid)
    return (
      <div>
        <div>
        <CustomBreadcrumb arr={['职业生涯发展', '我的招聘']} />
          <Card hoverable title="我的招聘" className='card-item' block>
            <Space direction="vertical">
              <Row gutter={20}>
                <Col span={8}>
                  <Input addonBefore="部门名称:" placeholder="" onChange={(event) => { this.inputChange(event, "department") }} />
                </Col>
                <Col span={8}>
                  <Input addonBefore="岗位:" placeholder=" " onChange={(event) => { this.inputChange(event, "posttype") }} />
                </Col>
                <Col span={4}>
                  <Button type="primary" onClick={this.Search} block>
                      确认
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>
        </div>
        <Card hoverable>
          <Table columns={this.state.Column} dataSource={this.state.dataselect}/>
        </Card>
          <Drawer
          title="投递详情"
          placement="right"
          closable
          width={650}
          onClose={() => this.setDrawerVisible()}
          visible={this.state.drawerVisible}
        >
          <Card>
          <Descriptions column={2} title="" bordered>
            <Descriptions.Item align='center' label="公司ID" >{this.state.detailRow.corporation_id}</Descriptions.Item>
            <Descriptions.Item align='center' label="部门" >{this.state.detailRow.department}</Descriptions.Item>
            <Descriptions.Item align='center' label="职位" >{this.state.detailRow.posttype}</Descriptions.Item>
            <Descriptions.Item align='center' label="岗位描述" >{this.state.detailRow.description}</Descriptions.Item>
            <Descriptions.Item align='center' label="投递日期" >{this.state.detailRow.registrationdate}</Descriptions.Item>
          </Descriptions>
          </Card>
        </Drawer>
      </div> 
    )
  }
}