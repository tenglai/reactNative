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
    base: 'http://rap.taobao.org/mockjs/14179/',
    creations: 'api/creation', // 视频列表
    comment: 'api/comments',
    up: 'api/up', // 点赞操作
    video: 'api/creations/video',
    signup: 'api/u/signup',
    verify: 'api/u/verify',
    update: 'api/u/update',
    signature: 'api/signature'
  }
};