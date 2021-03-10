import React,{Component} from 'react';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import axios from 'axios';
import {  Table } from 'antd';
import { Input,Button } from 'antd';
import { DatePicker} from 'antd';
import './ui.less'
const { RangePicker } = DatePicker;
const { TextArea } = Input;

//开始
class JixiaoAddDemo extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.match.params.id)    
        this.state = {
            //用于页面传值 
            //thisdata : this.props.match.params.dotData, 
            //thisdata : this.props.location.state,
            thisdata : this.props.match.params.id,
            dataSelect : [],
            dataSourcep : [],
            columns: [{
                    title: '用户ID',
                    dataIndex: 'user_id',
                    key: 'user_id'
                },{
                    title: '评价HR',
                    dataIndex: 'hr_id',
                    key: 'hr_id'
                },{
                    title: '绩效分数',
                    dataIndex: 'value',
                    key: 'value'
                },{
                    title: '部门',
                    dataIndex: 'department',
                    key: 'department',
                },{
                    title: '职位',
                    dataIndex: 'post',
                    key: 'post',
                },{
                    title: '记录时间',
                    dataIndex: 'registerdate',
                    key: 'registerdate',
                }]

        }
        this.Searchjixiao = this.Searchjixiao.bind(this);
        this.handleclickbtn = this.handleclickbtn.bind(this);
    }

  //点击返回按钮事件——点击跳转
  handleclickbtn(){
    this.props.history.push({pathname:'/home/dangan/jixiao'});
  }

  Searchjixiao(){
    // this.setState({
    //     searchContent: this.props.match.params.id,
    //   })
    console.log(3333333)
    let testdata = []
    console.log(this.props.match.params.id)  
    console.log(this.state.dataSourcep)
    for (const temp of this.state.dataSourcep) 
    {
        console.log(6666666)
        console.log(temp.id)
        if (temp.user_id == this.props.match.params.id) {
        //   console.log(temp)
        //   console.log(this.props.match.params.id)
        testdata.push({
            hr_id: temp.hr_id,
            user_id: temp.user_id,
            department: temp.department,
            value: temp.value,
            post: temp.post,
            description: temp.description,
            registerdate:temp.registerdate
          })
        }
    }
    this.setState({
        dataSelect: testdata
      })
    console.log(this.state.dataSelect)
}

   //api
    componentDidMount() {
        const _this = this;
        //https://60418bef7f50e000173aa942.mockapi.io/api/vi/dataSourcep
        axios.get('http://45.76.99.155/dangan/performance/dataSource')
        .then(function(response) {
            _this.setState({
                dataSourcep: response.data.data,
                isLoaded: true
            });
        });
    }

    render() {       
        const {
            dataSourcep,
            columns
        } = this.state;
        //console.log(44444444)
        this.state.dataSourcep
        console.log(this.state.dataSourcep)
        //console.log(55555555)
        return(
            <div>
                <CustomBreadcrumb arr={['员工档案管理','绩效评价' ,'绩效详情查看']}/>
                 <Button type="primary" onClick={this.Searchjixiao}>点击查询</Button> 
                 <Button type="primary" onClick={this.handleclickbtn}>点击返回</Button> 
                 <Table
                  columns={columns}
                  expandable={{
                    expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                    rowExpandable: record => record.user_id!== 'Not Expandable',
                    }}
                  dataSource={this.state.dataSelect}
                 ></Table>  
            </div>
        )
    }
}
export default JixiaoAddDemo;

