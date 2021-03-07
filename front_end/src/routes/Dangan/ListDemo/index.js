import React from 'react'
import { Button, Row, Col, Card, Icon, Radio, Dropdown, Menu, message, Table, Search, Input, List, Drawer } from 'antd'
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
    searchId: "",
    searchName: "",
    searchPhone: "",
    searchCity: "",
    detailRow: {},
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'Name',
        key: 'Name',
      },
      {
        title: '电话',
        dataIndex: 'Phone',
        key: 'Phone',
      },
      {
        title: '城市',
        dataIndex: 'City',
        key: 'City',
      },
      {
        title: '操作',
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
    axios.get('https://6040a18af34cf600173c87a7.mockapi.io/search/UserInfo')
      .then(function (response) {
        _this.setState({
          dataSource: response.data,
          isLoaded: true
        });
        // for (const temp of response.data)
        //   console.log(temp)
      });
    // .catch(function(error: any) {
    //     _this.setState({
    //         isLoaded: false,
    //         error: error
    //     });
    // });
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
    if (flag == "id")
      this.setState({
        searchId: event.target.value
      })
    else if (flag == "Name")
      this.setState({
        searchName: event.target.value
      })
    else if (flag == "Phone")
      this.setState({
        searchPhone: event.target.value
      })
    else if (flag == "City")
      this.setState({
        searchCity: event.target.value
      })
    else
      alert("Wrong input!")
  }

  // new
  onSearch = (value, event) => {
    this.setState({
      searchContent: value,
    })
    // console.log(event)
    let newdata = []
    for (const temp of this.state.dataSource) {
      if (event == "id" && temp.id == value) {
        console.log(temp)
        newdata.push({
          id: temp.id,
          Name: temp.Name,
          Phone: temp.Phone,
          City: temp.City
        })
      }
      if (event == "Name" && temp.Name == value) {
        console.log(temp)
        newdata.push({
          id: temp.id,
          Name: temp.Name,
          Phone: temp.Phone,
          City: temp.City
        })
      }
      if (event == "Phone" && temp.Phone == value) {
        console.log(temp)
        newdata.push({
          id: temp.id,
          Name: temp.Name,
          Phone: temp.Phone,
          City: temp.City
        })
      }
      if (event == "City" && temp.City == value) {
        console.log(temp)
        newdata.push({
          id: temp.id,
          Name: temp.Name,
          Phone: temp.Phone,
          City: temp.City
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
      if (temp.id == this.state.searchId || this.state.searchId == "") {
        if (temp.Name == this.state.searchName || this.state.searchName == "")
          if (temp.Phone == this.state.searchPhone || this.state.searchPhone == "")
            if (temp.City == this.state.searchCity || this.state.searchCity == "") {
              console.log(temp)
              newdata.push({
                id: temp.id,
                Name: temp.Name,
                Phone: temp.Phone,
                City: temp.City
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
    const cardContent = `欢迎来到员工信息查询页面`
    return (
      <div>
        <CustomBreadcrumb arr={['员工档案管理', '员工列表']} />
        <TypingCard source={cardContent} />
        <Row gutter={16}>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
              <h1  > 数据总览：</h1>
              <Table dataSource={this.state.dataSource} columns={this.state.columns} pagination={{
                total: 80,
                pageSize: 12,
              }} />
              <Drawer
                title="详细信息"
                placement="right"
                closable
                width={600}
                // 这里也要加()=>，不然也会报错，具体信息参考state中的标注
                onClose={() => this.setDrawerVisible()}
                visible={this.state.drawerVisible}
              >
                <div>
                  {
                    Object.keys(this.state.detailRow).map((key) => {
                      return <p >{key}:{this.state.detailRow[key]}</p>
                    })
                  }
                </div>
                {/* <div>ID:{this.state.detailRow.id}</div>
                <div>Name:{this.state.detailRow.Name}</div>
                <div>Phone:{this.state.detailRow.Phone}</div>
                <div>City:{this.state.detailRow.City}</div> */}
                {/* <detailInfo></detailInfo> */}
              </Drawer>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
              <p>
                {/*new*/}
                <Row>
                  <Col span={24}><TypingCard source={"单项查询："} /></Col>
                  <Col span={12}>
                    <Search addonBefore="Search By id:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "id") }} enterButton />
                  </Col>
                  <Col span={12}>
                    <Search addonBefore="Search By Name:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "Name") }} enterButton />
                  </Col>
                  <Col span={12}>
                    <Search addonBefore="Search By Phone:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "Phone") }} enterButton />
                  </Col>
                  <Col span={12}>
                    {/* <Search addonBefore="Search By City:" placeholder="input search text" onSearch={this.onSearch} enterButton /> */}
                    <Search addonBefore="Search By City:" placeholder="input search text" onSearch={(value) => { this.onSearch(value, "City") }} enterButton />
                  </Col>
                </Row>

                <Table dataSource={this.state.dataSpecific} columns={this.state.columns} pagination={{
                  total: this.state.dataSpecific.length,
                  pageSize: 5,
                }} />
              </p>
            </Card>
            <Card>
              <Row>
                <Col span={24}>
                  <TypingCard source={"多条目查询："} /></Col>
                <Col span={12}>
                  <Input addonBefore="Search By id:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "id") }} />
                </Col>
                <Col span={12}>
                  <Input addonBefore="Search By Name:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "Name") }} />
                </Col>
                <Col span={12}>
                  <Input addonBefore="Search By Phone:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "Phone") }} />
                </Col>
                <Col span={12}>
                  {/* <Search addonBefore="Search By City:" placeholder="input search text" onSearch={this.onSearch} enterButton /> */}
                  <Input addonBefore="Search By City:" placeholder="input search text" onChange={(event) => { this.inputChange(event, "City") }} />
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Button type="primary" onClick={this.onClick}>
                    查询
                  </Button>
                </Col>
              </Row>
              <Table dataSource={this.state.dataSpecific2} columns={this.state.columns} pagination={{
                total: this.state.dataSpecific2.length,
                pageSize: 5,
              }} />
            </Card>

          </Col>
        </Row>
      </div >
    )
  }
}

export default ListDemo
// import React from 'react'
// import {
//   DownloadOutlined,
//   DownOutlined,
//   LeftOutlined,
//   PoweroffOutlined,
//   RightOutlined,
//   SearchOutlined,
// } from '@ant-design/icons';
// import { Button, Row, Col, Card, Radio, Dropdown, Menu, message, Space } from 'antd';
// import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
// import TypingCard from '../../../components/TypingCard'

// class ListDemo extends React.Component {
//   state = {
//     size: 'default'
//   }
//   handleSizeChange = (e) => {
//     this.setState({
//       size: e.target.value,
//       loading: false,
//       iconLoading: false
//     })
//   }

//   handleMenuClick(e) {
//     message.info(`Click on menu ${e.key} item.`)
//   }

//   render() {
//     const {size, loading, iconLoading} = this.state
//     const menu = (
//       <Menu onClick={this.handleMenuClick}>
//         <Menu.Item key="1">1st item</Menu.Item>
//         <Menu.Item key="2">2nd item</Menu.Item>
//         <Menu.Item key="3">3rd item</Menu.Item>
//       </Menu>
//     );
//     const cardContent = `标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。`
//     return (
//       <div>
//         <Space>HELLO</Space>
//         <CustomBreadcrumb arr={['员工档案管理','员工列表']}/>
//         <TypingCard source={cardContent} />
//         <Row gutter={16}>
//           <Col span={12}>
//             <Card bordered={false} className='card-item'>
//               <Button type="primary">Primary</Button>&emsp;
//               <Button>Default</Button>&emsp;
//               <Button type="dashed">Dashed</Button>&emsp;
//               <Button type="danger">Danger</Button>
//             </Card>
//             <Card bordered={false} className='card-item'>
//               <Radio.Group value={this.state.size} onChange={this.handleSizeChange}>
//                 <Radio.Button value="large">Large</Radio.Button>
//                 <Radio.Button value="default">Default</Radio.Button>
//                 <Radio.Button value="small">Small</Radio.Button>
//               </Radio.Group>
//               <p style={{marginTop: '1em'}}>
//                 <Button type="primary" size={size}>Primary</Button>&emsp;
//                 <Button size={this.state.size}>Default</Button>&emsp;
//                 <Button type="dashed" size={size}>Dashed</Button>&emsp;
//                 <Button type="danger" size={size}>Danger</Button>
//               </p>
//               <p>
//                 <Button shape='circle' type='primary' icon={<DownloadOutlined />} size={size}/>&emsp;
//                 <Button type="primary" icon={<DownloadOutlined />} size={size}>Download</Button>
//               </p>
//               <div>
//                 <Button.Group size={size}>
//                   <Button><LeftOutlined />Backward</Button>&emsp;
//                   <Button>Forward<RightOutlined /></Button>
//                 </Button.Group>
//               </div>
//             </Card>
//           </Col>
//           <Col span={12}>
//             <Card bordered={false} className='card-item'>
//               <p>
//                 <Button type="primary" shape="circle" icon={<SearchOutlined />}/>&emsp;
//                 <Button type="primary" icon={<SearchOutlined />}>Search</Button>&emsp;
//                 <Button shape="circle" icon={<SearchOutlined />}/>&emsp;
//                 <Button icon={<SearchOutlined />}>Search</Button>&emsp;
//               </p>
//               <p style={{marginBottom: 0}}>
//                 <Button shape="circle" icon={<SearchOutlined />}/>&emsp;
//                 <Button icon={<SearchOutlined />}>Search</Button>&emsp;
//                 <Button type="dashed" shape="circle" icon={<SearchOutlined />}/>&emsp;
//                 <Button type="dashed" icon={<SearchOutlined />}>Search</Button>
//               </p>
//             </Card>
//             <Card bordered={false} className='card-item'>
//               <Button type="primary">primary</Button>&emsp;
//               <Button>secondary</Button>&emsp;
//               <Dropdown overlay={menu}>
//                 <Button>Button<DownOutlined /></Button>
//               </Dropdown>
//             </Card>
//             <Card bordered={false} className='card-item'>
//               <p>
//                 <Button loading type='primary'>Loading</Button>&emsp;
//                 <Button type='primary' loading shape='circle'/>
//               </p>
//               <div>
//                 <Button loading={loading} onClick={() => this.setState({loading: true})}>Click me</Button>&emsp;
//                 <Button loading={iconLoading} onClick={() => this.setState({iconLoading: true})} icon={<PoweroffOutlined />}>Click
//                   me</Button>
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     );
//   }
// }

// export default ListDemo