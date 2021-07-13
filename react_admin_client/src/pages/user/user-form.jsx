import React from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

/* 
添加/修改用户的组件
*/
const { Item } = Form;
const { Option } = Select;
export default function UserForm(props) {
    const { setForm, roles } = props;
    const user = props.user || {};
    const [form] = Form.useForm();
    setForm(form);
    const formItemLayout = {
        labelCol: { span: 4 },  //左侧label的宽度
        wrapperCol: { span: 15 },  // 右侧包裹的宽度
    }
    return (
        <Form form={form} {...formItemLayout}>
            <Item
                name="username"
                label="用户名："
                rules={[
                    {
                        required: true,
                        message: '用户名不能为空'
                    }
                ]}
            >
                <Input placeholder="请输入用户名" />
            </Item>
            {
                user._id ? null : (
                    <Item
                        name="password"
                        label="密码："
                        rules={[
                            {
                                required: true,
                                message: '密码不能为空'
                            }
                        ]}
                    >
                        <Input type='password' placeholder="请输入密码" />
                    </Item>
                )
            }
            <Item
                name="phone"
                label="手机号："
                rules={[
                    {
                        required: true,
                        message: '手机号不能为空'
                    }
                ]}
            >
                <Input placeholder="请输入手机号" />
            </Item>
            <Item
                name="email"
                label="邮箱："
                rules={[
                    {
                        required: true,
                        message: '邮箱不能为空'
                    }
                ]}
            >
                <Input placeholder="请输入用户名" />
            </Item>
            <Item
                name="role_id"
                label="角色："
                rules={[
                    {
                        required: true,
                        message: '角色不能为空'
                    }
                ]}
            >
                <Select placeholder="请选择角色">
                    {
                        roles.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)
                    }
                </Select>
            </Item>
        </Form>
    )
}

UserForm.propType = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
}
