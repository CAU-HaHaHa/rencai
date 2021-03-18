import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { Table, Modal, Button, Space, Form, DatePicker, Select, Input, Row, Col, Card, Cascader, ConfigProvider, notification } from 'antd';
import { PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import axios from "axios"
import moment from "moment"

// 起一个别名，防止混淆
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

// 设置路由请求的超时世时间和URL
axios.defaults.timeout = 30000;
axios.defaults.baseURL = "http://45.76.99.155"

// 搜索栏（以函数的形式实现
const AdvancedSearchForm = (props) => {

  // 搜索表单实体
  const [form] = Form.useForm();

  // 部门数据
  const options = [
    {
      value: '市场部',
      label: '市场部',
      children: [
        {
          value: '项目经理',
          label: '项目经理',
        },
        {
          value: '销售人员',
          label: '销售人员',
        }
      ],
    },
    {
      value: '研发部',
      label: '研发部',
      children: [
        {
          value: '前端开发',
          label: '前端开发',
        },
        {
          value: '后端开发',
          label: '后端开发'
        },
        {
          value: '技术中台',
          label: '技术中台'
        }
      ],
    },
    {
      value: '业务部',
      label: '业务部',
      children: [
        {
          value: '业务主管',
          label: '业务主管',
        },
      ],
    },
    {
      value: '综合部',
      label: '综合部',
      children: [
        {
          value: '后勤主管',
          label: '后勤主管',
        },
      ],
    }
  ];

  // 两个属性
  let dept = '';
  let duty = '';

  // 选择栏保存事件
  function onChange(value) {
    dept = value[0];
    duty = value[1];
  }

  // 点击提交搜索表单事件（调用父组件的函数，完成子组件改变父组件状态的功能
  const onFinish = (values) => {
    // get请求
    props.SetTableData(values.ID, values.name, dept, duty) 
  };

  // 渲染UI界面
  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={12}>
        <Col span={5} key={1}>
          <Form.Item name="ID" label="员工ID" defaults="">
            <Input placeholder="请输入员工ID" />
          </Form.Item>
        </Col>
        <Col span={5} key={2}>
          <Form.Item name="name" label="姓名" defaults="">
            <Input placeholder="请输入员工姓名" />
          </Form.Item>
        </Col>
        <Col span={8} key={3}>
          <Form.Item name="depandduty" label="员工部门/职位">
            <Cascader options={options} onChange={onChange} />,
          </Form.Item>
        </Col>
        <Col span={4} style={{ textAlign: 'right', }}>
          <Button type="primary" htmlType="submit"> 搜索 </Button>
          {/* 鼠标点击清除事件 */}
          <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}>
            清除
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

// 大组件
export default class Reward extends React.Component {

  // 构造函数：初始换子组件、初始化状态，发送get请求拿到默认数据
  constructor(props) {
    super(props);
    this.state = {
      visible: false,         // 模态框可见
      user_id: '',            
      user_name: '',          
      department: '',
      dutytype: '',
      tabledata: [],          // 表格数据
      tableloading: false     // 表格的数据是否加载
    }
    this.SetTableData();
    this.form = React.createRef();
  }

  // 设置模态框可见
  setVisible = (e) => {
    this.setState({
      visible: e
    });
  }

  // 展示模态框
  showModal = () => {
    this.setVisible(true);
  };

  // 添加奖惩记录post API
  AddRewardAPI = (value) => {
    // 整合post的请求字段
    var params = new URLSearchParams();
    params.append('corp_id', 1);
    params.append('user_id', this.state.user_id);
    params.append('hr_id', 1);
    params.append('user_name', this.state.user_name);
    params.append('department', this.state.department)
    params.append('dutytype', this.state.dutytype)
    var rewordtype = (value.rewardTpye == "reward" ? 1 : 0);
    params.append('rewardTpye', rewordtype);
    params.append('rewardName', value.rewardName);
    params.append('description', value.detial);
    var time = moment(value.rewardTime).format("YYYY-MM-DD")
    params.append('rewardTime', time);
    // 保存this指针
    var _this = this
    // 发送post请求，根据是否成功来显示有关信息
    axios.post("/reward/add", params)
      .then(function () {
        notification['success']({
          message: '添加成功',
          description:
            '您已成功将' + _this.state.user_name + '的奖惩记录添加至数据库！',
        });
      })
      .catch(function (error) {
        notification['error']({
          message: '添加失败',
          description:
            error,
        });
      })
      .then(
        // 清空模态框数据
        this.form.current.resetFields()
      )
  }

  // 模态框点击提交按钮，弹出二次确认模态框
  showPromiseConfirm = () => {
    Modal.confirm({
      title: '确认添加此记录吗?',
      icon: <ExclamationCircleOutlined />,
      content: '添加后不能修改，请确认此记录已被正确填写',
      okText: '是',
      cancelText: '否',
      centered: true,
      onOk: () => {
        this.handleOk() //确认按钮的回调方法，在下面
      },
    });
  }

  // 点击模态框的提交按钮
  handleOk = () => {
    // 关闭模态框
    this.setVisible(false);
    // 发送post请求将数据添加到数据库
    this.form.current.validateFields().then(value => this.AddRewardAPI(value));
  };

  // 点击模态框的取消按钮
  handleCancel = () => {
    this.setVisible(false);
  };

  // 点击添加按钮
  ClickAddHandle = (e) => {
    this.setState({
      user_id: e.user_id,
      user_name: e.user_name,
      department: e.department,
      dutytype: e.dutytype
    });
    this.setVisible(true);
  }

  // 点击表格每列数据的查看按钮
  ClickViewHandle = (type) => {
    this.props.history.push({ pathname: './jiangcheng/view/' + type.user_id })
  }

  // get请求API，从数据库中拿到奖惩数据并展示到表格中
  SetTableData = (id, name, dept, duty) => {
    // 防止undifine
    id = (id ? id : '')
    name = (name ? name : '')
    dept = (dept ? dept : '')
    duty = (duty ? duty : '')
    console.log(id, name, dept, duty)

    // 查询前表格显示加载中。。。
    this.setState({
      tableloading: true
    })

    // 保存this指针，防止箭头函数将this覆盖
    const _this = this

    // 发送get请求，从后端读取数据
    axios.get('/jiangcheng/search', {
      params: {
        id: id,
        name: name,
        dept: dept,
        duty: duty,
      }
    })
      .then(function (response) {
        console.log(response.data.data)
        _this.setState({
          tabledata: response.data.data
        })
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(
        // 查询后取消加载中标识
        this.setState({
          tableloading: false
        })
      )
  }

  render() {
    // 列数据，包含两个操作按钮
    const columns = [
      {
        title: '员工ID',
        dataIndex: 'user_id',
        key: 'user_id',
        width: '20%',
      },
      {
        title: '员工姓名',
        dataIndex: 'user_name',
        key: 'user_name',
        width: '20%',
      },
      {
        title: '员工部门',
        dataIndex: 'department',
        key: 'department',
        width: '20%'
      },
      {
        title: '员工职位',
        dataIndex: 'dutytype',
        key: 'dutytype',
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

    // 渲染UI界面
    return (
      <div>
        {/* 顶部导航信息 */}
        <CustomBreadcrumb arr={['员工档案管理', '员工奖惩']} />
        {/* 高级搜索框 */}
        <Card hoverable bordered={false} className='card-item' title="搜索栏">
          <AdvancedSearchForm SetTableData={this.SetTableData} />
        </Card>
        {/* 展示数据的表格 */}
        <Table columns={columns} dataSource={this.state.tabledata} loading={this.state.tableloading} />;
        {/* 增添模态框 */}
        <Modal
          title="添加奖惩记录"
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          // 取消按钮
          onCancel={
            () => {
              this.setState({ visible: false });
            }
          }
          // 关联提交按钮
          footer={[
            <Button type="primary" onClick={this.showPromiseConfirm} key={'submit'}>
              提交
            </Button>
          ]}
        >
          <Form
            labelCol={{ span: 4, }}
            wrapperCol={{ span: 16, }}
            layout="horizontal"
            ref={this.form}
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
            <Form.Item label="奖惩类型" name='rewardTpye'>
              <Select placeholder="请选择奖惩类型">
                <Option value="Reward">奖励</Option>
                <Option value="Punishment">惩罚</Option>
              </Select>
            </Form.Item>
            <Form.Item label="奖惩名称" name='rewardName'>
              <Input placeholder="请输入奖惩名称" />
            </Form.Item>
            <Form.Item label="奖惩时间" name="rewardTime">
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="详细说明" name='detial'>
              <TextArea autoSize={{ minRows: 5 }} showCount maxLength={100} placeholder="详细描述奖惩情况，在100字以内" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

