import React, { Component } from 'react';
import { Card, Table, Button, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button';
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api';
import AddForm from './add-form';
import UpdateForm from './update-form';
/*
商品分类路由
*/

export default class Category extends Component {
    state = {
        loading: false,  //是否正在获取数据
        categorys: [],  //一级分类列表
        subCategorys: [], //二级分类列表
        parentId: '0',  //当前需要显示的分类列表的父分类Id
        parentName: '',  //当前需要显示的分类列表的父分类名称
        showState: 0,  //标识添加/确认的确认框是否显示；0：均不显示 ；1：添加显示；2：确认显示
    }

    // 初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',  //指定对应数据的属性名
                key: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (   //指定返回需要显示的界面
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {
                            this.state.parentId === '0' ?
                                (<LinkButton onClick={this.showSubCategorys(category)}>查看子分类</LinkButton>) : null
                        }
                    </span>
                ),
            }
        ];
    }

    //异步获取分类列表
    // parentId：如果没有指定，根据状态中的parentId请求；如果指定了，根据指定的请求；
    getCategorys = async (parentId) => {
        // 在发请求前，显示loading
        this.setState({
            loading: true
        });
        parentId = parentId || this.state.parentId;
        const result = await reqCategorys(parentId);
        //请求完成后，隐藏loading
        this.setState({
            loading: false
        });
        if (result.status === 0) {
            // 取出分类数组（可能是一级也可能是二级）
            const categorys = result.data;
            if (parentId === '0') {   //更新一级分类状态
                this.setState({
                    categorys,
                });
            } else {   //更新二级分类状态
                this.setState({
                    subCategorys: categorys
                });
            }
        } else {
            message.error('获取分类列表失败！')
        }
    }

    // 显示指定一级分类对象的二级列表
    showSubCategorys = (category) => {
        return () => {
            const { _id, name } = category;
            this.setState({    //setState为异步更新状态过程
                parentId: _id,
                parentName: name,
            }, () => {    //在状态更新且重新render()后执行
                // console.log('parentId', this.state.parentId);
                // 获取二级分类列表
                this.getCategorys();
            });
            // setState()不能立即获取最新的状态：因为setState()是异步更新状态的
            // console.log('parentId', this.state.parentId);
        }
    }

    // 显示指定一级分类列表
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        });
    }

    //添加分类
    addCategory = async () => {
        const values = await this.form.validateFields();
        // 隐藏确定框
        this.setState({
            showState: 0
        });

        // 数据准备
        const { parentId, categoryName } = values
        // 清除输入数据
        this.form.resetFields();
        // 发送请求
        const result = await reqAddCategory(parentId, categoryName);
        if (result.status === 0) {
            // 添加的分类就是当前分类列表下的分类
            if (this.state.parentId === parentId) {
                //重新获取列表
                this.getCategorys();
            } else if (parentId === '0') {  // 在二级分类列表下添加一级分类，重新获取一级分类列表但不需要显示
                this.getCategorys('0');
            }

            message.success('添加成功');
        } else {
            message.error('添加失败')
        }
    }

    //更新分类
    updateCategory = async () => {
        //进行表单验证，只有通过了，才处理
        const values = await this.form.validateFields();
        // 隐藏确定框
        this.setState({
            showState: 0
        });

        //数据准备
        const categoryId = this.category._id;
        const categoryName = values.categoryName;
        // 清除输入数据
        this.form.resetFields();
        //发送请求
        const result = await reqUpdateCategory(categoryId, categoryName);
        if (result.status === 0) {
            //重新显示列表
            this.getCategorys();
            message.success('修改成功');
        } else {
            message.error('修改失败')
        }
    }

    // 响应点击取消：隐藏确认框
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields();
        // 隐藏确认框
        this.setState({ showState: 0 });
    }

    // 显示添加确认框
    showAdd = () => {
        this.setState({ showState: 1 });
    }

    // 显示更新确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category;
        this.setState({
            showState: 2,
        });
    }

    //为第一次render()准备数据
    UNSAFE_componentWillMount() {
        this.initColumns();
    }

    // 执行异步任务
    componentDidMount() {
        //获取一级分类列表
        this.getCategorys();
    }

    render() {
        // 读取状态数据
        const { categorys, loading, parentId, subCategorys, parentName, showState } = this.state;
        //card 的左侧标题
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ margin: "0 10px" }} />
                <span>{parentName}</span>
            </span>
        );
        //card 的右侧
        const extra = (
            <Button type='primary' icon={<PlusOutlined />} onClick={this.showAdd}>
                添加
            </Button>
        );

        return (
            <Card title={title} extra={extra} style={{ width: '100%' }}>
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    bordered
                    rowKey="_id"
                    pagination={{ pageSize: 5, showQuickJumper: true }}
                    loading={loading}
                />
                <Modal title="添加分类" visible={showState === 1} onOk={this.addCategory} onCancel={this.handleCancel}>
                    <AddForm categorys={categorys} setForm={form => this.form = form} />
                </Modal>
                <Modal title="修改分类" visible={showState === 2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <UpdateForm setForm={form => this.form = form} />
                </Modal>
            </Card>
        )
    }
}
