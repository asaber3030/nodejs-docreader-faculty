import express from "express";
import dotenv from "dotenv";
import cors from 'cors'

import { showAppURLCMD } from "./utlis/helpers";
import { authRouter, subjectRouter, userRouter, facultyRouter, moduleRouter } from "./routes";

import bcrypt from 'bcrypt'
import db from "./utlis/db";

dotenv.config();

const port = process.env.APP_PORT!
const app = express();

app.use(cors())
app.use(express.json())
app.use('/api/v1', [
  authRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  subjectRouter
])

app.get('/', async (_, res) => {
  const password = await bcrypt.hash("123456789", 10)
  
  await db.user.create({
    data: {
      name: "Abdp",
      email: "a@asadsad.com",
      facultyId: 1,
      yearId: 1,
      password
    }
  })
  return res.status(200).json({
    message: "Faculty API - Documentation",
    info: "To start using the api head to this route: /api/login",
    status: 200,
    password
  })
})

app.listen(port, () => { 
  showAppURLCMD(port!)
})

export default app