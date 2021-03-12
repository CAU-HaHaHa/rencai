import React from 'react'
import { Button, Row, Col, Card, Icon, Radio, Dropdown, Menu, message, Table, Search, Input, List, Drawer, BackTop, Space, Descriptions, Badge } from 'antd'
import axios from 'axios'
// new
// import detailInfo from './detailInfo'

import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'

class ListDemo extends React.Component {
  constructor(props) {
    super(props);
    this.setDrawerVisible = this.setDrawerVisible.bind(this);
  }
  state = {
    drawerVisible: false,
    searchContent: "",
    size: 'default',
    dataSource: [],
    dataSpecific: [],
    dataSpecific2: [],
    searchUserId: "",
    searchName: "",
    searchTel: "",
    searchEmail: "",
    searchEduschool: "",
    searchEdubackground: "",
    detailRow: {},
    dictTitle: {
      "address": "地址",
      "briefintro": "自我简介",
      "edubackground": "本科",
      "eduschool": "毕业院校",
      "email": "邮箱",
      "identitycard": "身份证号",
      "name": "姓名",
      "password": "密码",
      "politicsstatus": "政治面貌",
      "postcode": "邮编",
      "sex": "性别",
      "tags": "编程语言",
      "tel": "电话",
      "user_id": "ID",
      "username": "用户名",
      "workaddress": "工作地点",
    },
    columns: [
      {
        title: 'ID',
        dataIndex: 'user_id',
        key: 'user_id',
        align: 'center'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '电话',
        dataIndex: 'tel',
        key: 'tel',
        align: 'center'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        align: 'center'
      },
      {
        title: '学校',
        dataIndex: 'eduschool',
        key: 'eduschool',
        align: 'center'
      },
      {
        title: '学历',
        dataIndex: 'edubackground',
        key: 'edubackground',
        align: 'center'
      },
      {
        title: '',
        key: 'operation',
        render: (row) => (
          // 这里OnClick中不加()=>会导致无限循环，具体原因可查阅错误：
          // This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. 
          // React limits the number of nested updates to prevent infinite loops.
          <Button type="primary" onClick={() => this.showDrawer(row)}>
            查看详情
          </Button>)
      }
    ],
    newcolumns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
        align: 'center'
      },
      {
        title: '电话',
        dataIndex: 'Phone',
        key: 'Phone',
        align: 'center'
      },
      {
        title: '城市',
        dataIndex: 'City',
        key: 'City',
        align: 'center'
      },
      {
        align: 'center',
        title: '',
        key: 'operation',
        render: (row) => (
          // 这里OnClick中不加()=>会导致无限循环，具体原因可查阅错误：
          // This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. 
          // React limits the number of nested updates to prevent infinite loops.
          <Button type="primary" onClick={() => this.showDrawer(row)}>
            查看详情
          </Button>)
      }
    ],
  }

  componentDidMount() {

    const _this = this;
    // http://127.0.0.1:5000/StuffInfo https://6040a18af34cf600173c87a7.mockapi.io/search/UserInfo
    // 会遇到跨域问题，需要在package.json中添加一行： "proxy" : "http://127.0.0.1:5000"，之后修改get函数
    // 将http://127.0.0.1:5000/StuffInfo/改为 /StuffInfo/
    // axios.get('https://6040a18af34cf600173c87a7.mockapi.io/search/UserInfo')
    //   .then(function (response) {
    //     console.log(typeof (response.data), response.data);
    //   })
    // .catch(error => {
    // });

    axios.get('http://20.46.117.148:8001/StuffInfo/')
      .then(function (response) {
        // 绝了，data在response.data.data中
        console.log(typeof (response.data.data), response.data.data)
        _this.setState({
          dataSource: response.data.data,
          dataSpecific: response.data.data,
          dataSpecific2: response.data.data,
          isLoaded: true
        });
        // for (const temp of response.data)
        //   console.log(temp)
      })
      .catch(error => {
        _this.setState({
          isLoaded: false,
          error: error
        });
      });
    console.log(this.state.dataSpecific, "***")
  }

  handleSizeChange = (e) => {
    this.setState({
      size: e.target.value,
      loading: false,
      iconLoading: false
    })
  }

  handleMenuClick(e) {
    message.info(`Click on menu ${e.key} item.`)
  }

  // new
  inputChange = (event, flag) => {
    console.log(event, "***", flag)
    if (flag == "user_id")
      this.setState({
        searchUserId: event.target.value
      })
    else if (flag == "name")
      this.setState({
        searchName: event.target.value
      })
    else if (flag == "tel")
      this.setState({
        searchTel: event.target.value
      })
    else if (flag == "email")
      this.setState({
        searchEmail: event.target.value
      })
    else if (flag == "eduschool")
      this.setState({
        searchEduschool: event.target.value
      })
    else if (flag == "edubackground")
      this.setState({
        searchEdubackground: event.target.value
      })
    else
      alert("Wrong input!")
  }

  onSearch = (value, event) => {
    this.setState({
      searchContent: value,
    })
    let newdata = []
    for (const temp of this.state.dataSource) {
      if (event == "user_id" && temp.user_id == value) {
        console.log(temp)
        newdata.push({
          user_id: temp.user_id,
          name: temp.name,
          tel: temp.tel,
          email: temp.email,
          eduschool: temp.eduschool,
          edubackground: temp.edubackground,

        })
      }
      if (event == "name" && temp.name == value) {
        console.log(temp)
        newdata.push({
          user_id: temp.user_id,
          name: temp.name,
          tel: temp.tel,
          email: temp.email,
          eduschool: temp.eduschool,
          edubackground: temp.edubackground,
        })
      }
      if (event == "tel" && temp.tel == value) {
        console.log(temp)
        newdata.push({
          user_id: temp.user_id,
          name: temp.name,
          tel: temp.tel,
          email: temp.email,
          eduschool: temp.eduschool,
          edubackground: temp.edubackground,
        })
      }
      if (event == "eduschool" && temp.eduschool == value) {
        console.log(temp)
        newdata.push({
          user_id: temp.user_id,
          name: temp.name,
          tel: temp.tel,
          email: temp.email,
          eduschool: temp.eduschool,
          edubackground: temp.edubackground,
        })
      }
      if (event == "email" && temp.email == value) {
        console.log(temp)
        newdata.push({
          user_id: temp.user_id,
          name: temp.name,
          tel: temp.tel,
          email: temp.email,
          eduschool: temp.eduschool,
          edubackground: temp.edubackground,
        })
      }
      if (event == "edubackground" && temp.edubackground == value) {
        console.log(temp)
        newdata.push({
          user_id: temp.user_id,
          name: temp.name,
          tel: temp.tel,
          email: temp.email,
          eduschool: temp.eduschool,
          edubackground: temp.edubackground,
        })
      }
    }
    this.setState({
      dataSpecific: newdata
    })

    console.log(this.state.dataSpecific)
  }
  // new
  showDrawer(row) {
    console.log(row)
    this.setState({
      detailRow: Object.assign({}, row)
    })
    this.setDrawerVisible()
  }
  // new
  setDrawerVisible = () => {
    this.setState({
      drawerVisible: !this.state.drawerVisible
    })

  }
  // new
  onClick = (event) => {
    let newdata = []
    for (const temp of this.state.dataSource) {
      if (temp.user_id == this.state.searchUserId || this.state.searchUserId == "") {
        if (temp.name == this.state.searchName || this.state.searchName == "")
          if (temp.tel == this.state.searchTel || this.state.searchTel == "")
            if (temp.email == this.state.searchEmail || this.state.searchEmail == "")
              if (temp.eduschool == this.state.searchEduschool || this.state.searchEduschool == "")
                if (temp.edubackground == this.state.searchEdubackground || this.state.searchEdubackground == "") {
                  console.log(temp)
                  newdata.push({
                    user_id: temp.user_id,
                    name: temp.name,
                    tel: temp.tel,
                    email: temp.email,
                    eduschool: temp.eduschool,
                    edubackground: temp.edubackground,
                  })
                }
      }
      this.setState({
        dataSpecific2: newdata
      })
      console.log(this.state.dataSpecific2)
    }
  }
  render() {
    const { size, loading, iconLoading } = this.state
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">1st item</Menu.Item>
        <Menu.Item key="2">2nd item</Menu.Item>
        <Menu.Item key="3">3rd item</Menu.Item>
      </Menu>
    );
    const { Search } = Input
    const cardContent = `员工信息查询页面`
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
        <CustomBreadcrumb arr={['员工档案管理', '员工列表']} />
        <Row gutter={16, 8}>
          <Col span={24}>
            <Card hoverable bordered={false} title={cardContent} className='card-item' block></Card>
          </Col>
        </Row>
        <Row gutter={16, 8}>
          <Card hoverable bordered={false} title="单项查询：" className='card-item'>
            <Space direction="vertical" size={20}>
              <Row gutter={16, 8}>
                <Col span={4}>
                  <Search addonBefore="ID:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "user_id") }} enterButton />
                </Col>
                <Col span={4}>
                  <Search addonBefore="姓名:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "name") }} enterButton />
                </Col>
                <Col span={4}>
                  <Search addonBefore="电话:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "tel") }} enterButton />
                </Col>
                <Col span={4}>
                  {/* <Search addonBefore="Search By City:" placeholder="input search text" onSearch={this.onSearch} enterButton /> */}
                  <Search addonBefore="邮箱:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "email") }} enterButton />
                </Col>
                <Col span={4}>
                  <Search addonBefore="学校:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "eduschool") }} enterButton />
                </Col>
                <Col span={4}>
                  {/* <Search addonBefore="Search By City:" placeholder="input search text" onSearch={this.onSearch} enterButton /> */}
                  <Search addonBefore="学历:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "edubackground") }} enterButton />
                </Col>
              </Row>
              <Card hoverable>
                <Table dataSource={this.state.dataSpecific} columns={this.state.columns} pagination={{
                  total: this.state.dataSpecific.length,
                  pageSize: 10,
                  loading
                }} />
              </Card>
            </Space>
          </Card>
          <Card hoverable title="多条目查询：" className='card-item' block>
            <Space direction="vertical" size={20}>
              <Row gutter={16, 8}>
                <Col span={4}>
                  <Input addonBefore="ID:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "user_id") }} />
                </Col>
                <Col span={4}>
                  <Input addonBefore="姓名:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "name") }} />
                </Col>
                <Col span={4}>
                  <Input addonBefore="电话:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "tel") }} />
                </Col>
                <Col span={4}>
                  {/* <Search addonBefore="Search By City:" placeholder="input search text" onSearch={this.onSearch} enterButton /> */}
                  <Input addonBefore="Email:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "email") }} />
                </Col>
                <Col span={4}>
                  <Input addonBefore="学校:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "eduschool") }} />
                </Col>
                <Col span={4}>
                  {/* <Search addonBefore="Search By City:" placeholder="input search text" onSearch={this.onSearch} enterButton /> */}
                  <Input addonBefore="学历:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "edubackground") }} />
                </Col>
              </Row>
              <Row justify="end">
                <Col span={2}>

                  <Button shape="round" type="primary" onClick={this.onClick} block>
                    查询
                    </Button>
                </Col>
              </Row>
              <Card hoverable>
                <Table dataSource={this.state.dataSpecific2} columns={this.state.columns} pagination={{
                  total: this.state.dataSpecific2.length,
                  pageSize: 10,
                }} />
              </Card>
            </Space>
          </Card>
        </Row>

        <Drawer
          title="详细信息"
          placement="right"
          closable
          width={800}
          // 这里也要加()=>，不然也会报错，具体信息参考state中的标注
          onClose={() => this.setDrawerVisible()}
          visible={this.state.drawerVisible}
        >
          <Card>
            <Descriptions column={2} title="" bordered>
              {
                Object.keys(this.state.detailRow).map((key) => {
                  if (this.state.dictTitle[key] == "性别") {
                    if (this.state.detailRow[key]) {
                      return <Descriptions.Item align='center' label={this.state.dictTitle[key]} >男</Descriptions.Item>
                    }
                    else {
                      return <Descriptions.Item align='center' label={this.state.dictTitle[key]} >女</Descriptions.Item>
                    }
                  }
                  else {
                    return <Descriptions.Item align='center' label={this.state.dictTitle[key]} >{this.state.detailRow[key]}</Descriptions.Item>
                  }
                })
              }
            </Descriptions>
            <div>

            </div>
          </Card>

        </Drawer>
        <BackTop>
          <div style={upToTopStyle}>UP</div>
        </BackTop>
      </div >
    )
  }
}
export default ListDemo