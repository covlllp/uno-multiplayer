'use strict';

var morgan = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');


module.exports = function setMiddleware(app) {
  // logging
  app.use(morgan('dev'));

  // handle static assets before anything
  if (process.env.NODE_ENV !== 'production') {
    var webpack = require('webpack');
    var proxy = require('proxy-middleware');
    var WebpackDevServer = require('webpack-dev-server');

    var webpackConfig = require('../../../webpack.config');
    if (!Array.isArray(webpackConfig.entry)) webpackConfig.entry = [webpackConfig.entry];
    webpackConfig.entry.push(
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://0.0.0.0:64321'
    );
    if (!webpackConfig.plugins) webpackConfig.plugins = [];
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    var compiler = webpack(webpackConfig);
    var devServer = new WebpackDevServer(compiler, {
      stats: { colors: true },
      disableHostCheck: true
    });
    devServer.listen(64321);

    var url = require('url');
    app.use(webpackConfig.output.publicPath, proxy(url.parse('http://0.0.0.0:64321')));
  }

  // various other middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true  }));
  app.use(cookieSession({
    name: 'session',
    keys: ['secret']
  }));
}
