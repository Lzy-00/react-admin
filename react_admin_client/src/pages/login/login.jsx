import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './login.less';
import logo from '../../assets/images/logo.png';
import { login } from '../../redux/actions';
/*
登录路由组件
*/

const { Item } = Form;

class Login extends Component {
    onFinish = async (values) => {
        // 调用分发异步action的函数 => 发登录的异步请求，有了结果后更新状态
        this.props.login(values.username, values.password);
    }

    onFinishFailed = (error) => {
        message.error('用户名或密码错误', error);
    }

    pwValidate = (_, value) => {
        if (!value) {
            return Promise.reject('密码必须输入！');
        } else if (value.length < 4) {
            return Promise.reject('密码的长度不能小于4！');
        } else if (value.length > 12) {
            return Promise.reject('密码的长度不能大于12！');
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject('密码必须是英文、数字或者下划线！');
        } else {
            return Promise.resolve();   //验证通过
        }
    }

    render() {
        //如果用户已经登陆，自动跳转到管理页面
        const user = this.props.user;
        if (user && user._id) {
            return <Redirect to='/home' />;
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"></img>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        initialValues={{
                            username: 'admin',
                        }}
                    >
                        <Item
                            name="username"
                            //声明式验证
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '用户名必须输入！',
                                },
                                {
                                    min: 4,
                                    message: '用户名至少4位！',
                                },
                                {
                                    max: 12,
                                    message: '用户名最多12位！',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '用户名必须是英文、数字或者下划线！',
                                }
                            ]}

                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,0.25)' }} />}
                                placeholder="用户名"
                            />
                        </Item>
                        <Item
                            name="password"
                            //自定义式校验
                            rules={[
                                {
                                    validator: this.pwValidate,
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,0.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { login }
)(Login);

/*
1、前台表单验证
2、收集表单输入数据
*/