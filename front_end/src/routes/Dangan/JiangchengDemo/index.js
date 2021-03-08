import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { Table, Modal, Button, Space, Form, DatePicker, Select, Input, Row, Col, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';

const { TextArea } = Input;
const { Option } = Select;

const deptData = ['市场部', '研发部', '业务部', '综合部'];
const dutyData = {
  市场部: ['项目经理', '销售人员'],
  研发部: ['前端开发', '后端开发', '技术中台'],
  业务部: ['业务主管'],
  综合部: ['后勤主管'],
};

// 搜索栏
const AdvancedSearchForm = () => {

  // 搜索表单
  const [form] = Form.useForm();

  // 职责列表
  const [duties, setDuties] = React.useState(dutyData[deptData[0]]);
  // 职责
  const [secondDuty, setsecondDuty] = React.useState(dutyData[deptData[0]][0]);

  // 选择部门
  const handleDeptChange = value => {
    setDuties(dutyData[value]);
    setsecondDuty(dutyData[value][0]);
  };

  // 选择职能
  const onSecondDutyChange = value => {
    setsecondDuty(value);
    form
  };

  const onFinish = (values) => {

    let request_string = "http://http://127.0.0.1:5000/jiangcheng/search?"
    request_string = request_string + "crop_id=&id=" + values.ID + "&name=" + values.name
    request_string = request_string + "&dep=" + values.deptment + "&duty="+ values.duty
    request_string = request_string + "&page_size=10" + "&page_num=1"
    console.log('Received values of form: ', request_string);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", request_string, true)
    xhr.send()

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          //你当然可以用其他方法编码你的返回信息，但是对于js的世界来说，还有什么比json更方便呢？
          let gotServices = JSON.parse(xhr.responseText)
          //好了，我们获得了service列表，使用setState方法覆盖当前元素的services数据
          this.setState({
            services: gotServices
          })
        }
      } else {
        alert("ajax失败了")
      }
    }

    console.log('Received values of form: ', values);
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={12}>
        <Col span={5} key={1}>
          <Form.Item name="ID" label="员工ID">
            <Input placeholder="请输入员工ID" />
          </Form.Item>
        </Col>
        <Col span={5} key={2}>
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入员工姓名" />
          </Form.Item>
        </Col>
        <Col span={4} key={3}>
          <Form.Item name="department" label="员工部门">
            <Select defaultValue={deptData[0]} onChange={handleDeptChange}>
              {deptData.map(deptment => (
                <Option key={deptment}>{deptment}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4} key={4}>
          <Form.Item name="dutytype" label="员工职位">
            <Select value={secondDuty} onChange={onSecondDutyChange}>
              {duties.map(dutytype => (
                <Option key={dutytype}>{dutytype}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4} style={{ textAlign: 'right', }}>
          <Button type="primary" htmlType="submit"> Search </Button>
          {/* 鼠标点击清除事件 */}
          <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}>
            清除
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default class Reward extends React.Component {

  state = {
    visible: false,
    confirmLoading: false,
    modalText: 'Content of the modal',
    user_id: '',
    user_name: '',
  };

  setVisible = (e) => {
    this.setState({
      visible: e
    });
  }

  setModalText = (e) => {
    this.setState({
      modalText: e
    })
  }

  setConfirmLoading = (e) => {
    this.setState({
      confirmLoading: e
    })
  }

  showModal = () => {
    this.setVisible(true);
  };

  ClickAddHandle = (e) => {
    this.setState({
      user_id: e.ID,
      user_name: e.name
    });
    this.setVisible(true);
  }

  handleOk = () => {
    this.setModalText('The modal will be closed after two seconds');
    this.setConfirmLoading(true);
    setTimeout(() => {
      this.setVisible(false);
      this.setConfirmLoading(false);
    }, 2000);
  };

  handleCancel = () => {
    this.setVisible(false);
  };

  ClickViewHandle = (type) => {
    this.props.history.push({ pathname: './jiangcheng/view/' + type.ID })
  }

  render() {
    const data = []
    for (let i = 0; i < 23; i++) {
      data.push({
        key: i,
        ID: "123456789  ",
        name: '宋小花',
        sex: '女',
        date: '2019-01-01',
      })
    }

    // 列数据，包含两个操作按钮
    const columns = [
      {
        title: '员工ID',
        dataIndex: 'ID',
        key: 'id',
        width: '20%',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: '20%'
      },
      {
        title: '入职日期',
        dataIndex: 'date',
        key: 'date',
        width: '20%',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <Space size={[8, 16]} wrap>
              {/* 增添按钮 */}
              <Button type="primary" icon={<PlusOutlined />} onClick={this.ClickAddHandle.bind(this, record)} shape="round">
                新增
              </Button>
              {/* 查看按钮 */}
              <Button type="primary" icon={<SearchOutlined />} onClick={this.ClickViewHandle.bind(this, record)} shape="round">
                查看
              </Button>
            </Space>
          </div>
        ),
      }
    ];

    return (
      <div>
        {/* 顶部导航信息 */}
        <CustomBreadcrumb arr={['员工档案管理', '员工奖惩']} />
        {/* 高级搜索框 */}
        <Card hoverable bordered={false} className='card-item' title="搜索栏">
          <AdvancedSearchForm />
        </Card>
        {/* 展示数据的表格 */}
        <Table columns={columns} dataSource={data} pagination={{ position: 'bottomCenter' }} />;
        {/* 增添模态框 */}
        <Modal
          title="添加奖惩记录"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form
            labelCol={{ span: 4, }}
            wrapperCol={{ span: 16, }}
            layout="horizontal"
          >
            <Row >
              <Col span={12}>
                <Form.Item label="ID">
                  <Text>
                    {this.state.user_id}
                  </Text>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="姓名">
                  <Text>
                    {this.state.user_name}
                  </Text>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="奖惩类型">
              <Select placeholder="请选择奖惩类型">
                <Option value="Reward">奖励</Option>
                <Option value="Punishment">惩罚</Option>
              </Select>
            </Form.Item>
            <Form.Item label="奖惩名称">
              <Input placeholder="请输入奖惩名称" />
            </Form.Item>
            <Form.Item label="奖惩时间">
              <DatePicker />
            </Form.Item>
            <Form.Item label="详细说明">
              <TextArea autoSize={{ minRows: 5 }} showCount maxLength={100} placeholder="详细描述奖惩情况，在100字以内" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }

}

