import devConfig from './development';
import productionConfig from './production';

const config = process.env.NODE_ENV === 'production' ? productionConfig : devConfig;

export default config;
