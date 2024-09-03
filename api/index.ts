import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "../utlis/db"

import { authRouter, subjectRouter, facultiesDataRouter, userRouter, facultyRouter, moduleRouter, lecturesRouter, yearRouter } from "../routes"

dotenv.config()

const app = express()
const port = process.env.APP_PORT || 8080

app.use(cors())
app.use(express.json())

app.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "DocReader Guide - API", status: "Running" })
})

app.use("/api/v1", [authRouter, facultiesDataRouter, userRouter, facultyRouter, moduleRouter, subjectRouter, lecturesRouter, yearRouter])

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
