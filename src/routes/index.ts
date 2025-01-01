import { Router } from 'express';
import infoRouter from './infoRoutes/infoRoutes';

const routes = Router();

routes.use('/api', infoRouter);

export default routes