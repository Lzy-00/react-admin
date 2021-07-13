import React, { Component } from 'react';
import { Card, Select, Input, Button, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import LinkButton from '../../components/link-button';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constants';
import { receiveProduct } from '../../redux/actions';

/*
Product的默认子路由组件
*/
const { Option } = Select;
class ProductHome extends Component {
    state = {
        products: [], //商品数组
        total: 0,  // 商品总数
        loading: false, //是否正在加载中
        searchName: '', // 搜索关键字
        searchType: 'productName', //搜索类型
    }

    // 初始化table的列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price,   //当前dateIndex指定了对应的属性，传入的是对应的属性值
            },
            {
                title: '状态',
                width: 100,
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button >
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    );
                },
            },
            {
                title: '操作',
                width: 100,
                render: (product) => (
                    <span>
                        {/* 将product对象使用state传递给目标路由组件 */}
                        <LinkButton onClick={() => this.showDetail(product)}>详情</LinkButton>
                        <LinkButton onClick={() => this.showAddUpdate(product)}>修改</LinkButton>
                    </span>
                ),
            },

        ];
    }

    // 显示详情界面
    showDetail = (product) => {
        this.props.receiveProduct(product);
        this.props.history.push('./product/detail');
    }

    // 显示添加/修改商品界面
    showAddUpdate = (product) => {
        this.props.receiveProduct(product);
        this.props.history.push('./product/addupdate');
    }

    // 获取指定页码的列表数据
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;  // 保存当前的pageNum
        this.setState({ loading: true });   // 显示loading
        const { searchName, searchType } = this.state;
        let result;

        if (searchName) {    //如果搜索关键字有值，说明进行搜索分页
            result = await reqSearchProducts(searchName, searchType, pageNum, PAGE_SIZE);
        } else {   // 一般分页
            result = await reqProducts(pageNum, PAGE_SIZE);
        }
        this.setState({ loading: false });   // 隐藏loading
        if (result.status === 0) {
            const { total, list } = result.data;
            this.setState({
                products: list,
                total,
            });
        }
    }

    // 更新指定商品的状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status);
        if (result.status === 0) {
            message.success('更新商品成功');
            this.getProducts(this.pageNum);
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns();
    }

    componentDidMount() {
        this.getProducts(1);
    }
    render() {
        // 取出状态数据
        const { products, total, loading, searchName, searchType } = this.state;
        // Card 的左侧
        const title = (
            <span>
                <Select
                    onChange={value => { this.setState({ searchType: value }) }}
                    value={searchType}
                    style={{ width: 150 }}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 10px' }}
                    value={searchName}
                    onChange={e => this.setState({ searchName: e.target.value })} />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        );
        // Card 的右侧
        const extra = (
            <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => this.props.history.push('/product/addupdate')}
            >
                添加商品
            </Button>
        );



        return (
            <Card title={title} extra={extra}>
                <Table
                    rowKey='_id'
                    bordered
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        onChange: this.getProducts,
                    }}
                    loading={loading}
                />
            </Card>
        )
    }
}

export default connect(
    state => ({}),
    { receiveProduct }
)(ProductHome);
