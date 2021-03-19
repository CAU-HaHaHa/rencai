import React,{Component} from 'react';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import axios from 'axios';
import {  Table ,Card,Space,Col,Row} from 'antd';
import { Input,Button } from 'antd';
import { DatePicker} from 'antd';
import { observer, inject } from "mobx-react"
import { withRouter } from 'react-router-dom'
import './ui.less'
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@withRouter @inject('appStore') @observer
//开始
class JixiaoAddDemo extends React.Component {
    constructor(props) {
        super(props);
        console.log("didi")
        console.log(this.props.match.params.id)
        console.log(this.props.appStore.loginUser.corporationid)      
        this.state = {
            //用于页面传值 
            //thisdata : this.props.match.params.dotData, 
            //thisdata : this.props.location.state,
            //thisdata : this.props.match.params.id,
            dataSelect : [],
            dataSourcep : [],
            columns: [
                {
                    title: "员工姓名",
                    dataIndex: "name",
                    key: "name"
                },
                {
                    title: '评价HR',
                    dataIndex: 'hr_id',
                    key: 'hr_id'
                },
                {
                    title: '绩效分数',
                    dataIndex: 'value',
                    key: 'value'
                },
                {
                    title: '部门',
                    dataIndex: 'department',
                    key: 'department',
                },
                {
                    title: '职位',
                    dataIndex: 'post',
                    key: 'post',
                },
                {
                    title: '记录时间',
                    dataIndex: 'registerdate',
                    key: 'registerdate',
                }
            ]

        }
        //this.Searchjixiao = this.Searchjixiao.bind(this);
        this.handleclickbtn = this.handleclickbtn.bind(this);
    }

  //点击返回按钮事件——点击跳转
  handleclickbtn(){
    this.props.history.push({pathname:'/home/dangan/jixiao'});
  }

  // 获取检索条目
  inputChange = (event, flag) => {
    console.log(event, "***", flag)
    if (flag == "value")
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
    for (const temp of this.state.dataSourcep) {
      temp.value+=''
      if (temp.value == this.state.searchvalue || this.state.searchvalue == "") {
              {
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

   //点击查询按钮，进行多条件检索
 Search1 = (event) => {
    let testdata = []
    for (const temp of this.state.dataSourcep) {
      this.state.searchvalue*=1
      if (temp.value <= this.state.searchvalue || this.state.searchvalue == "") {
              {
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


   //api
    componentDidMount() 
    {
        const _this = this;
        axios({
            method:'get',
            url: 'http://45.76.99.155/dangan/performance/datauserid',
            params :{
              corporation_id: this.props.appStore.loginUser.corporationid,
              user_id: this.props.match.params.id
              //corporation_id: 1
            }
          }).then(function(response){
            console.log(response.data)
            _this.setState({
                     dataSourcep: response.data.data,
                     dataselect: response.data.data,
                     isLoaded: true
            });
          })
    }

    render() 
    {       
        const {
            dataSourcep,
            columns
        } = this.state;
        //console.log(44444444)
        //console.log(55555555)
        return(
            <div>
                <div>
                <CustomBreadcrumb arr={['员工档案管理','绩效评价' ,'绩效详情查看']}/>
                 {/* <Button type="primary" onClick={this.Searchjixiao}>点击查询</Button> 
                 <Button type="primary" onClick={this.handleclickbtn}>点击返回</Button>  */}
                 <Card hoverable title="绩效详情查看" className='card-item' block>
                    <Space direction="middle">
                        <Row gutter={20}>
                        <Col span={8}>
                            <Input addonBefore="绩效:" placeholder=" " onChange={(event) => { this.inputChange(event, "value") }} />     
                        </Col>
                        <Col span={5}>
                            <Button type="primary" onClick={this.Search} block>
                                精确查询
                            </Button>
                        </Col>
                        <Col span={5}>
                            <Button type="primary" onClick={this.Search1} block>
                                范围查询
                            </Button>
                        </Col>
                        <Col span={5}>
                            <Button type="primary" onClick={this.handleclickbtn} block>
                                返回上一级
                            </Button>
                        </Col>
                    </Row>
                    </Space>
                </Card>
                </div>
                <Card hoverable>
                 <Table
                  columns={columns}
                  expandable={{
                    expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                    rowExpandable: record => record.user_id!== 'Not Expandable',
                    }}
                  dataSource={this.state.dataselect}
                 ></Table>  
                 </Card>
            </div>
        )
    }
}
export default JixiaoAddDemo;

