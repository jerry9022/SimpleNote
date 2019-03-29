/**
 * Created by jerry on 2017/7/6.
 */
var path = require('path');
module.exports = {
  port: 3083,
  publicPath: path.join(__dirname, 'public'),
  dbintiPath: path.join(__dirname, 'sql', 'init.sqlite'),
  dbPath: path.join(__dirname, 'data', 'note.sqlite'),
}
