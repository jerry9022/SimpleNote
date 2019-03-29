/**
 * Created by jerry on 2018/3/27.
 */
const config = require('../config.js');
const sqlite = require("sqlite");
const dbPromise = sqlite.open(config.dbPath, {Promise});

let articleController = {};

/**
 * 获取文章列表
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
articleController.findList = async function (req, res) {
  let limit = 10;
  try {
    let key = req.query.key || req.body.key || '';
    key = key.replace(/[%\'\"\(\)]/g, ''); //替换掉特殊字符为空并在两边补百分号

    let sqlCount = `SELECT count(1) as total FROM article where (title like '%${key}%' or tags like '%${key}%')`
    let sqlQuery = `SELECT * FROM article where (title like '%${key}%' or tags like '%${key}%')`
    if (!req.session.userId) {
      sqlCount += ' and privacy!=1'
      sqlQuery += ' and privacy!=1'
    }

    let page = req.query.page || req.body.page || 1;
    let offset = (page - 1) * limit;
    const db = await dbPromise;
    const [rows, articles] = await Promise.all([
      db.get(sqlCount),
      db.all(sqlQuery + " order by hot desc,created_at desc limit ? offset ?", limit, offset)
    ]);
    let result = {
      page: page,
      limit: limit,
      total: rows.total,
      items: articles
    }
    res.json(result);
  } catch (ex) {
    console.log(ex)
    res.json({"errcode": 50000, "errmsg": ex.toString()});
  }
}

articleController.findById = async function (req, res) {
  let id = req.params.id; //文章id
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  try {
    const db = await dbPromise;
    let result = await db.get("SELECT * FROM article where id=?", id);
    if (req.query.hot) {
      db.run("update article set hot=hot+1 where id=?", id);
    }

    res.json(result);
  } catch (ex) {
    console.log(ex)
    res.json({"errcode": 50000, "errmsg": ex.toString()});
  }
}

/**
 * 添加文章
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
articleController.add = async function (req, res) {
  let title = req.body.title || ''; //标题
  let summary = req.body.summary || ''; //摘要
  let content = req.body.content || ''; //具体内容
  let tags = req.body.tags || ''; //标签
  let privacy = req.body.privacy || 0;
  if (!title || !summary || !content || !tags) {
    return res.json({"errcode": 40000, "errmsg": "请检查参数，标题、内容及标签都不能为空"});
  }
  if (privacy !== 1 && privacy !== "1") {
    privacy = 0
  }
  try {
    const db = await dbPromise;
    await db.run("insert into article(title,summary,content,tags,privacy) values(?,?,?,?,?)", title, summary, content, tags, privacy);
    res.json({"errcode": 0, "errmsg": "操作成功"});
  } catch (ex) {
    console.log(ex)
    res.json({"errcode": 50000, "errmsg": ex.toString()});
  }
}

/***
 * 修改文章
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
articleController.edit = async function (req, res) {
  let id = req.params.id; //文章id
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  let title = req.body.title || ''; //标题
  let summary = req.body.summary || ''; //摘要
  let content = req.body.content || ''; //具体内容
  let tags = req.body.tags || ''; //标签
  let privacy = req.body.privacy || 0;
  if (!title || !summary || !content || !tags) {
    return res.json({"errcode": 40000, "errmsg": "请检查参数，标题、内容及标签都不能为空"});
  }
  if (privacy !== 1 && privacy !== "1") {
    privacy = 0
  }
  try {
    const db = await dbPromise;
    let result = await db.run("update article set title=?,summary=?,content=?,tags=?,privacy=?,updated_at=datetime('now') where id=?", title, summary, content, tags, privacy, id);
    if (result && result.stmt && result.stmt.changes > 0) {
      res.json({"errcode": 0, "errmsg": "操作成功"});
    } else {
      res.json({"errcode": 40000, "errmsg": "修改失败"});
    }
  } catch (ex) {
    console.log(ex)
    res.json({"errcode": 50000, "errmsg": ex.toString()});
  }

}

module.exports = articleController;
