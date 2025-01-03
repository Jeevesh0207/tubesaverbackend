import { Router } from 'express';
import { getPlaylist } from '../../controllers';
import { verifyPlaylist } from '../../middlewares';

const getPlaylistRouter = Router();

getPlaylistRouter.post('/getplaylist',verifyPlaylist, getPlaylist);

export default getPlaylistRouter;
