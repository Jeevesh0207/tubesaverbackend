import { Router } from 'express';
import infoRouter from './infoRoutes/infoRoutes';
import getPlaylistRouter from './getPlaylist/getPlatlist';

const routes = Router();

routes.use('/', infoRouter);
routes.use('/', getPlaylistRouter);

export default routes