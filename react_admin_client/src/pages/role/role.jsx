import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd';
import { connect } from 'react-redux';

import { PAGE_SIZE } from '../../utils/constants';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import { formateDate } from '../../utils/dateUtils';
import { logout } from '../../redux/actions';

/*
角色管理路由
*/
class Role extends Component {
    state = {
        roles: [],  //所有角色的列表
        role: {},  //选中的role对象
        isShowAdd: false,  // 是否显示添加界面
        isShowAuth: false,  //是否显示设置权限界面
    }

    constructor(props) {
        super(props);
        this.authRef = React.createRef();
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time),
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate,
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }

    onRow = (role) => {
        return {
            onClick: event => { // 点击行
                this.setState({
                    role,
                })
            },
        };
    }

    // 添加角色
    addRole = async () => {
        // 表单验证
        const values = await this.form.validateFields();
        // 隐藏确认框
        this.setState({
            isShowAdd: false,
        });
        // 收集输入数据
        const { roleName } = values;
        //清除数据
        this.form.resetFields();
        // 请求添加
        const result = await reqAddRole(roleName);
        if (result.status === 0) {
            message.success('添加角色成功');
            //新产生的角色
            const role = result.data;
            // 更新role状态
            this.setState(state => ({
                roles: [...state.roles, role],
            }));
        } else {
            message.error('添加角色失败');
        }
    }

    // 更新角色
    updateRole = async () => {
        // 隐藏确认框
        this.setState({
            isShowAuth: false,
        });

        const { role } = this.state;
        // 获取新的menu值
        const menus = this.authRef.current.getMenus();
        role.menus = menus;
        role.auth_name = this.props.user.username;
        role.auth_time = Date.now();
        // 发送更新请求
        const result = await reqUpdateRole(role);
        if (result.status === 0) {
            // 如果当前更新的是自己角色的权限，需要强制退出
            if (role._id === this.props.user.role_id) {
                this.props.logout();
                message.info('当前用户角色权限修改，请重新登陆');
            } else {
                message.success('更新角色权限成功');
                this.setState({
                    roles: [...this.state.roles],
                });
            }
        } else {
            message.error('更新角色权限失败');
        }

    }

    getRoles = async () => {
        const result = await reqRoles();
        if (result.status === 0) {
            const roles = result.data;
            this.setState({
                roles,
            });
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getRoles();
    }

    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state;
        const title = (
            <span>
                <Button
                    type="primary"
                    onClick={() => this.setState({ isShowAdd: true })}
                >
                    创建角色
                </Button>  &nbsp;&nbsp;
                <Button
                    type="primary"
                    disabled={!role._id}
                    onClick={() => this.setState({ isShowAuth: true })}
                >
                    设置角色权限
                </Button>
            </span>
        );

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => this.setState({ role }),    // 选择某个radio的回调
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({
                            isShowAdd: false
                        });
                        this.form.resetFields();
                    }}
                >
                    <AddForm setForm={form => this.form = form} />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false,
                        });
                    }}
                >
                    <AuthForm
                        role={role}
                        ref={this.authRef}
                    />
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { logout }
)(Role);
