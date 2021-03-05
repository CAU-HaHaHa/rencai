import { TimePicker } from 'antd';
import React,{Component} from 'react';
import axios from 'axios';
import { Layout, Table, Breadcrumb, Button } from 'antd';
const { RangePicker } = TimePicker;
class JixiaoDemo extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                columns: [{
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    render: text => <a>{text}</a>
                },{
                    title: '编号',
                    dataIndex: 'id',
                    key: 'id'
                },{
                    title: '年龄',
                    dataIndex: 'age',
                    key: 'age'
                },{
                    title: '职位',
                    dataIndex: 'position',
                    key: 'positon'
                }]
            }
        }
    
        render() {
            const {
                dataSource,
                columns
            } = this.state;
            return(
                <div className='bus-time-day'>
                    <Layout>
                        <Breadcrumb>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>BusTime</Breadcrumb.Item>
                            <Breadcrumb.Item>Day</Breadcrumb.Item>
                        </Breadcrumb>
                        <Table 
                            dataSource={dataSource} 
                            columns={columns}
                        ></Table>
                    </Layout>
                </div>
            )
        }
    }
export default BusTimeDay;
    