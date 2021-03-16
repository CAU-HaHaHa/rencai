import React from 'react'
import moment from 'moment';
import { Button, Row, Col, Card, Table, message, Input, BackTop, Modal, DatePicker, Slider} from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { withRouter } from 'react-router';
import {
  observer,
  inject,
} from 'mobx-react'
import appStore from '../../../store/appStore'
import jixiaoCheckRequest from '../../../api/jixiaoCheckRequest'
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';

const { confirm } = Modal;
const { Column } = Table;
const { RangePicker } = DatePicker;

@withRouter @inject('appStore') @observer
export default class JixiaoCheckDemo extends React.Component {
  
  state = {
    dataSource:[],
    isLoaded:[],
    dataSelect:[],
    searchCorname: "",
    searchDep: "",
    searchPost: "",
    searchDate:["0000-00-00",moment().format('YYYY-MM-DD')],
    searchValue: [0,10],
    columns: [{
        title: '公司名称',
        dataIndex: 'corporation_id',
        key: 'corporation_id'
    },{
        title: '部门',
        dataIndex: 'department',
        key: 'department',
    },{
        title: '职位',
        dataIndex: 'post',
        key: 'post',
    },{
        title: '绩效分数',
        dataIndex: 'value',
        key: 'value'
    },{
        title: '记录人',
        dataIndex: 'hr_name',
        key: 'hr_name'
    },{
        title: '记录时间',
        dataIndex: 'registerdate',
        key: 'registerdate',
    }]
  };

  componentDidMount() {
    const _this = this;
    let data = jixiaoCheckRequest(appStore.loginUser.userid);
    console.log(data,"data")
    axios.all([data]).then(
      res => {
        _this.setState({
          dataSource: res[0].data.data,
          dataSelect: res[0].data.data,
          isLoaded: true
        });
      }
    ).catch(
      (err)=>{
        alert("未知错误11")
      }
    )
  }
  
  //  改变查询条件
  inputChange = (event, flag) => {
    console.log(event.target.value, "***", flag)
    if (flag == "corporation_id")
      this.setState({
        searchCorname: event.target.value
      })
    else if (flag == "department")
      this.setState({
        searchDep: event.target.value
      })
    else if (flag == "dutytype")
      this.setState({
        searchPost: event.target.value
      })
    else
      alert("Wrong input!")
  }

  // date设置
  disabledDate(current) {
    // Can not select days after today
    return current && current > moment().endOf('day');
  }
  handleSelectTime = (value,dateString) => {
    console.log('选择的时间：', value)
    if(value==null){
      this.setState({searchDate:["0000-00-00",moment().format('YYYY-MM-DD')]})
    }
    else{
      this.setState({searchDate:dateString},()=>console.log(this.state.searchDate,'searchdate'))
    }
  }
  comparetime = (value)=>{
    console.log('要比较的的时间：', value)
    console.log('选择的时间:',this.state.searchDate)
    const dates=this.state.searchDate;
    var year = Number(value.slice(0,4));
    var mon = Number(value.slice(5,7));
    var day = Number(value.slice(8,10));
    var lyear = Number(dates[0].slice(0,4));
    var lmon = Number(dates[0].slice(5,7));
    var lday = Number(dates[0].slice(8,10));
    if(year>lyear || 
      (year==lyear && mon>lmon) || 
      (year==lyear && mon==lmon && day>=lday)){

      var ryear = Number(dates[1].slice(0,4));
      var rmon = Number(dates[1].slice(5,7));
      var rday = Number(dates[1].slice(8,10));
      // console.log(year,mon,day,ryear,rmon,rday);
      
      if((year<ryear) || 
        (year==ryear && mon<rmon) || 
        (year==ryear && mon==rmon && day<=rday)){
  
        console.log("time ready");
        return true;
      }
    }
    console.log("time false");
    return false;
  }

  // 改变分数段
  onChange(value) {
    console.log('onChange: ', value);
  }
  
  onAfterChange=(value)=> {
    console.log('onAfterChange: ', value);
    this.setState({searchValue:value})
  }

  // 查询
  onClick = () => {
    let newdata = []
    for (const temp of this.state.dataSource) {
      if (temp.corporation_id == this.state.searchCorname || this.state.searchCorname == "") {
        if (temp.department == this.state.searchDep || this.state.searchDep == ""){
          if (temp.post == this.state.searchPost || this.state.searchPost == ""){
            if(temp.value>=this.state.searchValue[0] && temp.value<=this.state.searchValue[1]){
             if(this.comparetime(temp.registerdate)){
                console.log(temp)
                newdata.push({
                  corporation_id: temp.corporation_id,
                  user_name: temp.user_name,
                  department: temp.department,
                  post: temp.post,
                  value: temp.value,
                  registerdate: temp.registerdate,
                  description: temp.description,
                  hr_name: temp.hr_name,
                })
              }
            }
          }
        }
      }
    }
    this.setState({
      dataSelect: newdata
    })
    console.log(this.state.dataSelect)
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
        <CustomBreadcrumb arr={['个人信息处理', '绩效查看']} />
          <Card hoverable title="绩效查看" className='card-item' block>
            <Row gutter = {30}>
                <Col span={4}>
                  <Input addonBefore="公司:" placeholder=" " onChange={(event) => { this.inputChange(event, "corporation_id") }} />
                </Col>
                <Col span={4}>
                  <Input addonBefore="部门:" placeholder=" " onChange={(event) => { this.inputChange(event, "department") }} />
                </Col>
                <Col span={4}>
                  <Input addonBefore="职位:" placeholder=" " onChange={(event) => { this.inputChange(event, "dutytype") }} />
                </Col>
            </Row>
            <p></p>
            <Row gutter = {10}>
                <Col>
                    选择时间段： 
                    <RangePicker disabledDate={this.disabledDate} onChange={this.handleSelectTime}/>
                </Col>
                <Col push={1}> 选择分数段：</Col>
                <Col span={5} push={1}>
                    <Slider 
                        range  
                        max={10}
                        defaultValue={[0, 10]}
                        onChange={this.onChange}
                        onAfterChange={this.onAfterChange}
                    />
                </Col>
                <Col push={2}>
                    <Button type="primary" shape="round" icon={<SearchOutlined />} onClick={this.onClick}> 查找 </Button>
                </Col>
            </Row>
          </Card>
        </div>
        <div>
          <Card hoverable>
            <Table
              columns={this.state.columns}
              expandable={{
                expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
              }}
              dataSource={this.state.dataSelect}
            ></Table>  
          </Card>
        </div>
        <BackTop>
          <div style={upToTopStyle}>UP</div>
        </BackTop>
      </div >
    )
  }
} 