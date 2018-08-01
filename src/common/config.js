'use strict';

module.exports = {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  },
  cloudinary: {
    cloud_name: 'digvexgsl',
    api_key: '675977649267356',
    base: 'http://res.cloudinary.com/digvexgsl',
    image: 'https://api.cloudinary.com/v1_1/digvexgsl/image/upload',
    video: 'https://api.cloudinary.com/v1_1/digvexgsl/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/digvexgsl/raw/upload'
  },
  // 请求接口地址
  api: {
    base: 'http://rap.taobao.org/mockjs/14179/', // 根路径
    creations: 'api/creation', // 视频列表
    comment: 'api/comments', // 评论列表
    up: 'api/up', // 点赞操作
    video: 'api/creations/video', // 视频
    signup: 'api/u/signup', // 签名接口
    verify: 'api/u/verify', // 验证码
    update: 'api/u/update', // 上传头像
    signature: 'api/signature' // 签名
  }
};