import React, { Component } from 'react';
import { Card, Form, Input, Cascader, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import LinkButton from '../../components/link-button';
import { reqCategorys, reqAddOrUpdateProduct } from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';
import { removeProduct } from '../../redux/actions';
/*
Product的添加和更新的子路由组件
*/

const { Item } = Form;
const { TextArea } = Input;

class ProductAddUpdate extends Component {
    state = {
        options: [],
    }

    constructor() {
        super();
        // 创建用来保存ref标识的标签对象的容器
        this.pictureRef = React.createRef();
        this.textRef = React.createRef();
    }

    onFinish = async (values) => {
        // 1、收集数据，并封装成product对象
        const imgs = this.pictureRef.current.getImgs();
        const detail = this.textRef.current.getDetail();
        const { name, price, desc, categoryIds } = values;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
            pCategoryId = '0';
            categoryId = categoryIds[0];
        } else {
            pCategoryId = categoryIds[0];
            categoryId = categoryIds[1];
        }
        let product = { name, price, desc, detail, imgs, categoryId, pCategoryId };
        // 如果是更新需要添加_id
        if (this.isUpdate) {
            product._id = this.product._id;
        }

        // 2、调用接口请求函数，添加/更新
        const result = await reqAddOrUpdateProduct(product);
        if (result.status === 0) {
            message.success(`${product._id ? '更新' : '添加'}商品成功`);
            this.props.history.goBack();
        } else {
            message.error(`${product._id ? '更新' : '添加'}商品失败`);
        }
        // 3、结果提示

    }

    // 验证价格的函数
    validatePrice = (_, value) => {
        if (value * 1 > 0) {
            return Promise.resolve();
        } else {
            return Promise.reject('价格必须大于0')
        }
    }

    // 用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        //得到选择的options对象
        const targetOption = selectedOptions[0];
        // 显示loading效果
        targetOption.loading = true;

        //根据选择的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value);
        targetOption.loading = false;

        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childrenOptions = subCategorys.map(item => {
                return {
                    value: item._id,
                    label: item.name,
                    isLeaf: true,
                }
            });
            // 关联到当前options上
            targetOption.children = childrenOptions;
        } else {  //当前选中的分类没有二级分类
            targetOption.isLeaf = true;
        }


        //更新options对象
        this.setState({
            options: [...this.state.options]
        })
    };

    //获取一级/二级分类列表
    // async 函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId);
        if (result.status === 0) {
            const categorys = result.data;
            // 如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys);
            } else {   // 二级列表
                return categorys;  //返回二级列表 ==> 当前async函数返回的promise就会成功且value为categorys
            }
        }
    }

    initOptions = async (categorys) => {
        // 根据categorys生成optins数组
        const options = categorys.map(item => {
            return {
                value: item._id,
                label: item.name,
                isLeaf: false,
            }
        });

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this;
        const { pCategoryId } = product;
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId);
            // 生成二级下拉列表的options
            const childrenOptions = subCategorys.map(item => {
                return {
                    value: item._id,
                    label: item.name,
                    isLeaf: true,
                }
            });
            // 找到当前商品对应的列表
            const targetOption = options.find(item => item.value === pCategoryId);
            // 关联对应的一级option上
            targetOption.children = childrenOptions;
        }
        // 更新options状态
        this.setState({
            options,
        })
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    UNSAFE_componentWillMount() {
        // 取出携带的state数据
        const product = this.props.product;
        // 保存是否更新的标识
        this.isUpdate = !!product._id;  //!!强制转换boolean类型
        this.product = product || {};
    }

    // 卸载之前清除保存的数据
    componentWillUnmount() {
        this.props.removeProduct();
    }
    render() {
        const { isUpdate, product } = this;
        const { name, desc, price, pCategoryId, categoryId, imgs, detail } = product;
        //用于接收级联分类ID的数组
        let categoryIds = [];
        if (isUpdate) {
            if (pCategoryId === '0') {   // 商品是一个一级分类下的商品
                categoryIds.push(categoryId);
            } else {   // 商品是一个一级分类下的商品
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>{isUpdate ? '更新商品' : '添加商品'}</span>
            </span>
        );

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  //左侧label宽度
            wrapperCol: { span: 16 },  //右侧包裹的宽度
        }
        return (
            <Card title={title} >
                <Form
                    {...formItemLayout}
                    onFinish={this.onFinish}
                >
                    <Item
                        name="name"
                        label="商品名称："
                        initialValue={name}
                        rules={[
                            {
                                required: true,
                                message: '商品名称不能为空'
                            }
                        ]}
                    >
                        <Input placeholder="请输入商品名称" />
                    </Item>
                    <Item
                        name="desc"
                        label="商品描述："
                        initialValue={desc}
                        rules={[
                            {
                                required: true,
                                message: '商品描述不能为空'
                            }
                        ]}
                    >
                        <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} allowClear />
                    </Item>
                    <Item
                        name="price"
                        label="商品价格："
                        initialValue={price}
                        rules={[
                            {
                                required: true,
                                message: '商品价格不能为空'
                            },
                            {
                                validator: this.validatePrice,
                            }
                        ]}
                    >
                        <Input type="number" placeholder="请输入商品价格" addonAfter="元" min="0" />
                    </Item>
                    <Item
                        name="categoryIds"
                        label="商品分类："
                        initialValue={categoryIds}
                        rules={[
                            {
                                required: true,
                                message: '商品分类不能为空'
                            }
                        ]}
                    >
                        <Cascader
                            options={this.state.options}  //需要显示的列表数据
                            loadData={this.loadData}  // 当选择某个列表项，加载下一级列表监听
                        />
                    </Item>
                    <Item label="商品图片：">
                        <PicturesWall ref={this.pictureRef} imgs={imgs} />
                    </Item>
                    <Item label="商品详情：">
                        <RichTextEditor ref={this.textRef} detail={detail} />
                    </Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form>
            </Card >
        )
    }
}

export default connect(
    state => ({ product: state.product }),
    { removeProduct }
)(ProductAddUpdate);