import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { Table, Button,  Form, DatePicker, Input, Row, Col, Card } from 'antd';
import { SearchOutlined} from '@ant-design/icons';
import axios from 'axios'


const { TextArea } = Input;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

export default class RencaiDemo extends React.Component {
    constructor(props) {
        super(props);    
    }
    state = {
        searchContent: "",
        size: 'default',
        dataSource: [],
        originaldataSource:[],
        dataSpecific: [],
        searchdepartment: "",
        searchposttype: "",
        searchnumber: "",
        detailRow: {},
        columns: [
          {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
          },
          {
            title: '岗位',
            dataIndex: 'posttype',
            key: 'posttype',
          },
          {
            title: '拟录人数',
            dataIndex: 'number',
            key: 'number',
          },
          {
            title: '发布日期',
            dataIndex: 'registerdate',
            key: 'registerdate',
          },
          {
            key: 'action',
            render: (row) => (
               <Button type="primary" icon={<SearchOutlined />} onClick={this.ClickViewHandle.bind(this,row.recruitpost_id,row.department,row.posttype)} shape="round">
                查看投递
               </Button>)
          }
        ],
      }
    

      componentDidMount() {
        const _this = this;
        axios.get('http://45.76.99.155/rencai/show?corporation_id=1')
          .then(function (response) {
            _this.setState({
              dataSource: response.data['data'],
              originaldataSource :response.data['data'],
              isLoaded: true
            });
          });
      }

    ClickViewHandle = (recruitpost_id,department_name,posttype_name) => { 
      this.props.history.push({ pathname:'./rencai/view/'+recruitpost_id+'/'+department_name+'/'+posttype_name})
    }
    
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
          else if (flag == "number")
          this.setState({
            searchnumber: event.target.value
          })
        else
          alert("Wrong input!")
      } 

      Clear = (event) =>{
        this.setState({
            dataSource: this.state.originaldataSource
          })
      }
      Search = (event) => {
        let testdata = []
        for (const temp of this.state.originaldataSource) {
          console.log("in",temp.name)
          if (temp.department == this.state.searchdepartment || this.state.searchdepartment == "") {
            if (temp.posttype == this.state.searchposttype || this.state.searchposttype == "")
                if (temp.number == this.state.searchnumber || this.state.searchnumber == "") {
                  console.log(temp)
                  testdata.push({
                    department: temp.department,
                    posttype: temp.posttype,
                    registerdate: temp.registerdate,
                    number: temp.number
                  })
                }
          }
          this.setState({
            dataSource: testdata
          })
          console.log(this.state.dataSource)
        }
      }

    render() {
      return (
        <div>
          {/* 导航 */}
          <CustomBreadcrumb arr={['人才招聘工作台', '备选人才']} />
          {/* 招募人搜索框 */}
          <Card hoverable bordered={false} className='card-item'>
              <Form>
          <Row gutter={12}>
            <Col span={5} key={1}>
              <Form.Item name="department" label="部门">
              <Input placeholder="请输入部门" onChange={(event) => { this.inputChange(event, "department") }}/>
              </Form.Item>
            </Col>
            <Col span={5} key={2}>
              <Form.Item name="posttype" label="岗位">
                <Input placeholder="请输入岗位" onChange={(event) => { this.inputChange(event, "posttype") }}/>
              </Form.Item>
            </Col>
            <Col span={6} key={4}>
            <Form.Item name="number" label="拟录人数">
                <Input placeholder="请输入拟录人数" onChange={(event) => { this.inputChange(event, "number") }}/>
              </Form.Item>
            </Col>
            <Col  style={{ textAlign: 'right', }}>

              <Button  type="primary" htmlType="submit" onClick={this.Search}>  &nbsp; 查&nbsp;&nbsp;询 &nbsp;  </Button>
            </Col>
            <Col  style={{ textAlign: 'right', }}>            
              <Button  type="primary" htmlType="submit" onClick={this.Clear}>   &nbsp;取&nbsp;&nbsp;消 &nbsp;  </Button>
            </Col>
          </Row>
          </Form>
          </Card>
          {/* 展示数据 */}
          <Table columns={this.state.columns} dataSource={this.state.dataSource} pagination={{pageSize:4}} />
        </div>
      )
    }
  
  }

