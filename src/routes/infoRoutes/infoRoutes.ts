import { Router } from 'express';
import { getInfo } from '../../controllers';
import { verifyLink } from '../../middlewares';

const infoRouter = Router();

infoRouter.post('/getinfo',verifyLink, getInfo);

export default infoRouter;
