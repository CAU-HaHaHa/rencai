import React from 'react';
import { OrganizationTreeGraph } from '@ant-design/charts';

const DemoOrganizationGraph = (data) => {
    data=data.data;
    /**
     * 遍历树的方法，仅作为演示 demo 中使用，实际使用中根据具体需求而定
     */
    const traverseTree = (data, fn) => {
        if (typeof fn !== 'function') {
            return;
        }
        if (fn(data) === false) {
            return false;
        }
        if (data && data.children) {
            for (let i = data.children.length - 1; i >= 0; i--) {
                if (!traverseTree(data.children[i], fn))
                    return false;
            }
        }
        return true;
    };
    traverseTree(data, (d) => {
        d.leftIcon = {
            style: {
                fill: '#e6fffb',
                stroke: '#e6fffb',
            },
            img: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ',
        };
        return true;
    });
    
    return <OrganizationTreeGraph data={data} nodeType="icon-node" enableEdit={false}/>;
};
export default DemoOrganizationGraph;