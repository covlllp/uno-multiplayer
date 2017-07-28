import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import morgan from 'morgan';

import proxy from 'proxy-middleware';
import url from 'url';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import webpackConfig from '../../../webpack.config';

export default function setMiddleware(app) {
  // logging
  app.use(morgan('dev'));

  // handle static assets before anything
  if (process.env.NODE_ENV !== 'production') {
    if (!Array.isArray(webpackConfig.entry)) webpackConfig.entry = [webpackConfig.entry];
    webpackConfig.entry.push(
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://0.0.0.0:64321',
    );
    if (!webpackConfig.plugins) webpackConfig.plugins = [];
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(webpackConfig);
    const devServer = new WebpackDevServer(compiler, {
      stats: { colors: true },
      disableHostCheck: true,
    });
    devServer.listen(64321);

    app.use(webpackConfig.output.publicPath, proxy(url.parse('http://0.0.0.0:64321')));
  }

  // various other middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieSession({
    name: 'session',
    keys: ['secret'],
  }));
}
