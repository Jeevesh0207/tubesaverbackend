import { Router } from 'express';
import infoRouter from './infoRoutes/infoRoutes';
import getPlaylistRouter from './getPlaylist/getPlatlist';
import getVideoRouter from './getVideo/getVideo';
import getAudioRouter from './getAudio/getAudio';

const routes = Router();

routes.use('/', infoRouter);
routes.use('/', getPlaylistRouter);
routes.use('/', getVideoRouter);
routes.use('/',getAudioRouter)

export default routes