import React from 'react'
import {BackTop} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import {Table, Space ,Col,Row,Form,Card} from 'antd';
import { Button,Modal,InputNumber } from 'antd';
import './ui.less'
import { Input } from 'antd';
import { DatePicker} from 'antd';
import axios from 'axios';
import Qs from 'qs'
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Column } = Table;
// //数据库插入信息语句（插入绩效信息）
// router.post("/",(req,res) =>{
//   const { errors,isValid } = validatorInput(req.body);
//   // 接受数据库语句
//   var sql = "insert into user values (?,?,?,?,?,?,?)";
//   var arr = [req.body.performance_id,req.body.corporation_id,req.body.user_id,req.body.hr_id,req.body.value,req.body.description,req.body.registerdate];
//   if(isValid){
//       sqlFn(sql,arr,function(data){
//           if(data.affectedRows){
//               res.send({success:true})
//           }else{
//               res.status(400).json({error:'插入失败'});
//           }
//       })
//   }else{
//       res.status(400).json(errors);
//   }
// })


//开始
class JixiaoDemo extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      modalAddInfoVisible: false, //新增信息Modal的显示属性
      dataselect:[],
      datasource: [],
      searchcorporation_id: "",     
      searchuser_id: "",
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
    else if (flag == "user_id")
      this.setState({
        searchuser_id: event.target.value
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
      temp.hr_id+=''
      temp.value+=''
      temp.user_id+=''
      temp.department+=''
      temp.post+=''
      console.log(temp.department, typeof (temp.department))
      if (temp.post == this.state.searchpost || this.state.searchpost == "") {
        if (temp.user_id == this.state.searchuser_id || this.state.searchuser_id == "")
          if (temp.hr_id == this.state.searchhr_id || this.state.searchhr_id == "")
            if (temp.value == this.state.searchvalue || this.state.searchvalue == "") 
              if (temp.department == this.state.searchdepartment || this.state.searchdepartment == ""){
                console.log(temp)
                testdata.push({
                  corporation_id: temp.corporation_id,
                  user_id: temp.user_id,
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
    console.log(this.state.adddescription)
    console.log(this.state.addvalue)
    console.log(this.state.addcorporation_id)
    console.log(this.state.adduser_id)
    console.log(this.state.addhr_id)  
    console.log(this.state.addpost) 
    console.log(this.state.adddepartment)   
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
    // axios({
    //   method: "post",
    //   url:"/dangan/jixiao/insert",
    //   // data:Qs.stringify(this.state.data)
    //   data:params
      
    // }).then((res)=>{
    //   console.log(res.data);
    //   console.log(11111);
    //   console.log(params);
    // })
    // const _this = this;
    // axios.post('/dangan/jixiao/insert')
    //   .then(function(response){
    //     _this.setState({
    //       user_id: _this.state.adduser_id,
    //       corporation_id: _this.state.addcorporation_id,
    //       value:_this.state.addvalue+0,
    //       post:_this.state.addpost,
    //       description:_this.state.adddescription,
    //       department:_this.state.adddepartment,
    //       hr_id:_this.state.addhr_id
    //     });
    //   });
     

  }
  
  //api
  componentDidMount() {
    const _this = this;
    // http://127.0.0.1:5000/dangan/performance/datasource
    // http://http://45.76.99.155/dangan/performance/datasource
    //
    axios.get('http://45.76.99.155/dangan/performance/newdataSource')
      .then(function(response) {
        _this.setState({
          datasource: response.data.data,
          dataselect: response.data.data,
          isLoaded: true
        });
    });
  } 

  render() {
    return (
      <div>
        <CustomBreadcrumb arr={['员工档案管理','绩效评价']}/>   
          <Form>
            <Row>
              <Col span={6}>
                <Form.Item name="user_id" label="员工ID:">
                <Input placeholder="请输入ID" onChange={(event) => { this.inputChange(event, "user_id") }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="value" label="绩效">
                <Input placeholder="请输入绩效分数" onChange={(event) => { this.inputChange(event, "value") }} /> 
                </Form.Item>                 
              </Col>
              <Col span={6}>
                <Form.Item name="department" label="部门">
                <Input placeholder="请输入部门" onChange={(event) => { this.inputChange(event, "department") }} /> 
                </Form.Item>                 
              </Col>
              <Col span={6}>
                <Form.Item name="post" label="职位">
                <Input placeholder="请输入职位" onChange={(event) => { this.inputChange(event, "post") }} /> 
                </Form.Item>                 
              </Col>
              <Col span={6} style={{ textAlign: 'middle', }}>
                {/* <Button type="primary" icon=" 点击查询 " onClick={this.Search}></Button> */}
                <Button type="primary" onClick={this.Search}>查询</Button>
              </Col>
            </Row>
          </Form>
          <Table dataSource={this.state.dataselect}>
            <Column title="公司ID" dataIndex="corporation_id" key="corporation_id" />
            <Column title="用户ID" dataIndex="user_id" key="user_id" />
            <Column title="最新绩效" dataIndex="value" key="value" />
            <Column title="部门" dataIndex="department" key="department" />
            <Column title="职位" dataIndex="post" key="post" />
            <Column title="记录时间" dataIndex="registerdate" key="registerdate" />
            <Column
              title="Action"
              key="action"
              render={(text, record) => (
                <Space size="middle">
                  <Button type="primary" onClick={()=>this.openModalAddInfo("modalAddInfo",record)}>增加绩效</Button>
                  <Button type="primary" onClick={()=>this.handleclickbtn(record.user_id)}>查看绩效</Button>
                </Space>
              )}
            />
            <BackTop visibilityHeight={200} style={{right: 50}}/>
          </Table>
        <Modal title="增加绩效"
          visible={this.state.modalAddInfoVisible}
          wrapClassName="vertical-center-modal"
          onCancel={()=>{
          this. setState({modalAddInfoVisible: false})
          }} 
                //onOk={()=>this. add} 
          onOk={()=>{
          this. addnew("modalAddInfo")
          }} 
        >
          {/* <Space direction="vertical" size={12}>
          <span>填写时间：</span><DatePicker showTime onChange={onChange} onOk={onOk} />
          {/* <span>填写时间：</span><DatePicker showTime onChange={(event) => { this.inputChange1(event, "regisdates") }} onOk={onOk} /> */}
          {/* <span>绩效评定起止时间：</span>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChange}
              onOk={onOk}
              //onChange={(event) => { this.inputChange(event, "dates") }}
            />
          // </Space> */}
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