import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import './index.less';
import { reqWeather } from '../../api';
import { formateDate } from '../../utils/dateUtils';
import LinkButton from '../link-button';
import { logout } from '../../redux/actions';

const { confirm } = Modal;

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()), //当前时间字符串
        weather: '',  //天气的文本
    }

    getWeather = async () => {
        const result = await reqWeather('420100');
        if (result.status === '1') {
            this.setState({
                weather: result.lives[0].weather
            })
        } else {
            message.error('获取天气信息失败！');
        }
    }

    getTime = () => {
        this.timer = setInterval(() => {
            const currentTime = formateDate(Date.now());
            this.setState({
                currentTime,
            });
        }, 1000);
    }

    logout = () => {
        confirm({
            title: '确定退出吗？',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                this.props.logout();
            }
        });
    }

    // 第一次render()之后执行一次
    // 一般在此执行异步操作：发ajax请求/启动定时器
    componentDidMount() {
        this.getTime();
        this.getWeather();
    }

    //在当前组件卸载前调用
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { weather, currentTime } = this.state;
        const username = this.props.user.username;
        const title = this.props.headTitle;
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span className="header-bottom-right-time">{currentTime}</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        headTitle: state.headTitle,
        user: state.user,
    }),
    { logout }
)(withRouter(Header));
