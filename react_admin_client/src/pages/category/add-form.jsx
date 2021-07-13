import React from 'react'
import { Form, Select, Input } from 'antd';
import PropTypes from 'prop-types';
/*
添加分类的form组件
*/

const { Item } = Form;
const { Option } = Select;
export default function AddForm(props) {
    const { categorys, setForm } = props;

    const [form] = Form.useForm();
    React.useEffect(() => {
        setForm(form);
    }, []);

    return (
        <Form form={form}>
            <Item
                name="parentId"
                label="所属分类"
                rules={[
                    {
                        required: true,
                        message: '用户名必须输入！',
                    }
                ]}
            >
                <Select>
                    <Option value='0'>一级分类</Option>
                    {
                        categorys.map(item => {
                            return (
                                <Option value={item._id} key={item._id}>{item.name}</Option>
                            );
                        })
                    }
                </Select>
            </Item>
            <Item
                name="categoryName"
                rules={[
                    {
                        required: true,
                        whitespace: true,
                        message: '用户名必须输入！',
                    }
                ]}
                label="分类名称">
                <Input placeholder="请输入分类名称"></Input>
            </Item>
        </Form>
    )
}

AddForm.propType = {
    setForm: PropTypes.func.isRequired,  //用来传递form对象的函数
    categorys: PropTypes.array.isRequired,  //一级分类的数组
}

