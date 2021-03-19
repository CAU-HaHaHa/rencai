import React, { useState } from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { Row, Col, Card, Form, Cascader, Button, InputNumber, Input, notification } from 'antd';
import axios from "axios"
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'

const { TextArea } = Input;
axios.defaults.baseURL = "http://45.76.99.155"

// 搜索栏
const AdvancedSearchForm = (props) => {

    // 搜索表单
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

    // 点击提交搜索表单事件
    const onFinish = (values) => {
        props.SetTableData(dept, duty, values.peopleNumber, values.detial)
    };

    return (
        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onFinish}
        >
            <Row gutter={12}>
                <Col span={5} key={3}>
                    <Form.Item name="depandduty" label="部门/职位" >
                        <Cascader options={options} onChange={onChange} />,
                     </Form.Item>
                </Col>
                <Col span={4} key={3} offset={2}>
                    <Form.Item name="peopleNumber" label="岗位数量" >
                        <InputNumber min={1} max={100} defaultValue={1} />
                    </Form.Item>
                </Col>
                <Col span={4} style={{ textAlign: 'right', }}>
                    {/* 鼠标点击清除事件 */}
                    <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}>
                        清除
                    </Button>
                    <Button type="primary" htmlType="submit" disabled={props.disabled} > 提交 </Button>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={15} key={3}>
                    <Form.Item name="detial" label="岗位职责" >
                        <TextArea autoSize={{ minRows: 12 }} showCount maxLength={500} placeholder="详细描述岗位情况，在500字以内" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};


@withRouter @inject('appStore') @observer
export default class JobRelease extends React.Component {
    // 构造函数：
    constructor(props) {
        super(props);
        this.state = {
            form_disabled: false
        }
    }

    // 发送post请求将招聘信息发送至数据库
    SetTableData = (department, posttype, number, description) => {
        // 请求字段
        var params = new URLSearchParams();
        params.append('corporation_id', this.props.appStore.loginUser.corporationid);
        params.append('department', department);
        params.append('posttype', posttype);
        params.append('number', (number ? number : 1));
        params.append('description', description);
        // 在将数据添加到数据库之前，不允许再次添加，防止由于网络问题导致重复提交
        this.setState({
            form_disabled: true
        })
        // 发送get请求，从后端读取数据
        var _this = this
        axios.post('/recuit/add', params)
            // 显示成功信息
            .then(function (response) {
                console.log(response.data.data)
                notification['success']({
                    message: '添加成功',
                    description:
                        '您已成功将' + department + "/" + posttype + '的招聘信息！',
                });
            })
            // 显示失败信息
            .catch(function (error) {
                console.log(error);
                notification['error']({
                    message: '添加失败',
                    description:
                        '招聘信息发布失败，请联系管理员！'
                });

            })
            // 表格重新可以提交
            .then(function () {
                _this.setState({
                    form_disabled: false
                })
            })
    }

    // 渲染UI界面
    render() {
        return (
            <div>
                <CustomBreadcrumb arr={['人才招聘工作台', '发布招聘广告']} />、
                <Card title="发布新的岗位" bordered={false}>
                    <AdvancedSearchForm SetTableData={this.SetTableData} disabled={this.state.form_disabled} />
                </Card>
            </div>
        )
    }
}