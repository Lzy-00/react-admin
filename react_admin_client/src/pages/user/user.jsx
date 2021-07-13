import React, { Component } from 'react';
import { Card, Button, Modal, Table, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button';
import { formateDate } from '../../utils/dateUtils';
import { PAGE_SIZE } from '../../utils/constants';
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api';
import UserForm from './user-form';
/*
用户管理路由
*/
export default class User extends Component {
    state = {
        users: [],  // 用户列表
        roles: [], //角色列表
        isShow: false, //是否显示确认框
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate,
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id],
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton
                            onClick={() => this.showUpdate(user)}
                        >
                            修改
                        </LinkButton>
                        <LinkButton
                            onClick={() => this.deleteUser(user)}
                        >
                            删除
                        </LinkButton>
                    </span>
                )
            },
        ]
    }

    // 根据roles数组生成包含所有角色名的对象（属性名用角色id）
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, cur) => {
            pre[cur._id] = cur.name;
            return pre;
        }, {})
        // 保存
        this.roleNames = roleNames;
    }

    //添加或更新用户
    addOrUpdateUser = async () => {
        // 收集数据
        const user = await this.form.validateFields();
        //隐藏确认框
        this.setState({
            isShow: false,
        });
        // 清除数据
        this.form.resetFields();
        // 如果是更新，需要给user指定_id属性
        if (this.user) {
            user._id = this.user._id;
        }
        //提交请求
        const result = await reqAddOrUpdateUser(user);
        if (result.status === 0) {
            message.success((user._id ? '更新' : '添加') + '用户成功');
            this.getUsers();
        } else {
            message.error((user._id ? '更新' : '添加') + '用户失败');
        }
    }

    // 获取用户列表
    getUsers = async () => {
        const result = await reqUsers();
        if (result.status === 0) {
            const { users, roles } = result.data;
            this.initRoleNames(roles);
            this.setState({
                users,
                roles,
            })
        }
    }

    // 删除指定用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const result = await reqDeleteUser(user._id);
                if (result.status === 0) {
                    message.success('删除用户成功');
                    this.getUsers();
                } else {
                    message.error('删除用户失败');
                }
            }
        })
    }

    // 显示修改界面
    showUpdate = (user) => {
        this.setState({ isShow: true });
        this.user = user;  // 保存user
    }

    // 显示添加页面
    showAdd = () => {
        this.setState({ isShow: true });
        this.user = null;  // 去除前面保存的user
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        const { users, isShow, roles } = this.state;
        const { user } = this;
        const title = <Button type="primary" onClick={this.showAdd}>创建用户</Button>;
        return (
            <Card title={title}>
                <Table
                    bordered
                    dataSource={users}
                    rowKey='_id'
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                />
                <Modal
                    title={user ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({ isShow: false });
                        this.form.resetFields();
                    }}
                >
                    <UserForm setForm={form => this.form = form} roles={roles} user={user} />
                </Modal>
            </Card >
        )
    }
}
