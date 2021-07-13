/*
用来根据老的state和指定的action返回新的state的函数
*/
import {
    combineReducers
} from 'redux';
import storageUtils from '../utils/storageUtils';
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_PRODUCT,
    REMOVE_PRODUCT
} from './action-types';

// 用来管理头部标题的reducer
const initHeadTitle = '';
const headTitle = (state = initHeadTitle, action) => {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data;
        default:
            return state;
    }
}

// 用来管理当前用户的reducer
const initUser = storageUtils.getUser();
const user = (state = initUser, action) => {
    switch (action.type) {
        case RECEIVE_USER:
            return action.data;
        case RESET_USER:
            return {};
        default:
            return state;
    }
}

//// 用来点击产品的reducer
const product = (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_PRODUCT:
            return action.data;
        case REMOVE_PRODUCT:
            return {};
        default:
            return state;
    }
}

// 向外默认暴露的是合并产生的总的reducer函数
// 管理的总的state的结构是：
// {
//     headTitle,
//     user,
// }
export default combineReducers({
    headTitle,
    user,
    product,
});