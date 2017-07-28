import configureMiddleware from './middleware/configure';
import configureRoutes from './routes/configure';

export default function configureApplication(app) {
  configureMiddleware(app);
  configureRoutes(app);
}
