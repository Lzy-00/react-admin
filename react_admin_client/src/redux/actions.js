/*
包含n个action creator函数的模块
同步action：对象{type: 'xxx', data: 数据值}
异步action: 函数(dispatch) => {}
*/
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_PRODUCT,
    REMOVE_PRODUCT
} from './action-types';
import {
    reqLogin
} from '../api';
import storageUtils from '../utils/storageUtils';
import {
    message
} from 'antd';

// 设置头部标题的同步action
export const setHeadTitle = (headTitle) => {
    return {
        type: SET_HEAD_TITLE,
        data: headTitle,
    }
}

// 接收用户信息的同步action
export const receiveUser = (user) => {
    return {
        type: RECEIVE_USER,
        data: user,
    }
}

// 退出登录的同步action
export const logout = () => {
    // 删除localStorage中的user
    storageUtils.removeUser();
    return {
        type: RESET_USER
    }
}

// 登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        // 1、执行异步ajax请求
        const result = await reqLogin(username, password);
        if (result.status === 0) {
            // 2.1 如果成功，分发成功的同步action
            const user = result.data;
            // 保存到localStorage中
            storageUtils.saveUser(user);
            // 分发接受用户的同步action
            dispatch(receiveUser(user));
        } else {
            // 2.1 如果失败，分发失败的同步action
            const msg = result.msg;
            message.error(msg);
        }
    }
}

// 存储product的同步action
export const receiveProduct = (product) => {
    return {
        type: RECEIVE_PRODUCT,
        data: product,
    }
}

// 清除product的同步action
export const removeProduct = () => {
    return {
        type: REMOVE_PRODUCT,
        data: {},
    }
}