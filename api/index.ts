import https from 'node:https';
import fs from 'node:fs';

import express, { Response } from 'express';
import cors from 'cors';
import morgan = require('morgan');

import globalErrorHandler from '../controllers/ErrorController';
import authRouter from '../routes/authRouter';
import userRouter from '../routes/userRouter';
import facultyRouter from '../routes/facultyRouter';
import moduleRouter from '../routes/moduleRouter';
import yearRouter from '../routes/yearRouter';
import subjectRouter from '../routes/subjectRouter';
import lectureRouter from '../routes/lectureRouter';

import RoleModel from '../models/Role';

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('dev')); // logs to console in development
app.use(cors());
app.use(express.json());

app.get('/', async (_, res: Response) => {
  res.json({ message: 'DocReader Guide - API', status: 'Running' });
});

app.use('/api/v2/', authRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/faculties', facultyRouter);
app.use('/api/v2/years', yearRouter);
app.use('/api/v2/modules', moduleRouter);
app.use('/api/v2/subjects', subjectRouter);
app.use('/api/v2/lectures', lectureRouter);

app.use(globalErrorHandler);

const usesTLS = process.env.TLS_ENABLED === 'True';

if (!usesTLS)
  app.listen(port, async () => {
    console.log(`[server]: HTTP server is running at http://localhost:${port}`);

    await RoleModel.refreshPermissionCache();
  });
else {
  const options = {
    key: fs.readFileSync(process.env.TLS_KEY_PATH!),
    cert: fs.readFileSync(process.env.TLS_CERT_PATH!),
  };

  const server = https.createServer(options, app);

  server.listen(port, async () => {
    console.log(
      `[server]: HTTPS server is running at http://localhost:${port}`,
    );

    await RoleModel.refreshPermissionCache();
  });
}
