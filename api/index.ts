import express, { Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan = require('morgan');

dotenv.config();

import {
  authRouter,
  subjectRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  lecturesRouter,
  yearRouter,
  // quizRouter,
} from '../routes';
import globalErrorHandler from '../controllers/ErrorController';

const app = express();
const port = process.env.APP_PORT || 8080;

app.use(morgan('dev')); // logs to console in development
app.use(cors());
app.use(express.json());

app.get('/', async (_, res: Response) => {
  res.json({ message: 'DocReader Guide - API', status: 'Running' });
});

app.use('/api/v1', [
  authRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  subjectRouter,
  lecturesRouter,
  yearRouter,
  // quizRouter,
]);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
