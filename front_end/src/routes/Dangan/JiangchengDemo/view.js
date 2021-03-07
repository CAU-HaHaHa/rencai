import React from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import { List, Row, Col, Card, Space, Avatar } from 'antd';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';

export default class Reward extends React.Component {
    render() {
        const listData = [];
        for (let i = 0; i < 23; i++) {
            listData.push({
                type: `奖励`,
                name: "学习优秀三等奖学金",
                avatar: '../../../assets/img/惩罚.svg',
                date: "2020-01-01", 
                hr_id: "123456",
                description:'为了贯彻我国有关来华留学生教育的方针政策，促进留学生综合素质的全面提高，培养高素质人才，根据国家和江苏省有关规定，特设立学习优秀奖学金。学习优秀奖学金评定主要依据三方面情况：基本素质、学习成绩和创新能力测评。基本素质测评分为：学习态度、身心健康、文明行为等三个方面。',
            });
        }

        return (
            <div>
                {/* 顶部导航信息 */}
                <CustomBreadcrumb arr={['员工档案管理', '员工奖惩', '查看']} />
                <Row gutter={[16, 16]}>
                    {/* 员工信息卡片 */}
                    <Col span={12}>
                        <Card title="宋小花" bordered={false}>
                            <p>ID：123456</p>
                            <p>性别：女</p>
                            <p>入职日期：2021-1-1</p>
                        </Card>
                    </Col>
                    {/* 奖惩统计卡片 */}
                    <Col span={12}>
                        <Card title="奖惩统计" bordered={false}>
                            <p>奖励总次数：12</p>
                            <p>惩罚总次数：2</p>
                            <p>奖励占比：85.7%</p>
                        </Card>
                    </Col>
                    {/* 详细记录 */}
                    <Col span={24}>
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                onChange: page => {
                                    console.log(page);
                                },
                                pageSize: 3,
                            }}
                            dataSource={listData}
                            renderItem={item => (
                                <List.Item key={item.title}>
                                    <List.Item.Meta
                                        // 奖励 / 惩罚 图标
                                        avatar={<Avatar src={item.avatar} />}
                                        // 奖励类型
                                        title={item.name}
                                        description={
                                            // 奖励时间和hr_id
                                            <Space> 
                                                <text>{item.date}</text> 
                                                <text>{"记录员编号："+item.hr_id}</text>  
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