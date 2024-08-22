import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors'

import { authRouter, subjectRouter, facultiesDataRouter, userRouter, facultyRouter, moduleRouter, lecturesRouter } from "../routes";

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 8080

app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "DocReader API - For Faculty",
    status: "Running..."
  });
});

app.use('/api/v1', [
  authRouter,
  facultiesDataRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  subjectRouter,
  lecturesRouter
])

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});