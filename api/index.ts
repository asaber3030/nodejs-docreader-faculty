import express, { Response } from 'express';
import cors from 'cors';
import morgan = require('morgan');

import globalErrorHandler from '../controllers/ErrorController';
import authRouter from '../routes/authRouter';
import userRouter from '../routes/userRouter';
import facultyRouter from '../routes/facultyRouter';
import RoleModel from '../models/Role';

const app = express();
const port = process.env.APP_PORT || 8080;

app.use(morgan('dev')); // logs to console in development
app.use(cors());
app.use(express.json());

app.get('/', async (_, res: Response) => {
  res.json({ message: 'DocReader Guide - API', status: 'Running' });
});

app.use('/api/v2/', authRouter);
app.use('/api/v2/user', userRouter);
app.use('/api/v2/faculty', facultyRouter);

app.use(globalErrorHandler);

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  await RoleModel.refreshPermissionCache();
});
