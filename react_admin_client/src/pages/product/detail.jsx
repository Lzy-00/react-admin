import React, { Component } from 'react';
import { Card, List } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import LinkButton from '../../components/link-button';
import { BASE_IMG_URL } from '../../utils/constants';
import { reqCategory, reqCategorys } from '../../api';
import { removeProduct } from '../../redux/actions';
/*
Product的详情子路由组件
*/
const { Item } = List;
class ProductDetail extends Component {
    state = {
        cName1: '',  // 一级分类名称
        cName2: '',  //二级分类名称
    }

    async componentDidMount() {
        // 得到当前商品的分类Id
        const { pCategoryId, categoryId } = this.props.product;
        if (pCategoryId === '0') {  //一级分类下的商品
            const result = await reqCategorys(categoryId);
            const cName1 = result.data.name;
            this.setState({
                cName1,
            });
        } else { //二级分类下的商品
            // 通过多个await方式发送多个请求：后面的请求是在前一个请求成功返回之后才发送
            // const result1 = await reqCategory(pCategoryId);
            // const result2 = await reqCategory(categoryId);
            // const cName1 = result1.data.name;
            // const cName2 = result2.data.name;

            // 一次性发送多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
            const cName1 = results[0].data.name;
            const cName2 = results[1].data.name;
            this.setState({
                cName1,
                cName2,
            });
        }
    }

    // 卸载前清除数据
    componentWillUnmount() {
        this.props.removeProduct();
    }
    render() {
        // 读取携带过来的state数据
        const { name, price, desc, detail, imgs } = this.props.product;
        const { cName1, cName2 } = this.state;
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ marginRight: 15, fontSize: 20 }} />
                </LinkButton>
                <span>商品详情</span>
            </span >
        );
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <div>
                            <span className="left">商品名称：</span>
                            <span>{name}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品描述：</span>
                            <span>{desc}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品价格：</span>
                            <span>{price}元</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">所属分类：</span>
                            <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品图片：</span>
                            {
                                imgs.map(img => {
                                    return (
                                        <img
                                            key={img}
                                            className="product-img"
                                            src={BASE_IMG_URL + img}
                                            alt="img"
                                        />
                                    )
                                })
                            }
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品详情：</span>
                            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                        </div>
                    </Item>
                </List>
            </Card>
        )
    }
}

export default connect(
    state => ({ product: state.product }),
    { removeProduct }
)(ProductDetail);
