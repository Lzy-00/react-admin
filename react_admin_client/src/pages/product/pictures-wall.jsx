import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api';
import { PropTypes } from 'prop-types';
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
/*
用于图片上传
*/
export default class PicturesWall extends React.Component {
    static propTypes = {
        imgs: PropTypes.array,
    }

    // state = {
    //     previewVisible: false,   //标识是否显示大图预览Modal
    //     previewImage: '',   // 大图地址url
    //     previewTitle: '',   // 大图的标题
    //     fileList: [
    //         // {
    //         //     uid: '-1',   //每个file都有唯一的id
    //         //     name: 'image.png',  //图片文件名
    //         //     status: 'done',  // 图片状态：done：已完成；uploading：上传中；error：上传失败；removed：已删除
    //         //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',   //图片地址
    //         // }
    //     ],
    // };

    constructor(props) {
        super(props);
        let fileList = [];
        // 如果传入imgs属性
        const { imgs } = props;
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((item, index) => {
                return {
                    uid: -index,
                    name: item,
                    status: 'done',
                    url: BASE_IMG_URL + item,
                }
            })
        }
        
        this.state = {
            previewVisible: false,   //标识是否显示大图预览Modal
            previewImage: '',   // 大图地址url
            previewTitle: '',   // 大图的标题
            fileList,
        }
    }

    //获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(item => item.name);
    }

    // 隐藏Modal
    handleCancel = () => this.setState({ previewVisible: false });


    handlePreview = async file => {
        if (!file.url && !file.preview) {     //未上传成功，也会对图片进行显示
            file.preview = await getBase64(file.originFileObj);
        }

        // 显示指定file的大图
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = async ({ file, fileList }) => {   //file：当前操作的图片文件（上传/删除）；fileList:所有已上传图片的文件数组
        // 一旦上传成功，将当前上传的file的信息修正
        if (file.status === 'done') {
            const result = file.response;   // {status:0,data{name:'xxx', url:'图片地址'}}
            if (result.status === 0) {
                message.success('上传图片成功');
                const { name, url } = result.data;
                //file与fileList[fileList.length - 1]内容相同，但不是同一个对象
                fileList[fileList.length - 1].name = name;
                fileList[fileList.length - 1].url = url;
            } else {
                message.error('上传图片失败');
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name);
            if (result.status === 0) {
                message.success('删除图片成功');
            } else {
                message.error('删除图片失败');
            }
        }
        // 在操作（上传/删除）过程中，更新fileList的状态
        this.setState({ fileList });
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload"   // 上传图片的接口地址
                    accept="image/*"   // 只接受图片类型
                    listType="picture-card" // 卡片样式
                    name='image'  //请求参数名
                    fileList={fileList}  //用于指定所有已上传图片文件对象数组
                    onPreview={this.handlePreview}   // 预览大图时调用
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}

