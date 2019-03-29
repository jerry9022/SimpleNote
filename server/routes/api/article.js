/**
 * Created by jerry on 2018/3/27.
 * 文档相关路由
 */
var express = require('express');
var router = express.Router();
var indexRouter = {};
var userController = require('../../controllers/user');
var articleController = require('../../controllers/article');

//返回article的集合
router.get('/findlist', articleController.findList);
//返回某一篇文章
router.get('/find/:id', articleController.findById);

//先检查登录
router.use(userController.checkLogin);

router.post('/add', articleController.add);

router.post('/edit/:id', articleController.edit);

indexRouter.router = router;

module.exports = indexRouter;

