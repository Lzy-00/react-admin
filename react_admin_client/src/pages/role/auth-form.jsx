import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd';
import PropTypes from 'prop-types';
import menuList from '../../config/menuConfig';
/*
添加/更新角色的form组件
*/

const { Item } = Form;
export default class AuthForm extends Component {
    // 根据传入角色的menus生成初始状态
    constructor(props) {
        super(props);
        const { role } = props;
        this.state = {
            checkedKeys: role.menus
        }
    }

    // 将menuList转化为treeData数组
    getTreeData = (menuList) => {
        return menuList.map(item => {
            if (item.children) {
                return {
                    title: item.title,
                    key: item.key,
                    children: this.getTreeData(item.children),
                }
            } else {
                return {
                    title: item.title,
                    key: item.key,
                }
            }
        });
    }

    // 选中某个选项的回调
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
    }

    // 为父组件提交获取最新的menus
    getMenus = () => {
        return this.state.checkedKeys;
    }

    UNSAFE_componentWillMount() {
        this.treeData = [{
            title: '平台权限',
            key: 'all',
            children: this.getTreeData(menuList),
        }];
    }

    // 根据新传入的role来更新checkedKeys的状态
    // 当组件接收到新的属性时自动调用
    // 第一次render()时不会调用，只在更新时调用
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { menus } = nextProps.role;
        this.setState({ checkedKeys: menus });
    }

    render() {
        // console.log('auth-form');
        const { role } = this.props;
        const { checkedKeys } = this.state;
        return (
            <Form>
                <Item label="角色名称">
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    treeData={this.treeData}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                />
            </Form>
        )
    }
}

AuthForm.propTypes = {
    role: PropTypes.object,
}