import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

//parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
  }),
);

//application route

app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  const a = 10;
  res.json({ result: a });
};

app.get('/', test);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
