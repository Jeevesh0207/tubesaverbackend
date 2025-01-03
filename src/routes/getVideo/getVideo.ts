import { Router } from 'express';
import { getVideo } from '../../controllers';
import { verifyItag } from '../../middlewares';

const getVideoRouter = Router();

getVideoRouter.post('/getvideo',verifyItag, getVideo);

export default getVideoRouter;
