import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import * as Icon from '@ant-design/icons';
import { connect } from 'react-redux';

import './index.less';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';
import { setHeadTitle } from '../../redux/actions';
/*
左侧导航组件
*/

const { SubMenu } = Menu;

class LeftNav extends Component {
    //根据menuList的数据数组生成对应的标签数组
    // reduce +递归
    getMenuNodes = (menuList) => {
        //得到当前请求的路由路径
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            // 如果当前用户有item对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                if (!item.children) {
                    // 判断item是否是当前对应的item
                    if (item.key === path || path.indexOf(item.key) === 0) {
                        this.props.setHeadTitle(item.title);
                    }
                    pre.push((
                        <Menu.Item key={item.key} icon={React.createElement(Icon[item.icon])}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>{item.title}</Link>
                        </Menu.Item>
                    ));
                } else {
                    //查找一个与当前请求路径匹配的子路由
                    const cItem = item.children.find(item => path.indexOf(item.key) === 0);
                    //如果存在，说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key;
                    }
                    pre.push((
                        <SubMenu key={item.key} icon={React.createElement(Icon[item.icon])} title={item.title}>
                            {
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    ));
                }
            }
            return pre;
        }, []);
    }

    // 判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const { key, isPublic } = item;
        const { menus } = this.props.user.role;
        const { username } = this.props.user;
        // 1、如果当前用户是admin
        // 2、如果当前item是公开的
        // 3、当前用户有此item的权限： key有没有在menus中
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true;
        } else if (item.children) {   // 如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1);
        }
        return false;
    }

    //第一次render()之前执行一次
    // 为第一个render()准备数据（必须同步的）
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList);
    }

    render() {
        //得到当前请求的路由路径
        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) {  // 当前请求的是商品或其子路由界面
            path = '/product';
        }
        // 得到需要打开的菜单项的key
        const openKey = this.openKey;
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"></img>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { setHeadTitle }
)(withRouter(LeftNav));
