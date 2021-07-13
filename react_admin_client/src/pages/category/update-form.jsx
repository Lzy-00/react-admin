import React from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
/*
更新分类组件
*/

const { Item } = Form;
export default function UpdateForm(props) {
    const { /*categoryName,*/ setForm } = props;
    const [form] = Form.useForm();

    React.useEffect(() => {
        //将form对象通过setForm传递给父组件
        setForm(form);
    }, []);

    return (
        <Form form={form}>
            <Item
                name="categoryName"
                label="分类名称"
                // initialValue={state.categoryName}
                rules={[
                    {
                        required: true,
                        message: '分类名称必须输入',
                    }
                ]}
            >
                <Input placeholder="请输入分类名称"></Input>
            </Item>
        </Form>
    )
}

UpdateForm.propTypes = {
    setForm: PropTypes.func.isRequired
}
