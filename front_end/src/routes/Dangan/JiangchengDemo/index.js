import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { Table, Modal, Button, Space, Form, DatePicker, Select, Input, Row, Col, Card } from 'antd';
import { PlusOutlined, SearchOutlined} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';

const AdvancedSearchForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
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
        <Col span={4} key={2}>
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入员工姓名" />
          </Form.Item>
        </Col>
        <Col span={5} key={3}>
          <Form.Item name="ID" label="员工性别">
            <Select placeholder="请选择员工性别">
              <Option value="man">男</Option>
              <Option value="woman">女</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} key={4}>
          <Form.Item name="date" label="入职日期">
            <RangePicker format={dateFormat} />
          </Form.Item>
        </Col>
        <Col span={4} style={{ textAlign: 'right', }}>
          <Button type="primary" htmlType="submit"> Search </Button>
          <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}>
            Clear
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

  ClickAddHandle = () => {
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

  ClickViewHandle = () => {
    this.props.history.push('./jiangcheng/view')
  }

  render() {
    const data = []
    for (let i = 0; i < 23; i++) {
      data.push({
        key: i,
        ID: "123456",
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
        key: 'ID',
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
              <Button type="primary" icon={<PlusOutlined />} onClick={this.ClickAddHandle} shape="round">
                新增
              </Button>
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
                  wrapperCol={{ span: 14, }}
                  layout="horizontal"
                >
                  <Form.Item label="奖惩类型">
                    <Select placeholder="请选择奖惩类型">
                      <Option value="Reward">奖励</Option>
                      <Option value="Punishment">惩罚</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="奖惩名称">
                    <Input placeholder="请输入奖惩名称"/>
                  </Form.Item>
                  <Form.Item label="奖惩时间">
                    <DatePicker />
                  </Form.Item>
                  <Form.Item label="详细说明">
                    <TextArea autoSize={{ minRows: 5 }} showCount maxLength={100} placeholder="详细描述奖惩情况，在100字以内" />
                  </Form.Item>
                </Form>
              </Modal>
              {/* 查看按钮 */}
              <Button type="primary" icon={<SearchOutlined />} onClick={this.ClickViewHandle} shape="round">
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
      </div>
    )
  }

}

