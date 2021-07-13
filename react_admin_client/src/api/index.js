/*
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求：能根据接口文档定义接口请求函数
*/
import ajax from './ajax';

// const BASE = 'http://localhost:5000';
const BASE = '';
//登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {
    username,
    password
}, 'POST');

//获取天气信息
export const reqWeather = (cityCode) => ajax(`https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=51c06df738a0147a0f5a72a509db22e0`);

// reqWeather('420100').then(response => {
//     console.log('weather', response);
// }).catch(error => {
//     console.log('weather出错了', error);
// })

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {
    parentId,
});

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/Info', {
    categoryId,
});

//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {
    categoryName,
    parentId,
}, 'POST');

//更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {
    categoryId,
    categoryName,
}, 'POST');

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {
    pageNum,
    pageSize,
});

// 搜索商品分页列表（用searchType判断是根据商品名称还是商品描述进行搜索，productName/productDesc）
export const reqSearchProducts = (searchName, searchType, pageNum, pageSize) => ajax(BASE + '/manage/product/search', {
    [searchType]: searchName,
    pageNum,
    pageSize,
});

// 更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {
    productId,
    status,
}, 'POST');

// 删除上传的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {
    name,
}, 'POST');

//添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST');

// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list');

//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {
    roleName,
}, 'POST');

// 更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST');

// 获取用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list');

// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {
    userId,
}, 'POST');

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST');