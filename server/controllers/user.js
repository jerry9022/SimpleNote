/**
 * users 控制器
 *
 * Created by jerry on 2017/11/2.
 */
const config = require('../config.js');
const sqlite = require("sqlite");
const dbPromise = sqlite.open(config.dbPath, {Promise});
const utils = require("../tools/utils");
let userController = {};

userController.findList = async function (req, res) {
  try {
    const db = await dbPromise;
    var user = await db.all("SELECT * FROM user");
    console.log(user);
    res.json('---');
  } catch (ex) {
    console.log(ex)
    res.json('ex');
  }
}

/**
 * 检查用户的登录状态
 * @param req
 * @param res
 * @param next
 */
userController.checkLogin = function (req, res, next) {
  //用户已经登录
  if (req.session.userId) {
    next();
  }
  else {
    res.json({"errcode": 40001, "errmsg": "您还没有登录"});
  }
};

/**
 * 登录
 * @param req
 * @param res
 */
userController.login = async function (req, res) {
  let username = _.trim(req.query.username || req.body.username || '');
  let passwd = req.body.passwd;

  if (!username || !passwd) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }

  try {
    const db = await dbPromise;
    let user = await db.get('SELECT * FROM user WHERE username = ?', username);
    if (!user) {
      return res.json({"errcode": 40003, "errmsg": "用户不存在"});
    }
    let crpasswd = utils.md5(user.salt + passwd);
    if (user.passwd === crpasswd) {
      //设置session
      req.session.userId = user.id;

      return res.json({
        id: user.id,
        nickname: user.nickname,
        username: user.username,
        email: user.email
      });
    } else {
      return res.json({"errcode": 40004, "errmsg": "密码错误"});
    }
  } catch (ex) {
    console.log(ex)
    return res.json({"errcode": 50000, "errmsg": "系统错误"});
  }
};

/**
 * 退出登录
 * @param req
 * @param res
 */
userController.logout = function (req, res) {
  req.session.destroy();
  res.json({"errcode": 0, "errmsg": "退出完成"});
};

/**
 * 修改个人部分信息
 * @param req
 * @param res
 */
userController.profile = function (req, res) {
  // let nickname = req.body.nickname;
  // let email = req.body.email;
  // let name  = req.body.name;
  // let i = _.findIndex(_Users, function (u) {
  //   return u.id === req.session.userId
  // })
  // if (i > -1) {
  //   _Users[i].nickname = nickname;
  //   _Users[i].email = email;
  //   _Users[i].name = name;
  //   res.json({"errcode": 0, "errmsg": "修改成功"});
  // } else {
  res.json({"errcode": 40009, "errmsg": "处理失败"});
  // }
};

/**
 * 修改密码
 * @param req
 * @param res
 */
userController.changepwd = function (req, res) {
  //TODO 未开发
};

/**
 * 通过书名查询，获取图书列表
 * @param req
 * @param res
 */
userController.find = function (req, res) {
  let page = parseInt(req.query.page || 1); //页码（默认第1页）
  let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
  let name = req.query.name || '';
  let total = 0;
  let rltUsers = [];
  // if (name.length > 0) {
  //   let mockUsers = _Users.filter(user => {
  //     return (user.username.indexOf(name) > -1 || user.nickname.indexOf(name) > -1 || user.name.indexOf(name) > -1)
  //   });
  //   total = mockUsers.length; //总条数
  //   rltUsers = mockUsers.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  // } else {
  //   total = _Users.length; //总条数
  //   rltUsers = _Users.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  // }
  res.json({
    total: total,
    limit: limit,
    users: rltUsers
  })
};

module.exports = userController;
