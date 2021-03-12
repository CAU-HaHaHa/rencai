import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { Table, Button,  Form, DatePicker, Input, Row, Col, Card,Select,Drawer} from 'antd';
import { SearchOutlined} from '@ant-design/icons';
import axios from 'axios'

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default class RencaiViewDemo extends React.Component {
    constructor(props) {
        super(props);    
        this.setDrawerVisible = this.setDrawerVisible.bind(this);
        this.recruitpost_id = this.props.match.params.id;
        this.department = this.props.match.params.department;
        this.posttype = this.props.match.params.posttype;
        console.log(this.recruitpost_id)
    }
    state = {
        department:"",
        posttype:"",
        searchContent: "",
        size: 'default',
        dataSource: [],
        originaldataSource:[],
        dataSpecific: [],
        searchname: "",
        searchsex: "",
        searchage: "",
        searchedubackground: "",
        searcheduschool: "",
        detailRow: {},
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: '学历',
            dataIndex: 'edubackground',
            key: 'edubackground',
          },
          {
            title: '学校',
            dataIndex: 'eduschool',
            key: 'eduschool',
          },
          {
            title: '电话',
            dataIndex: 'tel',
            key: 'tel',
          },
          {
            key: 'action1',
            render: (row) => (
               <Button type="primary" icon={<SearchOutlined />} onClick={this.ClickViewHandle1.bind(this,row.applylist_id)} shape="round">
                批准
               </Button>
               )
          },
          {
            key: 'action2',
            render: (row) => ( 
               <Button type="primary" icon={<SearchOutlined />} onClick={() => this.showDrawer(row)} shape="round">
                查看
               </Button>
               
               )
          },
          {
            key: 'action3',
            render: (row) => (
               <Button type="primary" icon={<SearchOutlined />} onClick={this.ClickViewHandle3.bind(this,row.applylist_id)} shape="round">
                拒绝
               </Button>
               
               )
          }
        ],
      }

      ClickViewHandle1 = (applylist_id)=> {
        console.log('http://45.76.99.155/rencai/enroll?applylist_id='+applylist_id)
       axios.get('http://45.76.99.155/rencai/enroll?applylist_id='+applylist_id)
       const _this = this;
       console.log('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id='+this.recruitpost_id)
       axios.get('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id='+this.recruitpost_id)
         .then(function (response) {
           _this.setState({
             dataSource: response.data['data'],
             originaldataSource :response.data['data'],
             isLoaded: true
           });
         });
      }

      ClickViewHandle3=(applylist_id)=> {
        console.log('http://45.76.99.155/rencai/refuse?applylist_id='+applylist_id)
       axios.get('http://45.76.99.155/rencai/refuse?applylist_id='+applylist_id)
       const _this = this;
       console.log('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id='+this.recruitpost_id)
       axios.get('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id='+this.recruitpost_id)
         .then(function (response) {
           _this.setState({
             dataSource: response.data['data'],
             originaldataSource :response.data['data'],
             isLoaded: true
           });
         });
      }

      componentDidMount() {
        const _this = this;
        console.log('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id='+this.recruitpost_id)
        axios.get('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id='+this.recruitpost_id)
          .then(function (response) {
            _this.setState({
              dataSource: response.data['data'],
              originaldataSource :response.data['data'],
              isLoaded: true
            });
          });
      }
    
    
    inputChange2 = (event, flag) => {
        console.log(event, "***", flag)
        if (flag == "name")
          this.setState({
            searchname: event.target.value
          })
        else if (flag == "sex")
          this.setState({
            searchsex: event.target.value
          })
          else if (flag == "age")
          this.setState({
            searchage: event.target.value
          })
          else if (flag == "edubackground")
          this.setState({
            searchedubackground: event.target.value
          })
          else if (flag == "eduschool")
          this.setState({
            searcheduschool: event.target.value
          })
        else
          alert("Wrong input!")
      } 

      setDrawerVisible = () => {
        this.setState({
          drawerVisible: !this.state.drawerVisible
        })
    
      }
        // new
  showDrawer(row) {
    console.log(row)
    this.setState({
      detailRow: Object.assign({}, row)
    })
    this.setDrawerVisible()
  }

      Clear2 = (event) =>{
        this.setState({
            dataSource: this.state.originaldataSource 
          })
      }

      Search2 = (event) => {
        let testdata = []
        console.log(this.state.originaldataSource)
        for (const temp of this.state.originaldataSource) {
          console.log("in",temp.name)
          if (temp.name == this.state.searchname || this.state.searchname == "") {
            if (temp.sex == this.state.searchsex || this.state.searchsex == "")
            if (temp.age == this.state.searchage || this.state.searchage == "")
            if (temp.edubackground == this.state.searchedubackground || this.state.searchedubackground == "")
                if (temp.eduschool == this.state.searcheduschool || this.state.searcheduschool== "") {
                  console.log(temp)
                  testdata.push({
                    name: temp.name,
                    sex: temp.sex,
                    age: temp.age,
                    edubackground: temp.edubackground,
                    tel: temp.tel,
                    eduschool: temp.eduschool
                  })
                }
          }
          this.setState({
            dataSource: testdata
          })
        }
        console.log(this.state.dataSource)
      }


    render() {
      return (
        <div>
          {/* 导航 */}
          <CustomBreadcrumb arr={['人才招聘工作台', '备选人才']} />
          {/* 招募人搜索框 */}
          <Card hoverable bordered={false} className='card-item'>
            <h1>【{this.department} / {this.posttype}岗位】</h1>
          <Form>
          <Row gutter={12}>
            <Col span={3} key={1}>
              <Form.Item name="name" label="姓名">
              <Input placeholder="请输入姓名" onChange={(event) => { this.inputChange2(event, "name") }} />
              </Form.Item>
            </Col>
            <Col span={4} key={2}>
          <Form.Item name="sex" label="性别">
          <Input placeholder="请输入性别" onChange={(event) => { this.inputChange2(event, "sex") }} />
          </Form.Item>
        </Col>
            <Col span={3} key={3}>
              <Form.Item name="age" label="年龄">
                <Input placeholder="请输入年龄" onChange={(event) => { this.inputChange2(event, "age") }}/>
              </Form.Item>
            </Col>
            <Col span={4} key={4}>
            <Form.Item name="edubackground" label="学历">
            <Input placeholder="请输入学历" onChange={(event) => { this.inputChange2(event, "edubackground") }}/>
          </Form.Item></Col>
            <Col span={4} key={5}>
              <Form.Item name="eduschool" label="学校">
                <Input placeholder="请输入学校" onChange={(event) => { this.inputChange2(event, "eduschool") }}/>
              </Form.Item>
            </Col>

            <Col  style={{ textAlign: 'right', }}>

<Button  type="primary" htmlType="submit" onClick={this.Search2}>  &nbsp; 查&nbsp;&nbsp;询 &nbsp;  </Button>
</Col>
<Col  style={{ textAlign: 'right', }}>            
<Button  type="primary" htmlType="submit" onClick={this.Clear2}>   &nbsp;取&nbsp;&nbsp;消 &nbsp;  </Button>
</Col>
          </Row>
        </Form>
          </Card>
          {/* 展示数据 */}
          {console.log("render: ",this.state.dataSource)}
          <Table columns={this.state.columns} dataSource={this.state.dataSource} pagination={{pageSize:4}} />
          <Drawer
                title="详细信息"
                placement="right"
                closable
                width={500}
                onClose={() => this.setDrawerVisible()}
                visible={this.state.drawerVisible}
              >
                <div>姓名:{this.state.detailRow.name}</div>
                <div>性别:{this.state.detailRow.sex}</div>
                <div>年龄:{this.state.detailRow.age}</div>
                <div>电话:{this.state.detailRow.tel}</div>
                <div>地址:{this.state.detailRow.address}</div>
                <div>邮箱:{this.state.detailRow.email}</div>
                <div>学历:{this.state.detailRow.edubackground}</div>
                <div>学校:{this.state.detailRow.eduschool}</div>
                <div>政治面貌:{this.state.detailRow.politicsstatus}</div>
                <div>简介:{this.state.detailRow.briefintro}</div>
                <div>描述:{this.state.detailRow.description}</div>
              </Drawer>
        </div>
      )
    }
  
  }

