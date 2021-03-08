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
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    render: text => <a>{text}</a>
                },{
                    title: '评价HR',
                    dataIndex: 'hr_id',
                    key: 'hr_id'
                },{
                    title: '绩效分数',
                    dataIndex: 'value',
                    key: 'value'
                },{
                    title: '评价时间',
                    dataIndex: 'time',
                    key: 'time'
                }]
        }
        this.Searchjixiao = this.Searchjixiao.bind(this);
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
        if (temp.id == this.props.match.params.id) {
        //   console.log(temp)
        //   console.log(this.props.match.params.id)
        testdata.push({
            id: temp.id,
            hr_id: temp.hr_id,
            value: temp.value,
            time: temp.time,
            reason: temp.reason
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
        axios.get('https://60418bef7f50e000173aa942.mockapi.io/api/vi/dataSourcep')
        .then(function(response) {
            _this.setState({
                dataSourcep: response.data,
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
                 <Table
                  columns={columns}
                  expandable={{
                    expandedRowRender: record => <p style={{ margin: 0 }}>{record.reason}</p>,
                    rowExpandable: record => record.id !== 'Not Expandable',
                    }}
                  dataSource={this.state.dataSelect}
                 ></Table>  
            </div>
        )
    }
}
export default JixiaoAddDemo;


                {/* <Modal title="绩效详情"
                        visible={this.state.modalCheckInfoVisible}
                        wrapClassName="vertical-center-modal"
                        onCancel={()=>{
                        this. setState({modalCheckInfoVisible: false})
                        }} >
                    <Space direction="vertical" size={12}>
                    <span>填写时间：</span><DatePicker showTime onChange={onChange} onOk={onOk}/>
                    </Space>
                    <br />
                    <br />
                    <span>绩效评分：</span><InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                    <br />
                    <span>绩效描述：</span><TextArea rows={4} />
                </Modal>  */}