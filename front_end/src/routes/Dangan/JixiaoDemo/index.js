import React from 'react'
import {BackTop} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import {Table, Space ,Col,Row,Form,Card,message} from 'antd';
import { Button,Modal,InputNumber } from 'antd';
import { Input } from 'antd';
import { DatePicker} from 'antd';
import axios from 'axios';
import { observer, inject } from "mobx-react"
import { withRouter } from 'react-router-dom'

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Column } = Table;

@withRouter @inject('appStore') @observer
//开始
class JixiaoDemo extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      modalAddInfoVisible: false, //新增信息Modal的显示属性
     
      dataselect:[],
      datasource: [],
      searchcorporation_id: "",     
      searchname: "",
      searchhr_id: "",
      searchvalue: "",
      searchpost: "",
      searchdepartment: "",
      addcorporation_id:"",
      adduser_id:"",
      addhr_id:"",
      addvalue:"",
      adddescription:"",
      addpost:"",
      adddepartment:"",
      addage:""
    }
    this.handleclickbtn = this.handleclickbtn.bind(this);
    
    this.addnew = this.addnew.bind(this);
  }

  //查看详情按钮事件——点击跳转并传参
  handleclickbtn= (type)=>{
    this.props.history.push({pathname:'/add/'+type});
  }

  //设置一个弹出框可见,type为传入的变量，用于标识点了哪个按钮,并记录基本信息
  openModalAddInfo = (type,record)=>{
    console.log(1111123132132)
    this.setState({
      
      addcorporation_id: record.corporation_id,
      adduser_id: record.user_id,
      addhr_id: record.hr_id,
      addpost: record.post,
      adddepartment: record.department,
      [type+"Visible"]: true
    })
    console.log(record.user_id)
    console.log(record.hr_id)
    console.log(record.corporation_id)
    console.log(this.state.addcorporation_id)
    console.log(this.state.adduser_id)
    console.log(this.state.addhr_id)
  }

  //获取添加绩效框中填写的数据
  inputChange1 = (event, flag) => {
    console.log(98989998)
    console.log(event.target.value)
    if (flag == "value")
      this.setState({
        addvalue: event.target.value
      })
    else if (flag == "description")
      this.setState({
        adddescription: event.target.value
      })
    else
      alert("Wrong input!")
  }
   // 获取检索条目
  inputChange = (event, flag) => {
    console.log(event, "***", flag)
    if (flag == "post")
      this.setState({
        searchpost: event.target.value
      })
    else if (flag == "name")
      this.setState({
        searchname: event.target.value
      })
    else if (flag == "department")
      this.setState({
        searchdepartment: event.target.value
      })
    else if (flag == "value")
      this.setState({
        searchvalue: event.target.value
      })
    else
      alert("Wrong input!")
    console.log(this.state.searchdepartment)
  } 
 //点击查询按钮，进行多条件检索
  Search = (event) => {
    let testdata = []
    for (const temp of this.state.datasource) {
      temp.corporation_id+=''
      temp.name+=''
      temp.value+=''
      temp.user_id+=''
      temp.department+=''
      temp.post+=''
      console.log(temp.department, typeof (temp.department))
      if (temp.post == this.state.searchpost || this.state.searchpost == "") {
        if (temp.name == this.state.searchname || this.state.searchname == "")
          if (temp.hr_id == this.state.searchhr_id || this.state.searchhr_id == "")
            if (temp.value == this.state.searchvalue || this.state.searchvalue == "") 
              if (temp.department == this.state.searchdepartment || this.state.searchdepartment == ""){
                console.log(temp)
                testdata.push({
                  corporation_id: temp.corporation_id,
                  name: temp.name,
                  hr_id: temp.hr_id,
                  value: temp.value,
                  department: temp.department,
                  post: temp.post,
                  registerdate:temp.registerdate
                })
            }
      }
      this.setState({
        dataselect: testdata
      })
      console.log(this.state.dataselect)
    }
  }

  //添加到数据库
  addnew= (type)=>{
    // console.log(this.state.adddescription)
    // console.log(this.state.addvalue)
    // console.log(this.state.addcorporation_id)
    // console.log(this.state.adduser_id)
    // console.log(this.state.addhr_id)  
    // console.log(this.state.addpost) 
    // console.log(this.state.adddepartment)
    // if (this.state.addvalue.isnumeric()!=1){
    //   message.error('请输入1-10的数字！');
    // }
    if (this.state.addvalue>10 ||this.state.addvalue<=0){
      message.error('请输入1-10的数字！');
    }
    var re = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
　　if (!re.test(this.state.addvalue)) {
  　　message.error('请输入1-10的数字！');
　　}
    const _this = this;  
    this.setState({
      [type+"Visible"]: false
    })
    var params =new URLSearchParams();
    params.append('user_id',this.state.adduser_id);
    params.append('corporation_id',this.state.addcorporation_id);
    params.append('value',this.state.addvalue);
    params.append('post',this.state.addpost);
    params.append('description',this.state.adddescription);
    params.append('department',this.state.adddepartment);
    params.append('hr_id',this.state.addhr_id);
    for (var [a, b] of params.entries()) {
      console.log(a, b);
    }
    axios.post('http://45.76.99.155/dangan/jixiao/insert',params).then((res)=>{console.log(res.data)});

    axios({
      method:'get',
      url: 'http://45.76.99.155/dangan/performance/newdataSource',
      params :{
        corporation_id: this.props.appStore.loginUser.corporationid
        //corporation_id: 1
      }
    }).then(function(response){
      console.log(response.data)
      _this.setState({
               datasource: response.data.data,
               dataselect: response.data.data,
               isLoaded: true
      });
    })

  }
  
  //api
  componentDidMount() {
     const _this = this;
    // axios.get('http://45.76.99.155/dangan/performance/newdataSource')
    //   .then(function(response) {
    //     _this.setState({
    //       datasource: response.data.data,
    //       dataselect: response.data.data,
    //       isLoaded: true
    //     });
    // });

    console.log(this.props.appStore.loginUser.corporationid)
    axios({
      method:'get',
      url: 'http://45.76.99.155/dangan/performance/newdataSource',
      params :{
        corporation_id: this.props.appStore.loginUser.corporationid
        //corporation_id: 1
      }
    }).then(function(response){
      console.log(response.data)
      
      _this.setState({
               datasource: response.data.data,
               dataselect: response.data.data,
               isLoaded: true
      });
    })
  } 

  render() {
    console.log(this.props.appStore.loginUser) 
    return (
      <div>
        <div>
        <CustomBreadcrumb arr={['员工档案管理', '绩效评价']} />
          <Card hoverable title="绩效评价" className='card-item' block>
            <Space direction="vertical">
              <Row gutter={20}>
                <Col span={5}>
                  <Input addonBefore="员工姓名:" placeholder="" onChange={(event) => { this.inputChange(event, "name") }} />
                </Col>
                <Col span={5}>
                  <Input addonBefore="绩效:" placeholder=" " onChange={(event) => { this.inputChange(event, "value") }} />
                </Col>
                <Col span={5}>
                  <Input addonBefore="部门:" placeholder="" onChange={(event) => { this.inputChange(event, "department") }} />
                </Col>
                <Col span={5}>
                  <Input addonBefore="职位:" placeholder=" " onChange={(event) => { this.inputChange(event, "post") }} />
                </Col>
                <Col span={2}>
                  <Button type="primary" onClick={this.Search} block>
                       查询
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>
        </div>
        <Card hoverable>
          <Table dataSource={this.state.dataselect}>
            <Column title="员工姓名" dataIndex="name" key="name" />
            <Column title="最新绩效" dataIndex="value" key="value" />
            <Column title="部门" dataIndex="department" key="department" />
            <Column title="职位" dataIndex="post" key="post" />
            <Column title="记录时间" dataIndex="registerdate" key="registerdate" />
            <Column
              title=""
              key="action"
              render={(text, record) => (
                <Space size="middle">
                  <Button type="primary" onClick={()=>this.openModalAddInfo("modalAddInfo",record)}>增加绩效</Button>
                  <Button type="primary" onClick={()=>this.handleclickbtn(record.user_id)}>查看绩效</Button>
                </Space>
              )}
            />
            {/* <BackTop visibilityHeight={200} style={{right: 50}}/> */}
          </Table>
          </Card>
        <Modal title="增加绩效"
          visible={this.state.modalAddInfoVisible}
          wrapClassName="vertical-center-modal"
          onCancel={()=>{
          this. setState({modalAddInfoVisible: false})
          }} 
                //onOk={()=>this. add} 
          onOk={()=>{
          this. addnew("modalAddInfo");
          }} 
        >
          <span>绩效评分：</span><Input onChange={(event) => { this.inputChange1(event, "value") }} />
          {/* <span>绩效评分：</span><InputNumber min={1} max={10} defaultValue={3} onChange={(event) => { this.inputChange1(event, "value") }} /> */}
          <br />
          <span>绩效描述：</span><TextArea rows={4} onChange={(event) => { this.inputChange1(event, "description") }}/>
          {/* <span>绩效描述：</span><TextArea rows={4} onChange={(event) => { this.inputChange1(event, "description") }} /> */}
        </Modal> 
      </div>
    );
  }
}

const styles = {
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    width: '17%'
  },
  icon: {
    fontSize: 18,
    marginBottom: 10
  },
  affixBox: {
    position: 'absolute',
    top: 100,
    right: 50,
    with: 170
  }
}
export default JixiaoDemo