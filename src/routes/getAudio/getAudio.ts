import { Router } from 'express';
import { getAudio } from '../../controllers';
import { verifyItag } from '../../middlewares';

const getAudioRouter = Router();

getAudioRouter.post('/getaudio', verifyItag, getAudio);

export default getAudioRouter;
