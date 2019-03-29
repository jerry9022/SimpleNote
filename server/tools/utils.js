/**
 * Created by jerry on 2018/3/27.
 */
var crypto = require('crypto');

var utils = {};


/**
 * MD5签名
 */
utils.md5 = function (str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};

module.exports = utils;
