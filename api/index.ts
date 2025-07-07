import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import {
  authRouter,
  subjectRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  lecturesRouter,
  yearRouter,
  quizRouter,
  practicalQuizRouter,
} from "../routes";
import path from "path";

const app = express();
const port = process.env.APP_PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", async (_, res: Response) => {
  res.json({ message: "DocReader Guide - API", status: "Running" });
});

app.use("/api/v1", [
  authRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  subjectRouter,
  lecturesRouter,
  yearRouter,
  quizRouter,
  practicalQuizRouter,
]);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
