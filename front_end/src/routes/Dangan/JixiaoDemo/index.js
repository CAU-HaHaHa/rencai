import React from 'react'
import {BackTop} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { Table, Space ,Col,Row} from 'antd';
import { Button,Modal,InputNumber,Card } from 'antd';
import './ui.less'
import { Input } from 'antd';
import { DatePicker} from 'antd';
import axios from 'axios';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;

function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}
function onOk(value) {
  console.log('onOk: ', value);
}
function onChange(value) {
  console.log('changed', value);
}

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
      searchid: "",
      searchname: "",
      searchage: "",
      searchposition: "",
      adddate:"",
      adddescription:"",
      addvalue:"",
      addid:"",
      addname:"",
      addposition:"",
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
    this.setState({[type+"Visible"]: true})
    this.setState({
      addid:record.id,
      addage:record.age,
      addname:record.name,
      addposition:record.position
    })
  }

  //获取添加绩效框中填写的数据
  inputChange1 = (event, flag) => {
    console.log(event, "***", flag)
    if (flag == "regisdates")
      this.setState({
        adddate: event.target.value
      })
    else if (flag == "value")
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
    if (flag == "id")
      this.setState({
        searchid: event.target.value
      })
    else if (flag == "name")
      this.setState({
        searchname: event.target.value
      })
    else if (flag == "age")
      this.setState({
        searchage: event.target.value
      })
    else if (flag == "position")
      this.setState({
        searchposition: event.target.value
      })
    else
      alert("Wrong input!")
  } 
 //点击查询按钮，进行多条件检索
  Search = (event) => {
    let testdata = []
    for (const temp of this.state.dataSource) {
      if (temp.id == this.state.searchid || this.state.searchid == "") {
        if (temp.name == this.state.searchname || this.state.searchname == "")
          if (temp.age == this.state.searchage || this.state.searchage == "")
            if (temp.position == this.state.searchposition || this.state.searchposition == "") {
              console.log(temp)
              testdata.push({
                id: temp.id,
                name: temp.name,
                age: temp.age,
                position: temp.position
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
  add(){
// //数据库插入信息语句（插入绩效信息）
// router.post("/",(req,res) =>{
//   const { errors,isValid } = validatorInput(req.body);
//   // 接受数据库语句
//   var sql = "insert into user values (?,?,?,?)";
//   var arr = [addid,addvalue,adddescription,adddate];
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
  }
  
  //api
  componentDidMount() {
    const _this = this;
    axios.get('https://60418bef7f50e000173aa942.mockapi.io/api/vi/dataSource')
    .then(function(response) {
        _this.setState({
            dataSource: response.data,
            isLoaded: true
        });
    });
  } 

  render() {
    const {
      dataSource,
    } = this.state;
    return (
      <div>
        <CustomBreadcrumb arr={['员工档案管理','绩效评价']}/>
        <Row gutter={16}>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
              <h1  > 绩效总览：</h1>
              <Table dataSource={dataSource}>
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="ID" dataIndex="id" key="id" />
                <Column title="Age" dataIndex="age" key="age" />
                <Column title="Position" dataIndex="position" key="position" />
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <Space size="middle">
                      <Button type="primary" onClick={()=>this.openModalAddInfo("modalAddInfo",record)}>增加绩效</Button>
                      <Button type="primary" onClick={()=>this.handleclickbtn(record.id)}>查看绩效</Button>
                    </Space>
                  )}
                />
              <BackTop visibilityHeight={200} style={{right: 50}}/>
              </Table>
            </Card>
          </Col>
        
        <Col span={12}>
            <Card bordered={false} className='card-item'>
              <p>
                <Row>
                <Col span={12}>
                    <Input addonBefore="根据ID查询:" placeholder="请输入ID" onChange={(event) => { this.inputChange(event, "id") }} />
                </Col>
                <Col span={12}>
                    <Input addonBefore="根据姓名查询：" placeholder="请输入姓名" onChange={(event) => { this.inputChange(event, "name") }} />
                </Col>
                <Col span={12}>
                    <Input addonBefore="根据年龄查询" placeholder="请输入年龄" onChange={(event) => { this.inputChange(event, "age") }} />
                </Col>
                <Col span={12}>
                    <Input addonBefore="根据职位查询" placeholder="请输入职位" onChange={(event) => { this.inputChange(event, "position") }} />
                </Col>
                </Row>
                <Space size="middle">
                  <Button type="primary" icon="查询" onClick={this.Search}></Button>
                </Space>
                <Table dataSource={this.state.dataselect}>
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="ID" dataIndex="id" key="id" />
                    <Column title="Age" dataIndex="age" key="age" />
                    <Column title="Position" dataIndex="position" key="position" />
                    <Column
                      title="Action"
                      key="action"
                      render={(text, record) => (
                        <Space size="middle">
                          <Button type="primary" onClick={()=>this.openModalAddInfo("modalAddInfo",record)}>增加绩效</Button>
                          <Button type="primary" onClick={()=>this.handleclickbtn(record.id)}>查看绩效</Button>
                        </Space>
                      )}
                    />
                <BackTop visibilityHeight={200} style={{right: 50}}/>
                </Table>       
            </p>
            </Card>
        </Col>
        </Row>
        <Modal title="增加绩效"
                visible={this.state.modalAddInfoVisible}
                wrapClassName="vertical-center-modal"
                onCancel={()=>{
                this. setState({modalAddInfoVisible: false})
                }} 
                //onOk={()=>this. add} 
                onOk={()=>{
                  this. setState({modalAddInfoVisible: false}) + this.add
                }} 
        >
          <Space direction="vertical" size={12}>
          <span>填写时间：</span><DatePicker showTime onChange={onChange} onOk={onOk} />
          {/* <span>填写时间：</span><DatePicker showTime onChange={(event) => { this.inputChange1(event, "regisdates") }} onOk={onOk} /> */}
          <span>绩效评定起止时间：</span>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChange}
              onOk={onOk}
              //onChange={(event) => { this.inputChange(event, "dates") }}
            />
          </Space>
          <br />
          <br />
          <span>绩效评分：</span><InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
          {/* <span>绩效评分：</span><InputNumber min={1} max={10} defaultValue={3} onChange={(event) => { this.inputChange1(event, "value") }} /> */}
          <br />
          <span>绩效描述：</span><TextArea rows={4} />
          {/* <span>绩效描述：</span><TextArea rows={4} onChange={(event) => { this.inputChange1(event, "description") }} /> */}
        </Modal> 
      </div>
    )
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