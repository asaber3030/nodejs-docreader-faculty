import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors'

import { showAppURLCMD } from "../utlis/helpers";
import { authRouter, subjectRouter, facultiesDataRouter, userRouter, facultyRouter, moduleRouter, lecturesRouter, finalRevisionRouter, practicalRouter } from "../routes";

dotenv.config();

const app = express();
const port = 8080

app.use(cors())
app.use(express.json())

app.use('/api', authRouter)

/*app.use('/api/v1', [
  authRouter,
  facultiesDataRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  subjectRouter,
  lecturesRouter,
  finalRevisionRouter,
  practicalRouter
])*/

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "MAIN_FUNCTION",
    status: "APP_STATUS"
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});