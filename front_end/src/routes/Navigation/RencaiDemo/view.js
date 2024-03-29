import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { Table, Button, Form, DatePicker, Input, Row, Col, Card, Select, Drawer,message,Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import {ExclamationCircleOutlined,CheckOutlined,CloseOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

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
    department: "",
    posttype: "",
    searchContent: "",
    size: 'default',
    dataSource: [],
    originaldataSource: [],
    dataSpecific: [],
    searchname: "",
    searchsex: "",
    searchage: "",
    searchedubackground: "",
    searcheduschool: "",
    detailRow: {},
    personExperience: [],
    recruitpost_id:"",
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
          <Button type="primary" icon={<CheckOutlined />} onClick={this.onClick1.bind(this, row.applylist_id)} shape="round">
            批准
          </Button>
        )
      },
      {
        key: 'action2',
        render: (row) => (
          <Button type="primary" icon={<SearchOutlined />} onClick={this.showDrawer.bind(this, row)} shape="round">
            查看
          </Button>

        )
      },
      {
        key: 'action3',
        render: (row) => (
          <Button type="primary" icon={<CloseOutlined />} onClick={this.onClick2.bind(this, row.applylist_id)} shape="round">
            拒绝
          </Button>

        )
      }
    ],
  }

    // 批准按钮
    onClick1 = (applylist_id) => {
          const _this = this;
          confirm({
            title: '操作确认',
            icon: <ExclamationCircleOutlined />,
            content:"确定要批准吗？",
            // 点击确定
            onOk() {
              console.log('OK');
              console.log('http://45.76.99.155/rencai/enroll?applylist_id=' + applylist_id)
              axios.get('http://45.76.99.155/rencai/enroll?applylist_id=' + applylist_id)
              console.log('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + _this.recruitpost_id)
              axios.get('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + _this.recruitpost_id)
                .then(function (response) {
                  _this.setState({
                    dataSource: response.data['data'],
                    originaldataSource: response.data['data'],
                    isLoaded: true
                  });
                });
              message.info("成功批准！");
            },
            //点击取消
            onCancel() {
              console.log('取消操作');
            }
          });
          console.log(_this.state);
        }

    // 拒绝按钮
    onClick2 = (applylist_id) => {
      const _this = this;
      confirm({
        title: '操作确认',
        icon: <ExclamationCircleOutlined />,
        content:"确定要拒绝吗？",
        // 点击确定
        onOk() {
          console.log('OK');
          console.log('http://45.76.99.155/rencai/refuse?applylist_id=' + applylist_id)
          axios.get('http://45.76.99.155/rencai/refuse?applylist_id=' + applylist_id)
          console.log('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + _this.recruitpost_id)
          axios.get('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + _this.recruitpost_id)
            .then(function (response) {
              _this.setState({
                dataSource: response.data['data'],
                originaldataSource: response.data['data'],
                isLoaded: true
              });
            });
            console.log(_this.state)
          message.info("成功拒绝！");
        },
        //点击取消
        onCancel() {
          console.log('取消操作');
        }
      });
      console.log(_this.state);
    }

  ClickViewHandle1 = (applylist_id) => {
    console.log('http://45.76.99.155/rencai/enroll?applylist_id=' + applylist_id)
    axios.get('http://45.76.99.155/rencai/enroll?applylist_id=' + applylist_id)
    const _this = this;
    console.log('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + this.recruitpost_id)
    axios.get('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + this.recruitpost_id)
      .then(function (response) {
        _this.setState({
          dataSource: response.data['data'],
          originaldataSource: response.data['data'],
          isLoaded: true
        });
      });
      console.log(this.state)
  }

  ClickViewHandle3 = (applylist_id) => {
    console.log('http://45.76.99.155/rencai/refuse?applylist_id=' + applylist_id)
    axios.get('http://45.76.99.155/rencai/refuse?applylist_id=' + applylist_id)
    const _this = this;
    console.log('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + this.recruitpost_id)
    axios.get('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + this.recruitpost_id)
      .then(function (response) {
        _this.setState({
          dataSource: response.data['data'],
          originaldataSource: response.data['data'],
          isLoaded: true
        });
      });
      console.log(this.state)
  }

  componentDidMount() {
    const _this = this;
    console.log('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + this.recruitpost_id)
    axios.get('http://45.76.99.155/rencai/recruitpost_candidate?recruitpost_id=' + this.recruitpost_id)
      .then(function (response) {
        _this.setState({
          dataSource: response.data['data'],
          originaldataSource: response.data['data'],
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

  showDrawer = (row) => {
    const _this = this;
    console.log('http://45.76.99.155/rencai/candidate?user_id=' + row.user_id)
    axios.get('http://45.76.99.155/rencai/candidate?user_id='+row.user_id)
      .then(function (response) {
        _this.setState({
          detailRow: Object.assign({}, row),
          personExperience: response.data.data,
          isLoaded: true
        });
      });
    _this.setDrawerVisible()
  }

  Clear2 = (event) => {
    this.setState({
      dataSource: this.state.originaldataSource
    })
  }

  Search2 = (event) => {
    let testdata = []
    console.log(this.state.originaldataSource)
    for (const temp of this.state.originaldataSource) {
      console.log("in", temp.name)
      if (temp.name == this.state.searchname || this.state.searchname == "") {
        if (temp.sex == this.state.searchsex || this.state.searchsex == "")
          if (temp.age == this.state.searchage || this.state.searchage == "")
            if (temp.edubackground == this.state.searchedubackground || this.state.searchedubackground == "")
              if (temp.eduschool == this.state.searcheduschool || this.state.searcheduschool == "") {
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
              <Col span={4} key={1}>
                <Form.Item name="name" label="姓名">
                  <Input placeholder="请输入姓名" onChange={(event) => { this.inputChange2(event, "name") }} />
                </Form.Item>
              </Col>
              <Col span={4} key={2}>
                <Form.Item name="sex" label="性别">
                  <Input placeholder="请输入性别" onChange={(event) => { this.inputChange2(event, "sex") }} />
                </Form.Item>
              </Col>
              <Col span={4} key={3}>
                <Form.Item name="age" label="年龄">
                  <Input placeholder="请输入年龄" onChange={(event) => { this.inputChange2(event, "age") }} />
                </Form.Item>
              </Col>
              <Col span={4} key={4}>
                <Form.Item name="edubackground" label="学历">
                  <Input placeholder="请输入学历" onChange={(event) => { this.inputChange2(event, "edubackground") }} />
                </Form.Item></Col>
              <Col span={4} key={5}>
                <Form.Item name="eduschool" label="学校">
                  <Input placeholder="请输入学校" onChange={(event) => { this.inputChange2(event, "eduschool") }} />
                </Form.Item>
              </Col>

              <Col span={3} style={{ textAlign: 'right', }}>

                <Button type="primary" htmlType="submit" onClick={this.Search2}>   &nbsp;查&nbsp;&nbsp;询&nbsp;  </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        {/* 展示数据 */}
        {console.log("render: ", this.state.dataSource)}
        <Table columns={this.state.columns} dataSource={this.state.dataSource} pagination={{ pageSize: 4 }} />
        <Drawer
          title="详细信息"
          placement="right"
          closable
          width={650}
          onClose={() => this.setDrawerVisible()}
          visible={this.state.drawerVisible}
        >
          <Card title="基本信息">
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
          </Card>

          <Card title="经历">
            {
              Object.values(this.state.personExperience).map((value) => {
                console.log("value", value)
                return (
                  <Card>{
                    Object.keys(value).map((key) => {
                      if (key == 'corporation') {
                        return [
                          <Card title="曾公司">
                          <div>曾任职公司:{value.corporation.name}</div>
                          <div>公司电话:{value.corporation.tel}</div>
                          <div>公司邮箱:{value.corporation.email}</div>
                          <div>入职时间:{value.corporation.arrivetime}</div>
                          <div>离职时间:{value.corporation.departtime}</div>
                          <div>整体工作状态:{value.corporation.description}</div>
                          </Card>
                        ]
                      }
                      if (key == 'performance') {
                        return [
                          <Card title="表现">
                            {
                              Object.values(value.performance).map((v2) => {
                                console.log(v2.department)
                                return [
                                  <Card.Grid style={gridStyle}>
                                    <div>部门:{v2.department}</div>
                                    <div>职位:{v2.post}</div>
                                    <div>评价:{v2.description}</div>
                                    <div>日期:{v2.registerdate}</div>
                                    </Card.Grid>
                                ]
                              })
                            }
                          </Card>
                        ]
                      }
                      if (key == 'rewardandpulishment') {
                        return [
                          <Card title="奖惩信息">
                            {
                              Object.values(value.rewardandpulishment).map((v3) => {
                                return [
                                  <Card.Grid style={gridStyle}>
                                    <div>奖惩:{v3.reward_pun_name}</div>
                                    <div>描述:{v3.description}</div>
                                    <div>日期:{v3.registerdate}</div>
                                    </Card.Grid>
                                ]
                              })
                            }
                          </Card>
                        ]
                      }
                    })
                  }
                  </Card>
                )
              })
            }
          </Card>
        </Drawer>
      </div>
    )
  }

}

const gridStyle = {
  width: '50%',
  textAlign: 'center',
};
