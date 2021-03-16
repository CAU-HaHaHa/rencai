import React, { useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import { Button, Card, Modal, message } from 'antd';
import {Tree, Icon} from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import styles from './EditableTree.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { changeStructure,getStructure } from '../../../api/loginRequest'
import axios from "axios";
import DemoOrganizationGraph from '../../../components/Structure/index'

const {TreeNode} = Tree;

@withRouter @inject('appStore') @observer
export default class Treee extends React.Component{
  data = [];
  expandedKeys = [];
  constructor(props){
    super(props);
    this.state = {
      expandedKeys: [],
      structure: [],
      data: this.data
    };
  }
  

  componentDidMount() {
    // Tip: Must have, or the parent node will not expand automatically when you first add a child node
    this.onExpand([]); // 手动触发，否则会遇到第一次添加子节点不展开的Bug
    // 获取公司结构信息
    this.GetStructure();
  }

  // 获得公司结构数据
  GetStructure(){
    let data = getStructure(this.props.appStore.loginUser.corporationid);
    axios.all([data]).then(
      (res) => {
        // console.log(res[0].data.data);
        this.setState({
          structure: res[0].data.data,
          data: [res[0].data.data],
        })
        this.data = [res[0].data.data]
      }
    ).catch(
      () =>{
        message.error("结构数据请求错误");
      }
    )
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    this.expandedKeys = expandedKeys;
    this.setState({ expandedKeys: expandedKeys })
  }

  renderTreeNodes = data => data.map((item) => {
        if (item.isEditable) {
            item.title = (
                <div>
                    <input
                        className={styles.inputField}
                        value={item.value}
                        onChange={(e) => this.onChange(e, item.key)} />
                    <LegacyIcon type='close' style={{ marginLeft: 10 }} onClick={() => this.onClose(item.key, item.defaultValue)} />
                    <LegacyIcon type='check' style={{ marginLeft: 10 }} onClick={() => this.onSave(item.key)} />
                </div>
            );
        } else {
            item.title = (
                <div className={styles.titleContainer}>
                    <span>
                        {item.value}
                    </span>
                    <span className={styles.operationField} >
                        <LegacyIcon style={{ marginLeft: 10 }} type='edit' onClick={() => this.onEdit(item.key)} />
                        <LegacyIcon style={{ marginLeft: 10 }} type='plus' onClick={() => this.onAdd(item.key)} />
                        {item.parentKey === '0' ? null : (<LegacyIcon style={{ marginLeft: 10 }} type='minus' onClick={() => this.onDelete(item.key)} />)}
                    </span>
                </div>
            )
        }

        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }

        return <TreeNode {...item} />;
    })


  onAdd = (e) => {
    console.log('add');
    // 防止expandedKeys重复
    // Tip: Must have, expandedKeys should not be reduplicative
    if (this.state.expandedKeys.indexOf(e) === -1) {
      this.expandedKeys.push(e);
    }
    this.addNode(e, this.data);
    this.setState({
      expandedKeys: this.expandedKeys,
      data: this.data
    });
  }

  addNode = (key, data) => data.map((item) => {
    if (item.key === key) {
      if (item.children) {
        item
          .children
          .push({
            value: 'default',
            defaultValue: 'default',
            key: key + Math.random(100), // 这个 key 应该是唯一的。 Tip: The key should be unique
            parentKey: key,
            isEditable: false
          });
      } else {
        item.children = [];
        item
          .children
          .push({
            value: 'default',
            defaultValue: 'default',
            key: key + Math.random(100),
            parentKey: key,
            isEditable: false
          });
      }
      return;
    }
    if (item.children) {
      this.addNode(key, item.children)
    }
  })

  onDelete = (key) => {
    console.log('delete');
    this.deleteNode(key, this.data);
    this.setState({
      data: this.data
    });
  }

  deleteNode = (key, data) => data.map((item, index) => {
    if (item.key === key) {
      data.splice(index, 1);
      return;
    } else {
      if (item.children) {
        this.deleteNode(key, item.children)
      }
    }
  })

  onEdit = (key) => {
    console.log('edit');
    this.editNode(key, this.data);
    this.setState({
      data: this.data
    });
  }

  editNode = (key, data) => data.map((item) => {
    if (item.key === key) {
      item.isEditable = true;
    } else {
      item.isEditable = false;
    }
    //Tip: Must have, when a node is editable, and you click a button to make other node editable, the node which you don't save yet will be not editable, and its value should be defaultValue 
    item.value = item.defaultValue; // 当某节点处于编辑状态，并改变数据，点击编辑其他节点时，此节点变成不可编辑状态，value 需要回退到 defaultvalue
    if (item.children) {
      this.editNode(key, item.children)
    }
  })

  onClose = (key, defaultValue) => {
    console.log('close');
    this.closeNode(key, defaultValue, this.data);
    this.setState({
      data: this.data
    });
  }

  closeNode = (key, defaultValue, data) => data.map((item) => {
    item.isEditable = false;
    if (item.key === key) {
      item.value = defaultValue;
    }
    if (item.children) {
      this.closeNode(key, defaultValue, item.children)
    }
  })

  onSave = (key) => {
    console.log('save')
    this.saveNode(key, this.data);
    this.setState({
      data: this.data
    });
  }

  saveNode = (key, data) => data.map((item) => {
    if (item.key === key) {
      item.defaultValue = item.value;
    }
    if (item.children) {
      this.saveNode(key, item.children)
    }
    item.isEditable = false;
  })

  onChange = (e, key) => {
    console.log('onchange')
    this.changeNode(key, e.target.value, this.data);
    this.setState({
      data: this.data
    });
  }

  changeNode = (key, value, data) => data.map((item) => {
    if (item.key === key) {
      item.value = value;
    }
    if (item.children) {
      this.changeNode(key, value, item.children)
    }
  })



  // 格式转换
  dfsTrans = (nodes) => {
    let res = []
    for(const node of nodes){
      if(node.children){
        let children = this.dfsTrans(node.children);
        res.push({
          value: node.value,
          defaultValue: node.defaultValue,
          key: node.key,
          parentKey: node.parentKey,
          isEditable: node.isEditable,
          children: children,
        })
      }
      else{
        res.push({
          value: node.value,
          defaultValue: node.defaultValue,
          key: node.key,
          parentKey: node.parentKey,
          isEditable: node.isEditable,
        })
      }
    }
    return res
  }
  // 格式转换
  dfs =(nodes) => {
    let res = []
    for(const node of nodes){
      if(node.children){
        let children = this.dfs(node.children);
        res.push({
          id: node.key,
          label: node.value,
          children: children
        })
      }
      else{
        res.push({
          id: node.key,
          label: node.value,
        })
      }
    }
    return res
  }

  // 编辑架构树
  editTree = () => {
    const [visible, setVisible] = useState(false);
    const { confirm } = Modal;
    const onCreate = () =>{
      confirm({
        title: 'Do you Want to delete these items?',
        icon: <ExclamationCircleOutlined />,
        content: 'Some descriptions',
        onOk: () => {
          let temp = this.dfsTrans(this.state.data);
          console.log(typeof JSON.stringify(temp))
          let data = changeStructure(this.props.appStore.loginUser.corporationid, JSON.stringify(temp))
          axios.all([data]).then(
            (res) => {
              console.log(res[0].data);
              this.GetStructure();
              message.success("编辑公司架构成功");
            }
          ).catch(
            () =>{
              message.error("编辑公司架构失败");
            }
          )
          console.log('OK');
          setVisible(false);
        },
        onCancel: () => {
          console.log('Cancel');
          message.error("编辑公司架构失败");
        },
      });
    } 

    return(
      <div>
        <Button type="primary"onClick={() => { setVisible(true);}}>Edit</Button>
        <this.treeModal
          visible={visible}
          onCreate={onCreate}
          onCancel={() => { setVisible(false);}}
        />  
      </div>
    )
  }

  treeModal = ({visible, onCreate, onCancel}) => {
    return(
      <Modal
          visible={visible}
          title="编辑公司信息"
          okText="Create"
          cancelText="Cancel"
          onCancel={onCancel}
          onOk={onCreate}
          width = {1100}
        >
      <Tree expandedKeys={this.state.expandedKeys} selectedKeys={[]} onExpand={this.onExpand}>
          {this.renderTreeNodes(this.state.data)}
        </Tree>
      </Modal>
    )
  }

  render() {
    let structureData = []
    if(this.state.structure!=[]){
      console.log(this.state.structure)
      structureData = this.dfs([this.state.structure]);
      console.log(structureData[0])
      structureData = structureData[0]
    }
    return (
      <div>
        <Card>
        <this.editTree />
        {
          structureData==[] ?  <div></div> :   <DemoOrganizationGraph  data={structureData}/>
        }
        </Card>
      </div>
    )
  }
}