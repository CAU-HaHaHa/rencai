import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import { List, Row, Col, Card, Space, Avatar } from 'antd';
import { withRouter } from 'react-router';
import {
  observer,
  inject,
} from 'mobx-react'
import appStore from '../../../store/appStore'
import moment from 'moment'
import axios from "axios"


axios.defaults.timeout = 30000;
axios.defaults.baseURL = "http://45.76.99.155"

@withRouter @inject('appStore') @observer
export default class StuffJiangchengDemo extends React.Component {

    constructor(props) {
        super(props);
        //初始化状态
        this.state = {
            user_id: '',
            user_name: '',
            department: '',
            dutytype: '',
            listData: [],
            reward_count: 0,
            punishment_count: 0
        };
        //保存this指针，防止被覆盖
        const _this = this
        //发送get请求动态添加员工的基本信息
        axios.get('/jiangcheng/search', {
            params: {
                id: appStore.loginUser.userid
            }
        })
            .then(function (response) {
                _this.setState({
                    user_id: response.data.data[0].user_id,
                    user_name: response.data.data[0].user_name,
                    department: response.data.data[0].department,
                    dutytype: response.data.data[0].dutytype
                })
            })
            .catch(function (error) {
                console.log(error);
            })

        // 发送get请求
        axios.get('/reward/search', {
            params: {
                /*user_id: _this.props.match.params.id*/
                user_id: appStore.loginUser.userid
            }
        })
            .then(function (response) {
                // 将拿到的奖惩数据放入list中
                _this.setState({
                    listData: response.data.message
                })
                // 遍历所有的数据，统计奖励和惩罚的数目
                let reward_count = 0
                let punishment_count = 0
                for (let i = 0; i < response.data.message.length; i++) {
                    if (response.data.message[i].rew_or_pun) {
                        reward_count += 1;
                    }
                    else {
                        punishment_count += 1;
                    }
                }
                // 将统计结果传入state
                _this.setState({
                    reward_count: reward_count,
                    punishment_count: punishment_count
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                {/* 顶部导航信息 */}
                <CustomBreadcrumb arr={['个人档案管理', '奖惩查看']} />
                <Row gutter={[16, 16]}>
                    {/* 员工信息卡片 */}
                    <Col span={12}>
                        <Card.Grid title={this.state.user_name} bordered={false} style={gridStyle}>
                            <p>员工ID：{this.state.user_id}</p>
                            <p>员工部门：{this.state.department}</p>
                            <p>员工职位：{this.state.dutytype}</p>
                        </Card.Grid>
                    </Col>
                    {/* 奖惩统计卡片 */}
                    <Col span={12}>
                        <Card.Grid title="奖惩统计" bordered={false} style={gridStyle}>
                            <p>奖励总次数：{this.state.reward_count}</p>
                            <p>惩罚总次数：{this.state.punishment_count}</p>
                            <p>奖励占比：{this.state.reward_count / (this.state.reward_count + this.state.punishment_count)}</p>
                        </Card.Grid>
                    </Col>
                    {/* 详细记录 */}
                    <Col span={24}>
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                pageSize: 3,
                            }}
                            dataSource={this.state.listData}
                            renderItem={item => (
                                <List.Item key={item.reward_pun_name}>
                                    <List.Item.Meta
                                        // 奖励 / 惩罚 图标
                                        avatar={<Avatar src={item.rew_or_pun ? require('./img/奖励.png') : require('./img/惩罚.png')} />}
                                        // 奖励类型
                                        title={item.reward_pun_name}
                                        description={
                                            // 奖励时间和hr_id
                                            <Space>
                                                <text>{moment(item.registerdate).format("YYYY-MM-DD") }</text>
                                                <text>{"记录员编号：" + item.hr_id}</text>
                                            </Space>}
                                    />
                                    {/* 详细描述 */}
                                    {item.description}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

const gridStyle = {
    width: '100%',
    textAlign: 'center',
  };