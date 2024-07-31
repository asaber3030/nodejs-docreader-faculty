import { Request, Response } from "express"

import { z } from "zod"
import { badRequest, notFound, send, unauthorized } from "../../utlis/responses"
import { extractErrors, extractToken } from "../../utlis/helpers"
import { userSchema } from "../../schema"

import { User as TUser } from "@prisma/client"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import db from "../../utlis/db"

import User from "../models/User"
import Faculty from "../models/Faculty"
import Verification from "../models/VerificationCode"

export default class AuthController {
  
  static secret: string = process.env.APP_USER_SECRET!;

  async login(req: Request, res: Response) {
    
    const body = userSchema.login.safeParse(req.body)
    const data = body.data

    if (!body.success) {
      const errors = extractErrors(body)
      return res.status(400).json({
        errors,
        message: "Form validation errors."
      })
    }
    if (!data) return send(res, "No data was submitted.", 409)

    const user = await User.findBy(data.email)
    if (!user) return notFound(res, "No User was found")
    
    const comparePasswords = await bcrypt.compare(data.password, user.password)
    if (!comparePasswords) {
      return res.status(400).json({
        message: "Invalid email or password."
      })
    }

    const { password, ...mainUser } = user

    if (!user.status) return unauthorized(res, "Please verify your e-mail before trying to login.")

    const token = jwt.sign(mainUser, AuthController.secret!)

    return res.status(200).json({
      message: "Logged in successfully.",
      status: 200,
      data: { token, user: mainUser }
    })

  }

  async register(req: Request, res: Response) {
    
    const body = userSchema.register.safeParse(req.body)
    const data = body.data

    if (!body.success) {
      const errors = extractErrors(body)
      return res.status(400).json({
        errors,
        message: "Form validation errors.",
        status: 400
      })
    }

    if (!data) {
      return res.status(400).json({
        message: "Please check there's valid JSON data in the request body.",
        status: 400
      }) 
    }

    const userByEmail = await User.findBy(data.email)
    if (userByEmail) {
      return res.status(409).json({
        message: "E-mail Already exists.",
        status: 409
      })
    }

    const findFaculty = await Faculty.find(data.facultyId)
    if (!findFaculty) return notFound(res, "Faculty doesn't exist with provided Id: " + data.facultyId)

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const { confirmationPassword, ...restData } = data

    const newUser = await db.user.create({
      data: {
        ...restData,
        status: true,
        password: hashedPassword
      }
    })

    const { password, ...mainUser } = newUser
    const token = jwt.sign(mainUser, AuthController.secret!)

    return res.status(201).json({
      message: "User Registered successfully",
      status: 201,
      data: {
        user: mainUser,
        token
      }
    })

  }

  async verifyAccount(req: Request, res: Response) {
    const body = req.body
    const schema = z.object({ code: z.string(), email: z.string().email({ message: "Invalid Email" }) })
    const parsedBody = schema.safeParse(body)
    const errors = extractErrors(parsedBody)
    const data = parsedBody.data

    if (!parsedBody.success) return res.status(400).json({ message: "Validation errors", errors })

    const user = await db.user.findUnique({
      where: { email: data?.email }
    })
    if (user?.status) return send(res, "User has already verified his account before.", 409)
    if (!user) return notFound(res, "User doesn't exist.")

    return res.status(200).json({
      ...body.data,
      user,
    
    })
  }

  async isAuthenticated(req: Request, res: Response) {

    const token = extractToken(req.headers.authorization!)
    try {
      const userData = jwt.verify(token, AuthController.secret) as TUser
      if (!userData) return badRequest(res, "Invalid token.")
      const findUser = await User.find(userData.id)
      if (!findUser) return res.status(200).json({
        message: "Authorized",
        status: 402,
        data: {
          authorized: false
        }
      })
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized",
        status: 401,
        data: {
          authorized: false
        }
      })
    }
    return res.status(200).json({
      message: "Authorized",
      status: 200,
      data: {
        authorized: true
      }
    })

  }

  static async user(req: Request, res: Response) {

    const token = extractToken(req.headers.authorization!)
    try {
      const userData = jwt.verify(token, AuthController.secret) as TUser
      const user = await db.user.findUnique({ where: { id: userData?.id } })
      return user
    } catch (error) {
      return null
    }

  }

  async getUserData(req: Request, res: Response) {
    const token = extractToken(req.headers.authorization!)
    try {
      const tokenData = jwt.verify(token, AuthController.secret) as TUser
      const user = await db.user.findUnique({ where: { id: tokenData?.id }, include: { faculty: true, year: true } })
      if (!user) return unauthorized(res, "User doesn't exist. Unauthorized")
      const { password, ...mainUser } = user
      return send(res, "User data", 200, mainUser)
    } catch (error) {
      return unauthorized(res, "User doesn't exist. Unauthorized")
    }
  }

}