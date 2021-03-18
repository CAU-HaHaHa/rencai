import React from 'react'
import { Button, Row, Col, Card, Table, Input, BackTop, Space, Modal } from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { withRouter } from 'react-router';
import {
  observer,
  inject,
} from 'mobx-react'
import appStore from '../../../store/appStore'
import hrlizhiRequest from '../../../api/hrlizhiRequest'
import lizhideleteRequest from '../../../api/lizhideleteRequest'
import { CheckOutlined, CloseOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
const { Column } = Table;
const { confirm } = Modal;


@withRouter @inject('appStore') @observer
export default class HRLiZhiDemo extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    modelvisible: false,
    reload:100,
    text: ' ',
    size: 'default',
    dataSource: [],
    dataSpecific: [],
    searchUserId: "",
    searchName: "",
    searchDep: "",
  }

  // 生命周期函数
  componentDidMount() {
    const _this = this;
    let data = hrlizhiRequest(appStore.loginUser.corporationid);
    console.log(data,"data")
    axios.all([data]).then(
      res => {
        _this.setState({
          dataSource: res[0].data.data,
          dataSpecific: res[0].data.data,
          isLoaded: true
        });
      }
    ).catch(
      (err)=>{
        alert("未知错误")
      }
    )
  }

  // 确认操作
  showConfirm  (id,flag) {
    var info = ' ';
    const _this = this;
    // 设置提示语
    if(flag==1){
      info = '确定同意该离职申请吗？';
    }else{
      info = '确定拒绝该离职申请吗？';
    }
    confirm({
      title: '操作确认',
      icon: <ExclamationCircleOutlined />,
      content:info,
      // 点击确定
      onOk() {
        console.log('OK');
        lizhideleteRequest(id,flag);
        // 重新请求数据 手动---------------------------------------------
        let data = hrlizhiRequest(appStore.loginUser.corporationid);
        console.log(data,"data");
        axios.all([data]).then(
          res => {
            _this.setState({
              dataSource: res[0].data.data,
              dataSpecific: res[0].data.data,
              isLoaded: true
            });
          }
        ).catch(
          (err)=>{
            alert("未知错误")
          }
        )
        // 重新请求数据结束-----------------------------------------------
      },
      //点击取消
      onCancel() {
        console.log('Cancel');
      },
    });
    // call state 以刷新（配合手动请求数据可以刷新）
    console.log(this.state);
  }

  // 改变查询条件
  inputChange = (event, flag) => {
    console.log(event, "***", flag)
    if (flag == "user_id")
      this.setState({
        searchUserId: event.target.value
      })
    else if (flag == "user_name")
      this.setState({
        searchName: event.target.value
      })
    else if (flag == "department")
      this.setState({
        searchDep: event.target.value
      })
    else
      alert("Wrong input!")
  }

  // 点击按钮
  onClick = (event) => {
    let newdata = []
    for (const temp of this.state.dataSource) {
      if (temp.user_id == this.state.searchUserId || this.state.searchUserId == "") {
        if (temp.user_name == this.state.searchName || this.state.searchName == "")
          if (temp.department == this.state.searchDep || this.state.searchDep == ""){
            console.log(temp)
            newdata.push({
              user_id: temp.user_id,
              user_name: temp.user_name,
              department: temp.department,
              dutytype: temp.dutytype,
              registerdate: temp.registerdate,
              description: temp.description,
            })
          }
        }
      this.setState({
        dataSpecific: newdata
      })
      console.log(this.state.dataSpecific)
    }
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
        <div>
        <CustomBreadcrumb arr={['员工档案管理', '离职管理']} />
          <Card hoverable title="离职管理" className='card-item' block>
            <Space direction="vertical">
              <Row gutter={20}>
                <Col span={6}>
                  <Input addonBefore="ID:" placeholder=" " onChange={(event) => { this.inputChange(event, "user_id") }} />
                </Col>
                <Col span={6}>
                  <Input addonBefore="姓名:" placeholder=" " onChange={(event) => { this.inputChange(event, "user_name") }} />
                </Col>
                <Col span={6}>
                  <Input addonBefore="部门:" placeholder=" " onChange={(event) => { this.inputChange(event, "department") }} />
                </Col>
                <Col span={3}>
                  <Button type="primary" onClick={this.onClick} block>
                      搜索
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>
        </div>
        <div>
          <Card hoverable>
          <Table dataSource={this.state.dataSpecific}
            expandable={{
              expandedRowRender: record => <p style={{ margin: 0 }}>离职原因：{record.description}</p>,
            }}
          >
            <Column title="员工ID" dataIndex="user_id" key="user_id" />
            <Column title="员工姓名" dataIndex="user_name" key="user_name" />
            <Column title="部门" dataIndex="department" key="department" />
            <Column title="岗位" dataIndex="dutytype" key="dutytype" />
            <Column title="申请时间" dataIndex="registerdate" key="registerdate" />
            <Column
              title=" "
              key="action"
              render={(record) => (
                <Space size="middle">
                  <Button type="primary"icon={<CheckOutlined />} onClick={()=>this.showConfirm(record.user_id,1)}>同意</Button> 
                  <Button type="danger"icon={<CloseOutlined />} onClick={()=>this.showConfirm(record.user_id,0)}>拒绝</Button>
                </Space>
              )}
            />
            <BackTop visibilityHeight={200} style={{right: 50}}/>
          </Table>
          </Card>
        </div>
        <BackTop>
          <div style={upToTopStyle}>UP</div>
        </BackTop>
      </div >
    )
  }
}