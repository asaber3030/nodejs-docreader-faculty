import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import https from "node:https";
import fs from "node:fs";

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
const port = process.env.PORT || 8080;

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

if (process.env.USE_TLS === "False")
  app.listen(port, () => {
    console.log(
      `[server]: HTTP server is running at https://localhost:${port}`
    );
  });
else {
  const options = {
    key: fs.readFileSync(process.env.TLS_KEY_PATH!),
    cert: fs.readFileSync(process.env.TLS_CERT_PATH!),
  };

  https.createServer(options, app).listen(port, () => {
    console.log(
      `[server]: HTTPS server is running at https://localhost:${port}`
    );
  });
}
