import React from 'react'
import {Icon, Card, BackTop, Anchor, Affix} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import { Table, Tag, Space } from 'antd';
import { Button, Menu, Dropdown, Modal,InputNumber } from 'antd';
import './ui.less'
import { Input } from 'antd';
import { DatePicker} from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

function onOk(value) {
  console.log('onOk: ', value);
}
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;

function onChange(value) {
  console.log('changed', value);
}

//开始
class JixiaoDemo extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      modalAddInfoVisible: false, //新增信息Modal的显示属性
    }
    this.handleclickbtn = this.handleclickbtn.bind(this);
  }

  handleclickbtn(){
    this.props.history.push({pathname: '/add'});
  }

  //设置一个弹出框可见,type为传入的变量，用于标识点了哪个按钮
  openModalAddInfo = (type)=>{
    this.setState({[type+"Visible"]: true})
  }
  
  //api
  componentDidMount() {
    const _this = this;
    axios.get('https://60418bef7f50e000173aa942.mockapi.io/api/vi/dataSource')
    .then(function(response) {
        _this.setState({
            dataSource: response.data,
            isLoaded: true
        });
    });
  } 

  render() {
    const {
      dataSource,
    } = this.state;
    return (
      <div>
        <CustomBreadcrumb arr={['员工档案管理','绩效评价']}/>
        <Table dataSource={dataSource}>
          <Column title="Name" dataIndex="name" key="name" />
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="Age" dataIndex="age" key="age" />
          <Column title="Position" dataIndex="position" key="position" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <Button type="primary" onClick={()=>this.openModalAddInfo("modalAddInfo")}>增加绩效</Button>
                <Button type="primary" onClick={this.handleclickbtn}>查看绩效</Button>
              </Space>
            )}
          />
        <BackTop visibilityHeight={200} style={{right: 50}}/>
        </Table>
        <Modal title="增加绩效"
                visible={this.state.modalAddInfoVisible}
                wrapClassName="vertical-center-modal"
                onCancel={()=>{
                this. setState({modalAddInfoVisible: false})
                
              }} >
          <Space direction="vertical" size={12}>
          <span>填写时间：</span><DatePicker showTime onChange={onChange} onOk={onOk} />
          <span>绩效评定起止时间：</span>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChange}
              onOk={onOk}
            />
          </Space>
          <br />
          <br />
          <span>绩效评分：</span><InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
          <br />
          <span>绩效描述：</span><TextArea rows={4} />
        </Modal> 
      </div>
    )
  }
}

const styles = {
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    width: '17%'
  },
  icon: {
    fontSize: 18,
    marginBottom: 10
  },
  affixBox: {
    position: 'absolute',
    top: 100,
    right: 50,
    with: 170
  }
}

export default JixiaoDemo