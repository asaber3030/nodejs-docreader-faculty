import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import cors from 'cors'

import { showAppURLCMD } from "../utlis/helpers";
import { authRouter, subjectRouter, facultiesDataRouter, userRouter, facultyRouter, moduleRouter, lecturesRouter, finalRevisionRouter, practicalRouter } from "../routes";

import LectureController from "../http/controllers/LectureController";
import PracticalController from "../http/controllers/PracticalController";
import AuthController from "../http/controllers/AuthController";
import UserController from "../http/controllers/UserController";
import ModuleController from "../http/controllers/ModuleController";
import SubjectController from "../http/controllers/SubjectController";
import FinalRevisionController from "../http/controllers/FinalRevisionController";

dotenv.config();

const app = express();
const port = 8080

app.use(cors())
app.use(express.json())

const router = Router()

router.get('/test-api', (req, res) => {
  res.json({
    api: "test-api"
  })
})

app.use(router)

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