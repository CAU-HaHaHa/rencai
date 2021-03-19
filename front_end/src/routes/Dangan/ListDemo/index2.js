import React from 'react'
import { Button, Row, Col, Card, Icon, Radio, Dropdown, Menu, message, Table, Search, Input, List, Drawer, BackTop, Space, Descriptions, Select, Modal, Message } from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import Item from 'antd/lib/list/Item';

class ListDemo2 extends React.Component {
  constructor(props) {
    super(props);
    this.setDrawerVisible = this.setDrawerVisible.bind(this);
  }
  state = {
    drawerVisible: false,
    isModalVisible: false,
    searchContent: "",
    size: 'default',
    selectCop: "",
    selectDept: "",
    selectPost: "",
    selectCops: [],
    selectDepts: [],
    selectPosts: [],
    dataSource: [],
    dataOfCorp: [],
    dataSearch: [],
    detailRow: {},
    detailCorp: {},
    dictTitle: {
      "recruitpost_id": "招聘序号",
      "corporation_id": "公司ID",
      "email": "邮箱",
      "legalrepresentative": "法人",
      "location": "地址",
      "corporation_name": "公司名",
      "name": "公司名",
      "otherinfo": "公司其他信息",
      "overall_depart": "部门总览",
      "registeredcapital": "注册资本",
      "registrationdate": "注册日期",
      "requirementinfo": "公司宣言",
      "structure": "公司结构",
      "tel": "电话",
      "website": "主页",
      "department": "部门",
      "posttype": "岗位",
      "number": "招聘人数",
      "description": "职位描述",
      "registerdate": "发布日期",
    },
    columns: [
      {
        title: '公司名',
        dataIndex: 'corporation_name',
        key: 'corporation_name',
        align: 'center'
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        align: 'center'
      },
      {
        title: '岗位',
        dataIndex: 'posttype',
        key: 'posttype',
        align: 'center'
      },
      {
        title: '数量',
        dataIndex: 'number',
        key: 'number',
        align: 'center'
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        align: 'center'
      },
      {
        title: '发布日期',
        dataIndex: 'registerdate',
        key: 'registerdate',
        align: 'center'
      },
      {
        title: '',
        key: 'operation',
        render: (row) => (
          <Button type="primary" onClick={() => this.deliverCV(row)}>
            投递
          </Button>)
      },
      {
        title: '',
        key: 'operation',
        render: (row) => (
          <Button type="primary" onClick={() => this.showDrawer(row)}>
            查看详情
          </Button>)
      }
    ],

  }

  // componentWillMount -> render -> componentDidMount，Select控件在render时期进行渲染
  // 若要刷新Select控件中的数据需要在componentWillMount时期进行数据获取
  // 奇怪的是我发现不加这个也可以刷新出数据
  // componentWillMount () 

  componentDidMount() {
    const _this = this;
    // http://20.46.117.148:8001/RecruitpostInfo/
    axios.get('http://45.76.99.155/CorpInfo/')
      .then(function (response) {
        // console.log(typeof (response.data.data), response.data.data);
        _this.setState({
          dataOfCorp: response.data.data,
        });
      })
      .catch(error => {
        _this.setState({
          isLoaded: false,
          error: error
        });
      });
    axios.get('http://45.76.99.155/RecruitpostInfo/')
      .then(function (response) { // mockAPI时
        // console.log(typeof (response.data.data), response.data.data);
        _this.setState({
          dataSource: response.data.data,
          dataSearch: response.data.data,
          isLoaded: true
        });

        let newCops = [], newDept = [], newPost = [];
        for (const item of response.data.data) {
          if (!newCops.includes(item.corporation_id)) {
            newCops.push(item.corporation_id)
          }
          if (!newDept.includes(item.department)) {
            newDept.push(item.department)
          }
          if (!newPost.includes(item.posttype)) {
            newPost.push(item.posttype)
          }
        };
        _this.setState({
          selectCops: newCops,
          selectDepts: newDept,
          selectPosts: newPost
        }
          //  , () => { console.log(newCops,"*****", _this.state.selectCop, _this.state.selectDept, _this.state.selectPosts) }
        );
      })
      .catch(error => {
        _this.setState({
          isLoaded: false,
          error: error
        });
      });
    
  }

  handleSizeChange = (e) => {
    this.setState({
      size: e.target.value,
      loading: false,
      iconLoading: false
    })
  }

  showDrawer(row) {
    console.log(typeof(row),row)
    for(const item of this.state.dataOfCorp){
      if(item.corporation_id == row.corporation_id){
        this.setState({
          detailRow: Object.assign({}, row),
          detailCorp : Object.assign({}, item)
        })
        break;
      }
    }
    this.setDrawerVisible()
  }

  setDrawerVisible = () => {
    this.setState({
      drawerVisible: !this.state.drawerVisible
    })

  }

  deliverCV(row) {
    this.setState({
      isModalVisible: true,
    });
  }
  handleOk = () => {
    this.setState({
      isModalVisible: false,
    });
    Message.success({
      content: '简历提交成功！',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  onSearchPost = () => {
    let newdata = [];
    for (const item of this.state.dataSource) {
      if (item.corporation_id == this.state.selectCop || this.state.selectCop == "") {
        if (item.department == this.state.selectDept || this.state.selectDept == "") {
          if (item.posttype == this.state.selectPost || this.state.selectPost == "") {
            newdata.push(item);
          }
        }
      }
    }
    console.log(newdata);
    this.setState({
      dataSearch: newdata,
    });
  }

  onSelectChange = (e, flag) => {
    // console.log(e,e.target ,flag)
    if (flag == "Corp") {
      this.setState({
        selectCop: e,
      })
    }
    else if (flag == "Dept") {
      this.setState({
        selectDept: e,
      })
    }
    else {
      this.setState({
        selectPost: e,
      })
    }
  }

  onSearchRecover = () => {
    this.setState({
      dataSearch: this.state.dataSource,
    })
  }

  render() {
    const cardContent = `招聘信息查询页面`
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
    const { Option } = Select;
    return (
      <div>
        <Modal title="提示" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p>确认提交简历吗？</p>
        </Modal>
        <CustomBreadcrumb arr={['职业生涯发展', '岗位池']} />
        <Row gutter={16, 8} block>
          <Col span={24}>
            <Card hoverable bordered={false} title={cardContent} className='card-item' block>
              通过下拉选项查询相应信息：
              1、公司。
              2、部门。
              3、岗位。
              选择完成后请点击查询按钮。
            </Card>
          </Col>
        </Row>
        <Row gutter={16, 8} block>
          <Col span={24}>
            <Card hoverable title="多条目查询：" className='card-item' block>
              <Space direction="vertical" size={20}>
                <Row gutter={[24, 16]}>
                  <Col span={6}>
                    <text>公司：</text>
                    <Select filterOption={false} defaultValue="请选择公司" style={{ width: 200 }} allowClear onChange={(e) => this.onSelectChange(e, "Corp")}>
                      {this.state.selectCops.map((value) => (
                        <Option key={value}>{value}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <text>部门：</text>
                    <Select defaultValue="请选择部门" style={{ width: 200 }} allowClear onChange={(e) => this.onSelectChange(e, "Dept")}>
                      {this.state.selectDepts.map((value) => (
                        <Option key={value}>{value}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <text>岗位：</text>
                    <Select defaultValue="请选择岗位" style={{ width: 200 }} allowClear onChange={(e) => this.onSelectChange(e, "Post")}>
                      {this.state.selectPosts.map((value) => (
                        <Option key={value}>{value}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={3}>
                    <Button block onClick={this.onSearchRecover}>
                      恢复默认
                    </Button>
                  </Col>
                  <Col span={3}>
                    <Button block onClick={this.onSearchPost}>
                      查询
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Card hoverable>
                      <Table dataSource={this.state.dataSearch} columns={this.state.columns} pagination={{
                        total: this.state.dataSearch.length,
                        pageSize: 10,
                      }} />
                    </Card>
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
        <Drawer
          title="其他详细信息"
          placement="right"
          closable
          width={800}
          // 这里也要加()=>，不然也会报错，具体信息参考state中的标注
          onClose={() => this.setDrawerVisible()}
          visible={this.state.drawerVisible}
        >
          <Card>
            <Descriptions column={2} title="招聘信息：" bordered>
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
                  else if(key in this.state.dictTitle){
                    return <Descriptions.Item align='center' label={this.state.dictTitle[key]} >{this.state.detailRow[key]}</Descriptions.Item>
                  }
                })
              }
            </Descriptions>
          </Card>
          <Card>
            <Descriptions column={1} title="公司详情" bordered>
              {
                Object.keys(this.state.detailCorp).map((key) => {
                  if(this.state.dictTitle[key] != "公司结构" && key in this.state.dictTitle)
                    return <Descriptions.Item label={this.state.dictTitle[key]} >{this.state.detailCorp[key]}</Descriptions.Item>
                })
              }
            </Descriptions>
          </Card>
        </Drawer>
        <BackTop>
          <div style={upToTopStyle}>UP</div>
        </BackTop>
      </div >
    )
  }
}
export default ListDemo2