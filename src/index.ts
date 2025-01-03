import express, { Request, Response } from 'express';
import routes from './routes'
import { config } from './config/config';
import { dbConnect } from './database';

const app = express();
const PORT = config.port;


app.use(express.json());



app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    msg: 'Hello!, I am backend',
  });
});

app.use('/api',routes)

// dbConnect();


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export default app