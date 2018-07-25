// 拼接参数
import queryString from 'query-string';
// 拿到的数据转成本地的package.json里(伪造数据)
import Mock from 'mockjs';
// Lodash 提供辅助函数  (http://lodashjs.com/docs/)
import _ from 'lodash';
import config from './config';


// 对外暴露空对象
let request = {};


request.get = function (url, params) {
  if (params) {
    // querystring.stringify(obj[, sep[, eq[, options]]])
    // 对象格式化成参数字符串(object -> string)
    // (http://yijiebuyi.com/blog/d37512fc6df0fc4d0adfc2ec5c3d46ff.html)
    // example:
    // queryString.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
    // returns 'foo=bar&baz=qux&baz=quux&corge='

    // queryString.parse(str[, sep[, eq[, options]]])#
    // For example, the query string 'foo=bar&abc=xyz&abc=123' is parsed into:
    // {
    //   foo: 'bar',
    //      abc: ['xyz', '123']
    // }
    url += '?' + queryString.stringify(params);
  }

  // copy react-native official
  return fetch(url)
    .then((response) => response.json())
    .then((response) => Mock.mock(response));
};


request.post = function (url, body) {
  // post需要头部信息 (body表单)
  // (extend)替换config.header
  // prototype 属性使您有能力向对象添加属性和方法
  let options = _.extend(config.header, {
    // parse用于从一个字符串中解析出json对象(string -> object)
    // stringify对象格式化成参数字符串(object -> string)
    body: JSON.stringify(body)
  });

  return fetch(url, options)
    .then((response) => response.json())
    .then((response) => Mock.mock(response));
};


module.exports = request;