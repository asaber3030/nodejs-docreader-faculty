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
import mail from "../../services/mail"
import VerificationCodeTemplate from "../../mail/verification-code"
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
    const newUser = await db.user.create({
      data: {
        ...data,
        status: true,
        password: hashedPassword
      }
    })

    const { password, ...mainUser } = newUser
    const token = jwt.sign(mainUser, AuthController.secret!)

    /* const code = await Verification.create(mainUser.id) */

    /* try {
      mail.sendMail({
        subject: `${findFaculty.name} - Verify Your E-mail!`,
        html: VerificationCodeTemplate(code, findFaculty.name),
        to: 'abdulrahmansaber120@gmail.com',
        from: 'abdulrahmansaber120@gmail.com',
      })
    } catch (error) {
      return res.status(201).json({
        message: "ERRR",
        status: 500,
        data: error
      })
    } */

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

    const isVerified = await Verification.verify(user?.id, data?.code as string)

    /* if (!isVerified) return res.status(400).json({ message: "Failed to verify account. Code could be expired." })
    return res.status(200).json({ message: "Account verified successfully." }) */

    return res.status(200).json({
      ...body.data,
      user,
      isVerified
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

}