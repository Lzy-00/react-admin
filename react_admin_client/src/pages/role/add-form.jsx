import React from 'react'
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
/*
添加角色的form组件
*/

const { Item } = Form;
export default function AddForm(props) {
    const { setForm } = props;

    const [form] = Form.useForm();
    React.useEffect(() => {
        setForm(form);
    }, []);

    return (
        <Form form={form}>
            <Item
                name="roleName"
                rules={[
                    {
                        required: true,
                        whitespace: true,
                        message: '角色名称必须输入！',
                    }
                ]}
                label="角色名称">
                <Input placeholder="请输入角色名称"></Input>
            </Item>
        </Form>
    )
}

AddForm.propType = {
    setForm: PropTypes.func.isRequired,  //用来传递form对象的函数
}
